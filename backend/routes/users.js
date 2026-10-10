const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');
const User = require('../models/User');

router.get('/profile', protect, async (req, res) => {
  try {
    res.json({ user: req.user });

  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile.' });
  }
});

router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, location } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, location },
      { new: true }
    );

    res.json({
      message: 'Profile updated.',
      user
    });

  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

module.exports = router;