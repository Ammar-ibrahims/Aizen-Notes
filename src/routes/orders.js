const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const { sendOrderEmail } = require('../services/emailService');
const { sendAdminWhatsAppAlert } = require('../services/whatsappService');

router.post('/', async (req, res) => {
  const { customer_name, customer_email, city, state, address, phone_number, items } = req.body;
  if (!customer_name || !customer_email || !city || !state || !address || !phone_number || !items || items.length === 0) {
    return res.status(400).json({ error: 'Missing required shipping fields' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderResult = await client.query(
      'INSERT INTO orders (customer_name, customer_email, city, state, address, phone_number, total_amount) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [customer_name, customer_email, city, state, address, phone_number, totalAmount]
    );
    const order = orderResult.rows[0];

    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order.id, item.product_id, item.quantity, item.price]
      );
    }

    await client.query('COMMIT');

    // Fetch item names for the email (since the order items table only has IDs)
    const itemsWithNamesResult = await pool.query(
      `SELECT oi.*, p.name 
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [order.id]
    );
    
    // Send background notifications (don't block the response)
    sendOrderEmail(order, itemsWithNamesResult.rows).catch(err => {
      console.error('Background Email Error:', err);
    });

    sendAdminWhatsAppAlert(order, itemsWithNamesResult.rows).catch(err => {
      console.error('Background WhatsApp Error:', err);
    });

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

// Admin only: Get all global orders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, 
        COALESCE(
          json_agg(
            json_build_object('product_id', oi.product_id, 'quantity', oi.quantity, 'price', oi.price, 'name', p.name)
          ) FILTER (WHERE oi.id IS NOT NULL), '[]'
        ) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       GROUP BY o.id ORDER BY o.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching orders' });
  }
});

// Admin only: Get highly descriptive single order detail
router.get('/detail/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, 
        COALESCE(
          json_agg(
            json_build_object('product_id', oi.product_id, 'quantity', oi.quantity, 'price', oi.price, 'name', p.name)
          ) FILTER (WHERE oi.id IS NOT NULL), '[]'
        ) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE o.id = $1
       GROUP BY o.id`,
       [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching order details' });
  }
});

// Admin only: Update order status
router.put('/:id/status', authMiddleware, async (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Status is required' });
  
  try {
    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});
