import express from 'express';
import db from '../db.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

// DAILY REPORT
router.get('/daily', async (req, res) => {
  const date = req.query.date || new Date().toISOString().slice(0, 10);

  const [rows] = await db.query(`
    SELECT sp.PlateNumber, p.PackageName, p.PackageDescription,
           pay.AmountPaid, pay.PaymentDate
    FROM Payment pay
    JOIN ServicePackage sp ON sp.RecordNumber = pay.RecordNumber
    JOIN Package p         ON p.PackageNumber = sp.PackageNumber
    WHERE pay.PaymentDate = ?
    ORDER BY pay.PaymentNumber DESC
  `, [date]);

  res.json({ date, rows });
});

export default router;