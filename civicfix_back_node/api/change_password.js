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
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Both current and new password are required" });
    }
    try {
        // Get user
        const [rows] = await req.mysqlPool.query(
            "SELECT * FROM users WHERE id = ?",
            [req.session.userId]
        );
        if (!rows.length) {
            return res.status(404).json({ message: "User not found" });
        }
        const user = rows[0];
        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await req.mysqlPool.query(
            "UPDATE users SET password = ? WHERE id = ?",
            [hashedPassword, req.session.userId]
        );
        res.json({ message: "Password changed successfully" });
    } catch (err) {
        console.error("Error in /api/change-password:", err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
