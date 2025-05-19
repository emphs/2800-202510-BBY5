import express from "express";
import bcrypt from "bcrypt";
import session from "express-session";

console.log("login.js loaded");

const router = express.Router();

router.post("/", async (req, res) => {
    const { email, password } = req.body;

    if (!req.pgPool) {
        console.error("req.pgPool is undefined in login route!");
        return res.status(500).json({ message: "Server misconfiguration: pgPool missing" });
    }

    try {
        // Use the shared pool from req.pgPool
        const result = await req.pgPool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (result.rows.length === 0) {
            console.log(`Failed login: email not found (${email})`);
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            console.log(`Failed login: incorrect password for email (${email})`);
            return res.status(401).json({ message: "Invalid email or password" });
        }

        req.session.userId = user.id;
        req.session.userType = user.user_type;
        req.session.email = user.email;
        res.json({ message: "Login successful" });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

export default router;
