"use strict";
import express, { json, static as expressStatic } from "express";
import "dotenv/config";
import { join, dirname, resolve } from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import apiRouter from "./api/index.js";
import "dotenv/config";

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
app.use(expressStatic(join(__dirname, "../civicfix_front_react_js/dist")));
app.use(express.urlencoded({ extended: false }));
app.use(expressStatic(staticPath));
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.status(200).sendFile(join(__dirname, "../civicfix_front_react_js/dist", "index.html"));
});

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

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

app.listen(process.env.PORT, () => {
  console.log(`CivicFix is listening on http://localhost:${process.env.PORT}`);
});
