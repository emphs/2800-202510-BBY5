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

export default router;
