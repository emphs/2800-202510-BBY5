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

    if (!req.mysqlPool) {
        return res.status(500).json({ message: "Server misconfiguration: mysqlPool missing" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await req.mysqlPool.query(
            "INSERT INTO users (username, email, password, userType) VALUES (?, ?, ?, ?)",
            [username, email, hashedPassword, 'user']
        );
        const userId = result.insertId;

        req.session.userId = userId;
        req.session.userType = 'user';
        req.session.email = email;
        req.session.username = username;

        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error("Error in /api/signup:", err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
