import express, { json, static as expressStatic } from "express";
<<<<<<< HEAD
import { Pool } from "pg";
import dotenv from "dotenv";
import { join, dirname, resolve } from "path";
=======
import { createPool } from "mysql2/promise";
import { readFileSync } from "fs";
import "dotenv/config";
import { join, dirname } from "path";
>>>>>>> af240e49a0addae79c45d25cda9f08689cb68ac5
import { fileURLToPath } from "url";
import session from "express-session";
import bcrypt from "bcrypt";
import signupRouter from "./api/signup.js";
import loginRouter from "./api/login.js";
import logoutRouter from "./api/logout.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

const staticPath = resolve(__dirname, "../civicfix_front_react_js/dist");
const indexPath = resolve(staticPath, "index.html");


// PostgreSQL pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }
});

app.use(json());
app.use(expressStatic(staticPath));

app.use(session({
  key: "civicfix.sid",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

app.use("/api", signupRouter);
app.use("/api", loginRouter);
app.use("/api", logoutRouter);

// // Login route
// app.post("/api/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

//     if (result.rows.length === 0) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     const user = result.rows[0];
//     const match = await bcrypt.compare(password, user.password);

//     if (!match) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     req.session.userId = user.id;
//     res.json({ message: "Login successful" });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Signup route
// app.post("/api/signup", async (req, res) => {
// 	const { username, email, password } = req.body;

// 	if (!username || !email || !password) {
// 		return res.status(400).json({ message: "All fields are required" });
// 	}

// 	try {
// 		const hashedPassword = await bcrypt.hash(password, 10);

// 		await pool.query(
// 			"INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
// 			[username, email, hashedPassword]
// 		);

// 		res.status(201).json({ message: "User created successfully" });
// 	} catch (err) {
// 		console.error("Signup error:", err);
// 		if (err.code === "23505") {
// 			// Unique constraint violation
// 			res.status(409).json({ message: "Username or email already exists" });
// 		} else {
// 			res.status(500).json({ message: "Server error" });
// 		}
// 	}
// });


// Weather route
app.get("/location-data", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    const {
      location: { name: cityName },
      current: {
        temp_c: temp,
        condition: { text: weatherDesc },
      },
    } = await (
      await fetch(
<<<<<<< HEAD
        `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${lat},${lon}`
=======
        `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHERAPI_API_KEY}&q=${lat},${lon}`
>>>>>>> af240e49a0addae79c45d25cda9f08689cb68ac5
      )
    ).json();

    res.status(200).json({ cityName, temp, weatherDesc });
  } catch (error) {
    console.error("Error fetching location data", error);
    res.status(500).json({ message: "Error fetching location data", error });
  }
});

// Fallback: Serve frontend
app.use((req, res, next) => {
  if (
    req.method === "GET" &&
    !req.path.startsWith("/api") &&
    !req.path.startsWith("/location-data") &&
    !req.path.includes(".")
  ) {
    console.log("FALLBACK HIT:", req.path);
    res.sendFile(indexPath);
  } else {
    next();
  }
});




app.listen(process.env.PORT, () => {
  console.log(`The Prime Cut is listening on http://localhost:${process.env.PORT}`);
});
