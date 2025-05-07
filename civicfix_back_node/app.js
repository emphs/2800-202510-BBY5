import express, { json, static as expressStatic } from "express";
import { createPool } from "mysql2/promise";
import { readFileSync } from "fs";
import dotenv from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(json());

app.use(express.static(join(__dirname, "../civicfix_front_react_js/dist")));

app.get("/", (req, res) => {
  res.status(200).sendFile(join(__dirname, "../civicfix_front_react_js/dist", "index.html"));
});

app.listen(process.env.PORT, () => {
  console.log(`The Prime Cut is listening on ${process.env.PORT}!`);
});
