import express from 'express';
import db from '../db.js';

const router = express.Router();

//
// GET ALL PACKAGES
//
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM Package ORDER BY PackageNumber DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//
// CREATE PACKAGE (THIS FIXES YOUR FORM SUBMIT ERROR)
//
router.post('/', async (req, res) => {
  const { PackageName, PackageDescription, PackagePrice } = req.body;

  if (!PackageName || !PackageDescription || !PackagePrice) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO Package (PackageName, PackageDescription, PackagePrice)
       VALUES (?, ?, ?)`,
      [PackageName, PackageDescription, PackagePrice]
    );

    res.status(201).json({
      PackageNumber: result.insertId,
      PackageName,
      PackageDescription,
      PackagePrice
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;