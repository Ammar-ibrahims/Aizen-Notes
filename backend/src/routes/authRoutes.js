const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// @route   POST /api/auth/login
// @desc    Authenticate admin & get token
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Please submit both a username and password.' });
    }

    // Check if admin exists
    const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    const admin = result.rows[0];

    // Validate password
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    // Return jsonwebtoken
    const payload = {
      admin: {
        id: admin.id,
        username: admin.username
      }
    };

    const secret = process.env.JWT_SECRET || 'fallback_secret_key_for_dev_only';

    jwt.sign(
      payload,
      secret,
      { expiresIn: '12h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: payload.admin });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
