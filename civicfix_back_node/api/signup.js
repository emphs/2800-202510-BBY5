import express from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

const router = express.Router();

dotenv.config();

router.post("/", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Use the shared pool from req.pgPool
        await req.pgPool.query(
            "INSERT INTO users (username, email, password, user_type) VALUES ($1, $2, $3, $4)",
            [username, email, hashedPassword, 'user']
        );

        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error("Signup error:", err);
        if (err.code === "23505") {
            res.status(409).json({ message: "Username or email already exists" });
        } else {
            res.status(500).json({ message: "Server error" });
        }
    }
});

export default router;
