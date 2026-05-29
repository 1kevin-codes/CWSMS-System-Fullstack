import express from 'express';
import db from '../db.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

// GET all cars
router.get('/', async (_req, res) => {
  const [rows] = await db.query('SELECT * FROM Car ORDER BY PlateNumber');
  res.json(rows);
});

// INSERT car
router.post('/', async (req, res) => {
  const { PlateNumber, CarType, CarSize, DriverName, PhoneNumber } = req.body;

  try {
    await db.query(
      'INSERT INTO Car (PlateNumber, CarType, CarSize, DriverName, PhoneNumber) VALUES (?,?,?,?,?)',
      [PlateNumber, CarType, CarSize, DriverName, PhoneNumber]
    );

    res.status(201).json({ ok: true });

  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;