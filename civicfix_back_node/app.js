"use strict";
import express, { json, static as expressStatic } from "express";
import { join, dirname, resolve } from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import "dotenv/config";
import apiRouter from "./api/index.js";


process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});

// --- Environment Variable Checks ---
const requiredEnv = [
  "AIVEN_HOST",
  "AIVEN_PORT",
  "AIVEN_USER",
  "AIVEN_PASSWORD",
  "AIVEN_DATABASE",
  "GEMINI_API_KEY",
  "WEATHERAPI_API_KEY",
  "PORT",
];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const staticPath = resolve(__dirname, "../civicfix_front_react_js/dist");
const indexPath = resolve(staticPath, "index.html");

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

app.use(json());
app.use(expressStatic(staticPath));

app.use("/api", apiRouter);

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// app.get('/api/me', async (req, res) => {
//   if (
//     !req.session ||
//     !req.session.userId ||
//     !req.session.username ||
//     !req.session.email ||
//     !req.session.userType
//   ) {
//     return res.status(401).json({ message: 'Not logged in or session incomplete' });
//   }
//   // Fetch latest user info from MySQL
//   try {
//     const [rows] = await mysqlPool.query(
//       'SELECT id, username, email, userType FROM users WHERE id = ?',
//       [req.session.userId]
//     );
//     if (!rows.length) return res.status(404).json({ message: 'User not found' });
//     const user = rows[0];
//     res.json({
//       userId: user.id,
//       userType: user.userType,
//       email: user.email,
//       username: user.username
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to fetch user info' });
//   }
// });

// --- SPA Fallback for Frontend Routing ---
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api") && !req.path.includes(".")) {
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

app.listen(process.env.PORT, () => {
  console.log(`CivicFix is listening on http://localhost:${process.env.PORT}`);
});
