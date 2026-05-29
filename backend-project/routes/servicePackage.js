import express from 'express';
import db from '../db.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

// GET all
router.get('/', async (_req, res) => {
  const [rows] = await db.query(`
    SELECT sp.RecordNumber, sp.ServiceDate, sp.PlateNumber, sp.PackageNumber,
           c.DriverName, p.PackageName, p.PackagePrice
    FROM ServicePackage sp
    JOIN Car c     ON c.PlateNumber   = sp.PlateNumber
    JOIN Package p ON p.PackageNumber = sp.PackageNumber
    ORDER BY sp.RecordNumber DESC
  `);

  res.json(rows);
});

// GET one
router.get('/:id', async (req, res) => {
  const [rows] = await db.query(
    'SELECT * FROM ServicePackage WHERE RecordNumber = ?',
    [req.params.id]
  );

  if (!rows.length)
    return res.status(404).json({ error: 'Not found' });

  res.json(rows[0]);
});

// CREATE
router.post('/', async (req, res) => {
  const { ServiceDate, PlateNumber, PackageNumber } = req.body;

  try {
    const [r] = await db.query(
      'INSERT INTO ServicePackage (ServiceDate, PlateNumber, PackageNumber) VALUES (?,?,?)',
      [ServiceDate, PlateNumber, PackageNumber]
    );

    res.status(201).json({ RecordNumber: r.insertId });

  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  const { ServiceDate, PlateNumber, PackageNumber } = req.body;

  try {
    await db.query(
      'UPDATE ServicePackage SET ServiceDate=?, PlateNumber=?, PackageNumber=? WHERE RecordNumber=?',
      [ServiceDate, PlateNumber, PackageNumber, req.params.id]
    );

    res.json({ ok: true });

  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await db.query(
      'DELETE FROM ServicePackage WHERE RecordNumber=?',
      [req.params.id]
    );

    res.json({ ok: true });

  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;