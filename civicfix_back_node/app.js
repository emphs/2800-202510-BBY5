// --- Imports and Setup ---
import express, { json, static as expressStatic } from "express";
import { createPool as createMySQLPool } from "mysql2/promise"; // MySQL pool for issues
import { Pool as PgPool } from "pg"; // PostgreSQL pool for users/auth
import { readFileSync } from "fs";
import "dotenv/config";
import { join, dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import session from "express-session";
import signupRouter from "./api/signup.js";
import loginRouter from "./api/login.js";
import logoutRouter from "./api/logout.js";
import locationRouter from "./api/location.js";
import authorizeRouter from "./api/authorize.js";
import adminRouter from "./api/admin.js";

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

// --- Environment Variable Checks ---
const requiredEnv = [
  "DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_DATABASE", // PostgreSQL for users
  "AIVEN_HOST", "AIVEN_PORT", "AIVEN_USER", "AIVEN_PASSWORD", "AIVEN_DATABASE", // MySQL for issues
  "GEMINI_API_KEY", "PORT"
];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const staticPath = resolve(__dirname, "../civicfix_front_react_js/dist");
const indexPath = resolve(staticPath, "index.html");

// --- Session Middleware (required for req.session) ---
app.use(
  session({
    secret: process.env.SESSION_SECRET || "civicfix_default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // set to true if using HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// --- PostgreSQL Pool (for users/auth) ---
const pgPool = new PgPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: { rejectUnauthorized: false },
});

// --- MySQL Pool (for issues) ---
const mysqlPool = await createMySQLPool({
  host: process.env.AIVEN_HOST,
  port: process.env.AIVEN_PORT,
  user: process.env.AIVEN_USER,
  password: process.env.AIVEN_PASSWORD,
  database: process.env.AIVEN_DATABASE,
  ssl: { ca: readFileSync(__dirname + "/ca.pem") },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const REQ_ISSUE_FIELDS = ["type", "title", "description", "creator_id", "lat", "lon"];

// --- Middleware ---
app.use(json());
app.use(expressStatic(staticPath));

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// --- API Routers ---
// Pass correct pool to routers as needed
app.use("/api/signup", (req, res, next) => { req.pgPool = pgPool; next(); }, signupRouter);
app.use("/api/login", (req, res, next) => { req.pgPool = pgPool; next(); }, loginRouter);
console.log("Mounted /api/login router");
app.use("/api/logout", logoutRouter);
app.use("/api/location", locationRouter);
app.use("/api/authorize", authorizeRouter);
app.use("/api/admin", (req, res, next) => {
  req.pgPool = pgPool;
  req.mysqlPool = mysqlPool;
  next();
}, adminRouter);

app.get('/api/me', (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  res.json({
    userId: req.session.userId,
    userType: req.session.userType,
    email: req.session.email, // or username
  });
});

// --- API Endpoints (MySQL for issues) ---
app.get("/api/user/issues", async (req, res, next) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Not logged in" });
    }
    const [issues] = await mysqlPool.query(
      "SELECT id, title, type, status FROM issues WHERE user = ?;",
      [req.session.userId]
    );
    res.status(200).json(issues);
  } catch (err) {
    next(err);
  }
});

app.put("/api/issue/:id", async (req, res, next) => {
  const { body } = req;
  const issueId = req.params.id;
  const [error, values] = validateFields(body);
  if (error) return res.status(400).send(error);
  const connection = await mysqlPool.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.execute(
      `UPDATE issues
         SET type        = ?,
             title       = ?,
             description = ?,
             creator_id  = ?,
             location    = ST_GeomFromText(CONCAT('POINT(', ?, ' ', ?, ')'), 4326)
       WHERE id = ?`,
      [...values, req.params.id]
    );
    await connection.commit();
    if (result.affectedRows == 0) {
      return res.status(404).json({ message: "Issue not found" });
    }
    res.status(200).json({ message: "Issue updated", issueId: result.insertId });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
});

app.post("/api/issue", async (req, res, next) => {
  const { body } = req;
  const [error, values] = validateFields(body);
  if (error) return res.status(400).send(error);
  const connection = await mysqlPool.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.execute(
      `INSERT INTO issues (type, title, description, creator_id, location)
       VALUES (?, ?, ?, ?, ST_GeomFromText(CONCAT('POINT(', ?, ' ', ?, ')'), 4326));`,
      values
    );
    await connection.commit();
    res.status(200).json({ message: "Issue created", issueId: result.insertId });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
});

function validateFields(body) {
  const values = [];
  for (const field of REQ_ISSUE_FIELDS) {
    if (!body[field]) {
      return [`Field ${field} is required`, []];
    }
    values.push(body[field]);
  }
  return [null, values];
}

app.get("/api/issues/gen-description", async (req, res, next) => {
  try {
    const { title, location } = req.query;
    const { text: description } = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: `In our local community issue reporting app, CivicFix, the user has entered a title for an issue they wish to report. Generate a 2-3 sentence description for this issue based on the provided issue title and issue location.\nIssue title: ${title}\nIssue location: ${location}`,
    });
    res.status(200).json({ description });
  } catch (error) {
    next(error);
  }
});

app.get("/api/location-data", async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${lat},${lon}`
    );
    const data = await response.json();
    const cityName = data.location?.name;
    const temp = data.current?.temp_c;
    const weatherDesc = data.current?.condition?.text;
    res.status(200).json({ cityName, temp, weatherDesc });
  } catch (error) {
    next(error);
  }
});

// --- SPA Fallback for Frontend Routing ---
app.use((req, res, next) => {
  if (
    req.method === "GET" &&
    !req.path.startsWith("/api") &&
    !req.path.includes(".")
  ) {
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error("sendFile error:", err);
        res.status(500).send("Failed to load index.html");
      }
    });
  } else {
    next();
  }
});

// --- Centralized Error Handler ---
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// --- Start Server ---
app.listen(process.env.PORT, () => {
  console.log(`CivicFix is listening on http://localhost:${process.env.PORT}`);
});
