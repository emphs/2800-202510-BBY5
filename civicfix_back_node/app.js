import express, { json, static as expressStatic } from "express";
import { createPool } from "mysql2/promise";
import { readFileSync } from "fs";
import "dotenv/config";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

const pool = createPool({
  host: process.env.AIVEN_HOST,
  port: process.env.AIVEN_PORT,
  user: process.env.AIVEN_USER,
  password: process.env.AIVEN_PASSWORD,
  database: process.env.AIVEN_DATABASE,
  ssl: {
    ca: readFileSync(__dirname + "/ca.pem"),
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const REQ_ISSUE_FIELDS = ["type", "title", "description", "creator_id", "lat", "lon"];

app.use(json());
// app.use(expressStatic(join(__dirname, "../civicfix_front_react_js/dist")));

//TODO auth middleware

app.get("/user/issues", async (req, res) => {
  //not sure where we will be storing user id yet
  const [issues] = await pool.query("SELECT id, title, type, status FROM issues WHERE user = ?;", [
    req.session.userid,
  ]);
  res.status(200).json(issues);
});

app.put("/issue/:id", async (req, res) => {
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

    console.error(`Error updating issue with id: ${issueId}`, error);
    res.status(500).json({ message: `Error updating issue with id: ${issueId}`, error });
  } finally {
    connection.release();
  }
});

app.post("/issue", async (req, res) => {
  const { body } = req;

  const [error, values] = validateFields(body);
  if (error) return res.status(400).send(error);

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const [result] = await connection.execute(
      `
      INSERT INTO issues (type, title, description, creator_id, location) 
      VALUES (?, ?, ?, ?, ST_GeomFromText(
        CONCAT('POINT(', ?, ' ', ?, ')'), 4326));
    `,
      values
    );
    await connection.commit();

    res.status(200).json({ message: "Issue created", issueId: result.insertId });
  } catch (error) {
    await connection.rollback();
    console.error("Error creating issue", error);
    res.status(500).json({ message: "Error creating issue", error });
  } finally {
    connection.release();
  }
});

/**
 * Validates that all required fields are present in the request body.
 *
 * @param {Object} body - The request body containing fields to validate.
 * @returns {[string|null, Array]} - Returns an error message and empty array if a required field is missing,
 *                                   otherwise returns null and an array of field values.
 */
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

app.get("/issues/gen-description", async (req, res) => {
  try {
    //TODO maybe add type and other parameters to increase description accuracy?
    const { title, location } = req.query;

    console.log("Generating description for title: ", title);
    console.log("Generating description for location: ", location);

    const { text: description } = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: `In our local community issue reporting app, CivicFix, the user has entered a title for an issue they wish to report. Generate a 2-3 sentence description for this issue based on the provided issue title. Return absolutely nothing but the description as this will be served to the user.
        \nIssue title: ${title}`,
      // \nIssue location: ${location}`,
    });

    console.log("Generated description: ", description);
    res.status(200).json({ description });
  } catch (error) {
    console.error("Error generating description", error);
    res.status(500).json({ message: "Error generating description", error });
  }
});

app.get("/location-data", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    const {
      location: { name: cityName },
      current: {
        temp_c: temp,
        condition: { text: weatherDesc },
      },
    } = JSON.parse(
      await fetch(
        `http://api.weatherapi.com/v1/current.json?key${process.env.WEATHER_API_KEY}&q=${lat},${lon}`
      )
    );

    res.status(200).json({
      cityName,
      temp,
      weatherDesc,
    });
  } catch (error) {
    console.error("Error fetching location data", error);
    res.status(500).json({ message: "Error fetching location data", error });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`CivicFix is listening on ${process.env.PORT}!`);
});
