import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import session from 'express-session';

// Routes (IMPORTANT: add .js extension in ESM)
import authRoutes from './routes/auth.js';
import carRoutes from './routes/car.js';
import servicePackageRoutes from './routes/servicePackage.js';
import paymentRoutes from './routes/payment.js';
import reportRoutes from './routes/report.js';
import packageRoutes from './routes/package.js';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'cwsms_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 8, // 8 hours
  },
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/servicepackages', servicePackageRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/packages', packageRoutes);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`CWSMS backend on http://localhost:${PORT}`);
});