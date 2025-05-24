"use strict";
import express from "express";
import bcrypt from "bcrypt";
import pool from "../db.js";

const router = express.Router();

/**
 * Checks if the user is authenticated by verifying the presence of a valid session.
 * Returns 401 Unauthorized if the user is not logged in.
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} next - Express next function
 */
function isAuthenticated(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Unauthorized: Must be logged in" });
  }
  next();
}

/**
 * Checks if the user is an admin by verifying the presence of a valid session
 * with type equal to "admin". Returns 403 Forbidden if the user is not an admin.
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} next - Express next function
 */
function requireAdmin(req, res, next) {
  if (!req.session || req.session.userType !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  next();
}

router.get("/authenticated", isAuthenticated, async (req, res) => {
  if (
    !req.session ||
    !req.session.userId ||
    !req.session.username ||
    !req.session.email ||
    !req.session.userType
  ) {
    return res.status(401).json({ message: "Not logged in or session incomplete" });
  }
  // Fetch latest user info from MySQL
  try {
    const [rows] = await pool.query(
      "SELECT id, username, email, user_type FROM users WHERE id = ?",
      [req.session.userId]
    );
    if (!rows.length) return res.status(404).json({ message: "User not found" });
    const user = rows[0];
    res.json({
      userId: user.id,
      userType: user.user_type,
      email: user.email,
      username: user.username,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user info" });
  }
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

    const [{ insertId: userId }] = await pool.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );
    const [[user]] = await pool.query("SELECT * FROM users WHERE id = ?", [userId]);

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
  console.log("req.body:", req.body);

  const { email, password } = req.body;

  try {
    const [result] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (result.length === 0) {
      console.log(`Failed login: email not found (${email})`);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const [user] = result;
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

router.post("/change-password", isAuthenticated, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Both current and new password are required" });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [req.session.userId]);
    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const [user] = rows;
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = ? WHERE id = ?", [
      hashedPassword,
      req.session.userId,
    ]);
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Error in /api/change-password:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export { router, requireAdmin, isAuthenticated };
