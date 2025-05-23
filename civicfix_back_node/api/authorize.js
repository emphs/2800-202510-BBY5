import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  if (!req.session || !req.session.userId) {
    return;
  }
  res.json({ authorized: req.session.userType === 'admin', userType: req.session.userType });
});

export default router;