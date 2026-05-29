import express from 'express';
import db from '../db.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: 'Missing credentials' });

  try {
    const [rows] = await db.query(
      'SELECT id, username FROM Users WHERE username = ? AND password = ?',
      [username, password]
    );

    if (rows.length === 0)
      return res.status(401).json({ error: 'Invalid credentials' });

    req.session.user = rows[0];
    res.json({ user: rows[0] });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

router.get('/me', (req, res) => {
  if (req.session.user) return res.json({ user: req.session.user });
  res.status(401).json({ user: null });
});

export default router;