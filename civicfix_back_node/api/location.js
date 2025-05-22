// location.js - Express router for location-related endpoints (ES module)
import express from 'express';

const router = express.Router();

// POST /api/location/location - receive and process/store user location
router.post('/', (req, res) => {
  const { lat, lng } = req.body;
  // TODO: Store or process location as needed (e.g., save to DB)
  res.status(200).json({ message: 'Location received', lat, lng });
});

// (Optional) GET /api/location/location - for future expansion
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Location API is working' });
});

export default router;
