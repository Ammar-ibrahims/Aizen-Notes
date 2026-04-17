const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Cart is managed client-side via localStorage' });
});

module.exports = router;
