import express from "express";
import mysqlPool from "../db.js";

const router = express.Router();


router.get('/', async (req, res) => {
  if (
    !req.session ||
    !req.session.userId ||
    !req.session.username ||
    !req.session.email ||
    !req.session.userType
  ) {
    return res.status(401).json({ message: 'Not logged in or session incomplete' });
  }
  // Fetch latest user info from MySQL
  try {
    const [rows] = await mysqlPool.query(
      'SELECT id, username, email, user_type FROM users WHERE id = ?',
      [req.session.userId]
    );
    if (!rows.length) return res.status(404).json({ message: 'User not found' });
    const user = rows[0];
    res.json({
      userId: user.id,
      userType: user.user_type,
      email: user.email,
      username: user.username
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user info' });
  }
});

export default router;
