"use strict";
import express from "express";
import { router as authRouter } from "./auth.js";
import usersRouter from "./users.js";
import issuesRouter from "./issues.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/issues", issuesRouter);

router.get("/location-data", async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${lat},${lon}`
    );
    const data = await response.json();
    const cityName = data.location?.name;
    const temp = data.current?.temp_c;
    const weatherDesc = data.current?.condition?.text;
    res.status(200).json({ cityName, temp, weatherDesc });
  } catch (error) {
    next(error);
  }
});

export default router;
