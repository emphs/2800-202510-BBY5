"use strict";

import express from "express";
import { requireAdmin } from "./auth.js";
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

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [result] = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

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
    res.json({ message: "Login successful" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
