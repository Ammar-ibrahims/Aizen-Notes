const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/', async (req, res) => {
  const { customer_name, customer_email, items } = req.body;
  if (!customer_name || !customer_email || !items || items.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderResult = await client.query(
      'INSERT INTO orders (customer_name, customer_email, total_amount) VALUES ($1, $2, $3) RETURNING *',
      [customer_name, customer_email, totalAmount]
    );
    const order = orderResult.rows[0];

    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order.id, item.product_id, item.quantity, item.price]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Failed to place order' });
  } finally {
    client.release();
  }
});

router.get('/:email', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, json_agg(json_build_object('product_id', oi.product_id, 'quantity', oi.quantity, 'price', oi.price, 'name', p.name)) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE o.customer_email = $1
       GROUP BY o.id ORDER BY o.created_at DESC`,
      [req.params.email]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
