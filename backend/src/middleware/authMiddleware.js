const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const defaultSecret = process.env.JWT_SECRET || 'fallback_secret_key_for_dev_only';
    const decoded = jwt.verify(token, defaultSecret);
    req.admin = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
