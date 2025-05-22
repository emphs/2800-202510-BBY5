import express from "express";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/", async (req, res) => {
    const { email, password, username } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    if (!req.mysqlPool) {
        return res.status(500).json({ message: "Server misconfiguration: mysqlPool missing" });
    }
    try {
        const [rows] = await req.mysqlPool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );
        if (!rows.length) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        req.session.userId = user.id;
        req.session.userType = user.userType;
        req.session.email = user.email;
        req.session.username = user.username;
        res.json({ message: "Login successful" });
    } catch (err) {
        console.error("Error in /api/login:", err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
