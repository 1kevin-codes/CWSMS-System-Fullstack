import express from 'express';
import db from '../db.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

// GET payments
router.get('/', async (_req, res) => {
  const [rows] = await db.query(`
    SELECT pay.PaymentNumber, pay.AmountPaid, pay.PaymentDate, pay.RecordNumber,
           sp.PlateNumber, p.PackageName, p.PackageDescription, p.PackagePrice
    FROM Payment pay
    JOIN ServicePackage sp ON sp.RecordNumber = pay.RecordNumber
    JOIN Package p         ON p.PackageNumber = sp.PackageNumber
    ORDER BY pay.PaymentNumber DESC
  `);

  res.json(rows);
});

// INSERT payment + bill
router.post('/', async (req, res) => {
  const { RecordNumber, AmountPaid, PaymentDate } = req.body;

  try {
    const [r] = await db.query(
      'INSERT INTO Payment (RecordNumber, AmountPaid, PaymentDate) VALUES (?,?,?)',
      [RecordNumber, AmountPaid, PaymentDate]
    );

    const [bill] = await db.query(`
      SELECT pay.PaymentNumber, pay.AmountPaid, pay.PaymentDate,
             sp.RecordNumber, sp.ServiceDate, sp.PlateNumber,
             c.DriverName, c.PhoneNumber, c.CarType, c.CarSize,
             p.PackageName, p.PackageDescription, p.PackagePrice
      FROM Payment pay
      JOIN ServicePackage sp ON sp.RecordNumber = pay.RecordNumber
      JOIN Car c             ON c.PlateNumber   = sp.PlateNumber
      JOIN Package p         ON p.PackageNumber = sp.PackageNumber
      WHERE pay.PaymentNumber = ?
    `, [r.insertId]);

    res.status(201).json({
      PaymentNumber: r.insertId,
      bill: bill[0]
    });

  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;