import express, { json, static as expressStatic } from "express";
import { createPool } from "mysql2/promise";
import { readFileSync } from "fs";
import "dotenv/config";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Setup __dirname for ES Modules
const __dirname = dirname(fileURLToPath(import.meta.url));

// Initialize Express
const app = express();
app.use(json());

// Serve static frontend
app.use(expressStatic(join(__dirname, "../civicfix_front_react_js/dist")));

// TODO auth middleware

// Serve main frontend file for root
app.get("/", (req, res) => {
  res.status(200).sendFile(join(__dirname, "../civicfix_front_react_js/dist", "index.html"));
});

// Weather API route
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
        `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${lat},${lon}`
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

//  ADD YOUR REPORTS ROUTE HERE
import reportsRoute from "./routes/reports.js";
app.use("/api/reports", reportsRoute);

// Start the server (only once)
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`The Prime Cut is listening on port ${PORT}`);
});
