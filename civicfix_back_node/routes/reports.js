import { Router } from 'express';

const router = Router();

// Mock data (replace with real DB logic later)
const mockReports = [
  {
    id: '1',
    userId: 'abc123',
    title: 'Heavy traffic on Main St',
    description: 'Construction delays',
    status: 'Submitted',
    timestamp: '2025-05-09T15:24:00Z',
  },
  {
    id: '2',
    userId: 'abc123',
    title: 'Pothole on 5th Ave',
    description: 'Very deep pothole',
    status: 'Resolved',
    timestamp: '2025-05-05T10:12:00Z',
  },
];

router.get('/', (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  const reports = mockReports.filter((r) => r.userId === userId);
  res.json(reports);
});

export default router;
