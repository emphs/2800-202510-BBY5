"use strict";

import express from "express";
import { requireAdmin, isAuthenticated } from "./auth.js";
import pool from "../db.js";

const router = express.Router();

router.get("/", requireAdmin, async (req, res) => {
  try {
    const [users] = await pool.query("SELECT id, email, user_type FROM users ORDER BY email ASC");
    res.json(users);
  } catch (err) {
    console.error("Admin get users error:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

router.post("/change-username", isAuthenticated, async (req, res) => {
  const { username } = req.body;
  if (!username || typeof username !== "string" || username.trim() === "") {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    // Check if username is already taken by another user
    const [check] = await pool.query("SELECT id FROM users WHERE username = ? AND id <> ?", [
      username,
      req.session.userId,
    ]);
    if (check.length > 0) {
      return res.status(409).json({ message: "Username already taken" });
    }
    const [result] = await pool.query("UPDATE users SET username = ? WHERE id = ?", [
      username,
      req.session.userId,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    req.session.username = username;
    res.json({ message: "Profile updated", username });
  } catch (err) {
    console.error("Error in /api/modify-profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
