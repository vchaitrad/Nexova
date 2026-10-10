const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

  const { name, email, password, role, company, phone, location, notifyVia } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered.' });

    const user = await User.create({
      name, email, password, role, company,
      phone: phone || '',
      location: location || '',
      notifyVia: notifyVia || 'email',
    });

    try {
      if ((notifyVia === 'whatsapp' || notifyVia === 'both') && phone) {
        const wa = require('../services/whatsappService');
        await wa.notifyWelcome(phone, name);
      }
      if (notifyVia === 'email' || notifyVia === 'both') {
        const emailService = require('../services/emailService');
        if (emailService.sendEmail) {
          await emailService.sendEmail(email, '👋 Welcome to Nexova!',
            `Hi ${name}! Your account has been created. Start finding jobs on Nexova!`,
            `<h2>Welcome to Nexova, ${name}! 🎉</h2><p>Your account is ready. Start browsing jobs!</p>`
          );
        }
      }
    } catch (notifErr) {
      console.log('[Signup] Notification failed (non-critical):', notifErr.message);
    }

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, company: user.company, phone: user.phone, location: user.location, notifyVia: user.notifyVia },
    });
  } catch (err) {
    console.error('[Signup]', err.message);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ error: 'Invalid email or password.' });

    // ✅ WhatsApp login notification
    try {
      if ((user.notifyVia === 'whatsapp' || user.notifyVia === 'both') && user.phone) {
        const wa = require('../services/whatsappService');
        await wa.sendWhatsApp(
          user.phone,
          `✅ *Nexova Login Alert*\n\nHi *${user.name}*! 👋\n\nYou have successfully logged in to Nexova Job Portal.\n\nIf this was not you, please contact us immediately! 🔐`
        );
      }
    } catch (notifErr) {
      console.log('[Login] WhatsApp failed (non-critical):', notifErr.message);
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, company: user.company, phone: user.phone, location: user.location, notifyVia: user.notifyVia },
    });
  } catch {
    res.status(500).json({ error: 'Server error.' });
  }
};

exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};