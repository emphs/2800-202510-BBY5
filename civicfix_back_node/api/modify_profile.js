import express from "express";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/", async (req, res) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Not logged in" });
    }
    if (!req.mysqlPool) {
        return res.status(500).json({ message: "Server misconfiguration: mysqlPool missing" });
    }
    const { username } = req.body;
    if (!username || typeof username !== "string" || username.trim() === "") {
        return res.status(400).json({ message: "Username is required" });
    }
    try {
        // Check if username is already taken by another user
        const [check] = await req.mysqlPool.query(
            "SELECT id FROM users WHERE username = ? AND id <> ?",
            [username, req.session.userId]
        );
        if (check.length > 0) {
            return res.status(409).json({ message: "Username already taken" });
        }
        // Update username
        const [result] = await req.mysqlPool.query(
            "UPDATE users SET username = ? WHERE id = ?",
            [username, req.session.userId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        // Update session
        req.session.username = username;
        res.json({ message: "Profile updated", username });
    } catch (err) {
        console.error("Error in /api/modify-profile:", err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
