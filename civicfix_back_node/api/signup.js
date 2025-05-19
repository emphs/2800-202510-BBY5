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

        const result = await req.pgPool.query(
            "INSERT INTO users (username, email, password, user_type) VALUES ($1, $2, $3, $4) RETURNING id, username, email, user_type",
            [username, email, hashedPassword, 'user']
        );
        const user = result.rows[0];

        req.session.userId = user.id;
        req.session.userType = user.user_type;
        req.session.email = user.email;
        req.session.username = user.username;

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
