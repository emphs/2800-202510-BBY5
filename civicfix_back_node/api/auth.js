"use strict";
import express from "express";
import bcrypt from "bcrypt";
import pool from "../db.js";

const router = express.Router();

function isAuthenticated(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Unauthorized: Must be logged in" });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session || req.session.userType !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  next();
}

router.get("/authenticated", isAuthenticated, (req, res) => {
  res.json({
    userId: req.session.userId,
    userType: req.session.userType,
    email: req.session.email,
    username: req.session.username,
  });
});

router.get("/authorized", requireAdmin, (req, res) => {
  res.json({ authorized: req.session.userType === "admin", userType: req.session.userType });
});

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );
    const user = result.rows[0];

    req.session.userId = user.id;
    req.session.userType = user.user_type;
    req.session.email = user.email;
    req.session.username = user.username;

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    if (err.code === "23505") {
      res.status(409).json({ message: "Username or email already exists" });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Use the shared pool from req.pgPool
    const [result] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (result.length === 0) {
      console.log(`Failed login: email not found (${email})`);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      console.log(`Failed login: incorrect password for email (${email})`);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    req.session.userId = user.id;
    req.session.userType = user.user_type;
    req.session.email = user.email;
    req.session.username = user.username;
    res.json({ message: "Login successful" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.clearCookie("civicfix.sid"); // optional: clear session cookie
      res.json({ message: "Logout successful" });
    });
  } else {
    res.status(200).json({ message: "No active session" });
  }
});

export { router, requireAdmin, isAuthenticated };
