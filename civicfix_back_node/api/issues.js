"use strict";

import express from "express";
import { GoogleGenAI } from "@google/genai";
import pool from "../db.js";
import { requireAdmin, isAuthenticated } from "./auth.js";

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const REQ_ISSUE_FIELDS = ["type", "title", "description", "y", "x"];

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

router.get("/admin", requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, title, type, status, creator_id FROM issues ORDER BY title ASC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Admin get reports error:", err);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
});

router.get("/get_issues", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM issues ORDER BY title ASC");
    res.json(rows);
  } catch (err) {
    console.error("get reports error:", err);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
});

router.get("/", async (req, res) => {
  try {
    const [issues] = await pool.query(
      `
      SELECT 
        i.id,
        i.title,
        i.type,
        i.description,
        i.date_created,
        u.username,
        i.location,
        i.status,
        COALESCE(SUM(v.vote),0) AS vote_total,
        COALESCE(MAX(CASE WHEN v.user_id = ? THEN v.vote END), 0) AS user_voted
      FROM
          issues i
              INNER JOIN
          users u ON i.creator_id = u.id
              LEFT JOIN
          votes v ON i.id = v.issue_id
      GROUP BY
        i.id, i.title, i.type, i.description,
        i.date_created, u.username, i.location, i.status;
      `,
      [req.session.userId]
    );

    res.status(200).json(issues);
  } catch (error) {
    console.log("Error fetching issues", error);
    res.status(500).json({ message: "Error fetching issues", error });
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

router.post("/", async (req, res, next) => {
  const { body } = req;
  const { userId } = req.session;
  const [error, values] = validateFields(body);

  console.log(values)

  if (error) return res.status(400).send(error);

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const [result] = await connection.execute(
      `INSERT INTO issues (type, title, description, location, creator_id)
       VALUES (?, ?, ?, ST_GeomFromText(CONCAT('POINT(', ?, ' ', ?, ')'), 4326), ?);`,
        [...values, userId]
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

router.put("/:id", async (req, res, next) => {
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

router.post("/vote", async (req, res) => {
  const { userId } = req.session;
  const { issueId, vote } = req.body;

  console.log("User ID:", userId);
  console.log("Issue ID:", issueId);
  console.log("Vote:", vote);

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const [result] = await connection.execute(
      "INSERT INTO votes (user_id, issue_id, vote) VALUES (?, ?, ?)",
      [userId, issueId, vote]
    );
    await connection.commit();

    res.status(200).json({ message: "Vote created", voteId: result.insertId });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
});

router.put("/vote/:id", async (req, res) => {
  const { userId } = req.session;
  const { id: issueId } = req.params;
  const { vote } = req.body;

  console.log("User ID:", userId);
  console.log("Issue ID:", issueId);
  console.log("Vote:", vote);

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const [result] = await connection.execute(
      `UPDATE votes SET vote = ? WHERE user_id = ? AND issue_id = ?`,
      [req.body.vote, req.session.userId, req.params.id]
    );
    await connection.commit();
    if (result.affectedRows == 0) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.status(200).json({ message: "Vote updated", issueId: result.insertId });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
});

export default router;
