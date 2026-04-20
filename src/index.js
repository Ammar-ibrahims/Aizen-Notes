const express = require('express');
const cors = require('cors');
const compression = require('compression');
require('dotenv').config();
const pool = require('./db');

// Global Error Catchers to prevent silent 503 crashes
process.on('unhandledRejection', (reason, promise) => {
  console.error('CRITICAL: Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('CRITICAL: Uncaught Exception thrown:', err);
});

const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');
const authRouter = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: [
    'http://localhost:5000',
    'http://localhost:5001',
    'https://www.aizennotes.com',
    'https://aizennotes.com',
    'http://www.aizennotes.com',
    'http://aizennotes.com',
    /\.vercel\.app$/ 
  ],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(compression());

// Cache middleware for static-like API responses (Products & Health)
app.use((req, res, next) => {
  if (req.method === 'GET' && (req.url === '/api/products' || req.url === '/api/health')) {
    // Disable all browser and proxy caching for these dynamic endpoints
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  }
  next();
});

app.get('/api/health', async (req, res) => {
  try {
    const dbCheck = await pool.query('SELECT 1');
    res.json({ 
      status: 'ok', 
      database: 'connected', 
      message: 'Aizen Notes API is perfectly healthy' 
    });
  } catch (err) {
    console.error('HEALTH CHECK FAILED:', err.message);
    res.status(500).json({ 
      status: 'error', 
      database: 'disconnected', 
      error: err.message 
    });
  }
});

app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/auth', authRouter);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

module.exports = app;
