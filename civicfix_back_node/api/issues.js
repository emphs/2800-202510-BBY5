"use strict";

import express from "express";
import { GoogleGenAI } from "@google/genai";
import pool from "../db.js";
import { requireAdmin, isAuthenticated } from "./auth.js";

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const REQ_ISSUE_FIELDS = ["type", "title", "description", "creator_id", "lat", "lon"];

router.use(isAuthenticated);

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

router.get("/", requireAdmin, async (req, res) => {
  try {
    const [rows] = await req.mysqlPool.query(
      "SELECT id, title, type, status, creator_id FROM issues ORDER BY title ASC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Admin get reports error:", err);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
});

router.get("/gen-description", async (req, res, next) => {
  try {
    const { title, location } = req.query;
    const { text: description } = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: `In our local community issue reporting app, CivicFix, the user has entered a title for an issue they wish to report. Generate a 2-3 sentence description for this issue based on the provided issue title. Return absolutely nothing but the description as this will be served to the user.
        \nIssue title: ${title}`,
      // \nIssue location: ${location}`,
    });
    res.status(200).json({ description });
  } catch (error) {
    next(error);
  }
});

router.get("/user", async (req, res, next) => {
  try {
    const [issues] = await pool.query(
      "SELECT id, title, type, status FROM issues WHERE creator_id = ?;",
      [req.session.userId]
    );
    res.status(200).json(issues);
  } catch (err) {
    next(err);
  }
});

router.get("/search", async (req, res) => {});

router.post("/issue", async (req, res, next) => {
  const { body } = req;
  const [error, values] = validateFields(body);

  if (error) return res.status(400).send(error);

  const connection = await pool.getConnection();

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

router.put("/issue/:id", async (req, res, next) => {
  const { body } = req;
  const issueId = req.params.id;
  const [error, values] = validateFields(body);

  if (error) return res.status(400).send(error);

  const connection = await pool.getConnection();

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

export default router;
