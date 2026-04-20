const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM products WHERE is_deleted = false ORDER BY created_at DESC';
    let params = [];
    if (category) {
      query = 'SELECT * FROM products WHERE category = $1 AND is_deleted = false ORDER BY created_at DESC';
      params = [category];
    }
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

const authMiddleware = require('../middleware/authMiddleware');

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1 AND is_deleted = false', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin ONLY routes below

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, price, category, image_url, stock, images, variants } = req.body;
    const result = await pool.query(
      'INSERT INTO products (name, description, price, category, image_url, images, stock, variants) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [name, description, price, category, image_url, images || [], stock, JSON.stringify(variants || [])]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, description, price, category, image_url, stock, images, variants } = req.body;
    const result = await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3, category = $4, image_url = $5, images = $6, stock = $7, variants = $8 WHERE id = $9 RETURNING *',
      [name, description, price, category, image_url, images || [], stock, JSON.stringify(variants || []), req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Soft delete: mark product as deleted rather than removing from DB
    // This preserves referential integrity with historical orders
    const result = await pool.query(
      'UPDATE products SET is_deleted = true WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
