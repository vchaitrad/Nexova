const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ error: 'Not authorized. No token.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ error: 'User not found.' });
    next();
  } catch {
    return res.status(401).json({ error: 'Not authorized. Invalid token.' });
  }
};

const recruiterOnly = (req, res, next) => {
  if (req.user?.role === 'recruiter') return next();
  return res.status(403).json({ error: 'Access denied. Recruiters only.' });
};

module.exports = { protect, recruiterOnly };