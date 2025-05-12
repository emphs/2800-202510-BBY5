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
app.use(json());

app.use(expressStatic(join(__dirname, "../civicfix_front_react_js/dist")));

//TODO auth middleware

app.get("/", (req, res) => {
  res.status(200).sendFile(join(__dirname, "../civicfix_front_react_js/dist", "index.html"));
});

app.get("/issues/gen-description", async (req, res) => {
  try {
    //TODO maybe add type and other parameters to increase description accuracy?
    const { title, location } = req.query;

    console.log("Generating description for title: ", title);
    console.log("Generating description for location: ", location);

    const { text: description } = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: `In our local community issue reporting app, CivicFix, the user has entered a title for an issue they wish to report. Generate a 2-3 sentence description for this issue based on the provided issue title and issue location.
        \nIssue title: ${title}
        \nIssue location: ${location}`,
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
  console.log(`The Prime Cut is listening on ${process.env.PORT}!`);
});
