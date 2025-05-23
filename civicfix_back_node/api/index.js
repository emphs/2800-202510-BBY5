"use strict";
import express from "express";
import { router as authRouter, isAuthenticated } from "./auth.js";
import usersRouter from "./users.js";
import issuesRouter from "./issues.js";
import signupRouter from "./signup.js";
import loginRouter from "./login.js";
import logoutRouter from "./logout.js";
import locationRouter from "./location.js";
import authorizeRouter from "./authorize.js";
import adminRouter from "./admin.js";
import changePasswordRouter from "./change_password.js";
import modifyProfileRouter from "./modify_profile.js";
import meRouter from "./me.js";
import mysqlPool from "../db.js";

const router = express.Router();

// Attach mysqlPool to req for relevant routes
const attachMysqlPool = (req, res, next) => { req.mysqlPool = mysqlPool; next(); };

router.use("/auth", authRouter);
router.use("/users", attachMysqlPool, usersRouter);
router.use("/issues", issuesRouter);
router.use("/signup", attachMysqlPool, signupRouter);
router.use("/login", attachMysqlPool, loginRouter);
router.use("/change-password", attachMysqlPool, changePasswordRouter);
router.use("/logout", logoutRouter);
router.use("/location", locationRouter);
router.use("/authorize", authorizeRouter);
router.use("/admin", attachMysqlPool, adminRouter);
router.use("/modify_profile", attachMysqlPool, modifyProfileRouter);
router.use("/me", meRouter);

router.get("/location-data", isAuthenticated, async (req, res, next) => {
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
