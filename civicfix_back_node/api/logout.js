import express from "express";
const router = express.Router();

router.post("/logout", (req, res) => {
	if (req.session) {
		req.session.destroy((err) => {
			if (err) {
				console.error("Logout error:", err);
				return res.status(500).json({ message: "Failed to logout" });
			}
			res.clearCookie("civicfix.sid"); // optional: clear session cookie
			res.json({ message: "Logout successful" });
		});
	} else {
		res.status(200).json({ message: "No active session" });
	}
});

export default router;
