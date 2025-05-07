import express, { json, static as expressStatic } from "express";
import { createPool } from "mysql2/promise";
import { readFileSync } from "fs";
import "dotenv/config";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

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

app.use(json());
// app.use(express.static(join(__dirname, "../civicfix_front_react_js/dist")));

app.get("/issues", async (req, res) => {
  const [issues] = await pool.query("SELECT id, title, type, status FROM issues WHERE user = ?;", [
    req.session.userid,
  ]);
  res.status(200).json(issues);
});

app.listen(process.env.PORT, () => {
  console.log(`The Prime Cut is listening on ${process.env.PORT}!`);
});
