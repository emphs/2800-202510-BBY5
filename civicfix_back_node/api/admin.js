import express from "express";

const router = express.Router();

// Middleware to require admin user
function requireAdmin(req, res, next) {
    if (!req.session || req.session.userType !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    next();
}

// Get all users (alphabetical by email)
router.get("/users", requireAdmin, async (req, res) => {
    try {
        const result = await req.pgPool.query(
            "SELECT id, email, user_type FROM users ORDER BY email ASC"
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Admin get users error:", err);
        res.status(500).json({ message: "Failed to fetch users" });
    }
});

// Get all reports (issues) from MySQL, ordered by title
router.get("/reports", requireAdmin, async (req, res) => {
    try {
        const [rows] = await req.mysqlPool.query(
            "SELECT id, title, type, status, creator_id FROM issues ORDER BY title ASC"
        );
        res.json(rows);
    } catch (err) {
        console.error("Admin get reports error:", err);
        res.status(500).json({ message: "Failed to fetch reports" });
    }
});

export default router;
