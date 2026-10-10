const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Helper to format user response consistently
const formatUser = (u) => ({
  _id: u._id, id: u._id, name: u.name, email: u.email, role: u.role,
  phone: u.phone || '', location: u.location || '',
  emailVerified: !!u.emailVerified,
  phoneVerified: !!u.phoneVerified,
  selfie: u.selfie || '',
  selfieVerified: !!u.selfieVerified,
  verificationStatus: u.verificationStatus || 'none',
  idProof: u.idProof || '',
  savedJobs: u.savedJobs || [],
});

// In-memory OTP store
const otpStore = new Map();

// Multer config for ID uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fs = require('fs');
    const dir = path.join(__dirname, '..', 'uploads', 'ids');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `user_${req.user?.id || Date.now()}_${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.pdf'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only JPG, PNG, and PDF files are allowed.'));
  },
});

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    // Honeypot bot check
    if (req.body.website) {
      return res.status(400).json({ error: 'Invalid request.' });
    }
    const { name, email, role, phone, location } = req.body;
    if (!name || !email)
      return res.status(400).json({ error: 'Name and email are required.' });

    const emailClean = email.toLowerCase().trim();
    const existing = await User.findOne({ email: emailClean });
    if (existing)
      return res.status(400).json({ error: 'This email is already registered. Please login instead.' });

    const user = await User.create({
      name: name.trim(), email: emailClean,
      role: role || 'jobseeker', phone: phone || '', location: location || '',
    });

    try {
      const { sendEmail } = require('../services/emailService');
      await sendEmail(
        user.email,
        '👋 Welcome to Nexova!',
        `Hi ${user.name}! Your account has been created. Start finding jobs on Nexova!`,
        `<h2>Welcome to Nexova, ${user.name}! 🎉</h2><p>Your account is ready. Start browsing jobs!</p>`
      );
    } catch (notifErr) {
      console.log('[Signup] Notification failed (non-critical):', notifErr.message);
    }

    // Send verification OTP
    try {
      const { sendEmail } = require('../services/emailService');
      const verifyOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const verifyExpires = Date.now() + 10 * 60 * 1000;
      otpStore.set(`verify:${emailClean}`, { otp: verifyOtp, expiresAt: verifyExpires, userId: user._id });

      await sendEmail(
        user.email,
        `🔐 Verify your Nexova account`,
        `Hi ${user.name},\n\nYour verification code is: ${verifyOtp}\n\nThis code expires in 10 minutes.\n\n-- Nexova Team`,
        `<!DOCTYPE html><html><head><meta charset="utf-8"/></head>
<body style="font-family:Arial,sans-serif;background:#f9fafb;margin:0;padding:20px;">
  <div style="max-width:480px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
    <div style="background:#1B2A4A;padding:28px 32px;text-align:center;">
      <span style="font-size:22px;font-weight:900;color:#C4A882;">Nexova</span>
      <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;font-size:14px;">Email Verification</p>
    </div>
    <div style="padding:32px;">
      <p style="font-size:18px;color:#1e293b;font-weight:600;margin:0 0 8px;">Hi ${user.name} 👋</p>
      <p style="font-size:15px;color:#475569;line-height:1.6;margin:0 0 24px;">Verify your email to start applying for jobs:</p>
      <div style="background:#FAF8F6;border:2px solid #C4A882;border-radius:14px;padding:24px;text-align:center;margin-bottom:24px;">
        <p style="margin:0 0 8px;font-size:13px;color:#1B2A4A;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Verification Code</p>
        <p style="margin:0;font-size:42px;font-weight:900;letter-spacing:10px;color:#1B2A4A;">${verifyOtp}</p>
        <p style="margin:10px 0 0;font-size:13px;color:#64748b;">⏰ Expires in <strong>10 minutes</strong></p>
      </div>
    </div>
    <div style="background:#f1f5f9;padding:16px 32px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#94a3b8;">Nexova Job Portal • Connect Talent with Opportunity</p>
    </div>
  </div>
</body></html>`
      );
      console.log(`[Verify] OTP sent to ${emailClean}`);
    } catch (notifErr) {
      console.log('[Verify] Email failed (non-critical):', notifErr.message);
    }

    const token = generateToken(user._id);
    res.status(201).json({
      message: 'Account created! Verify your email.', token,
      user: formatUser(user),
    });
  } catch (err) {
    console.error('[Signup]', err.message);
    res.status(500).json({ error: 'Could not create account.' });
  }
});

// POST /api/auth/verify-email — verify email with OTP
router.post('/verify-email', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and code are required.' });

    const emailClean = email.toLowerCase().trim();
    const record = otpStore.get(`verify:${emailClean}`);

    if (!record) return res.status(400).json({ error: 'No verification code found. Request a new one.' });
    if (Date.now() > record.expiresAt) {
      otpStore.delete(`verify:${emailClean}`);
      return res.status(400).json({ error: 'Code expired. Request a new one.' });
    }
    if (record.otp !== otp.trim()) return res.status(400).json({ error: 'Wrong code. Try again.' });

    await User.findByIdAndUpdate(record.userId, { emailVerified: true });
    otpStore.delete(`verify:${emailClean}`);

    const user = await User.findById(record.userId);
    const token = generateToken(user._id);
    res.json({ message: 'Email verified! Start applying.', token, user: formatUser(user) });
  } catch (err) {
    console.error('[VerifyEmail]', err.message);
    res.status(500).json({ error: 'Verification failed.' });
  }
});

// POST /api/auth/resend-verify — resend verification OTP
router.post('/resend-verify', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required.' });

    const emailClean = email.toLowerCase().trim();
    const user = await User.findOne({ email: emailClean });
    if (!user) return res.status(404).json({ error: 'Account not found.' });
    if (user.emailVerified) return res.json({ message: 'Email already verified.' });

    const verifyOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyExpires = Date.now() + 10 * 60 * 1000;
    otpStore.set(`verify:${emailClean}`, { otp: verifyOtp, expiresAt: verifyExpires, userId: user._id });

    try {
      const { sendEmail } = require('../services/emailService');
      await sendEmail(user.email, 'Your Nexova verification code', `Code: ${verifyOtp}`);
    } catch (e) { console.log('[ResendVerify] Email failed:', e.message); }

    res.json({ message: 'Verification code resent to your email.' });
  } catch (err) {
    res.status(500).json({ error: 'Could not resend code.' });
  }
});

// POST /api/auth/send-otp — send 6-digit OTP to email
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required.' });

    const emailClean = email.toLowerCase().trim();
    const user = await User.findOne({ email: emailClean });
    if (!user)
      return res.status(401).json({ error: 'No account found with this email.' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;
    otpStore.set(emailClean, { otp, expiresAt, userId: user._id });

    try {
      const { sendEmail } = require('../services/emailService');
      await sendEmail(
        user.email,
        `🔐 Your Nexova Login OTP: ${otp}`,
        `Hi ${user.name},\n\nYour login OTP is: ${otp}\n\nThis code expires in 10 minutes.\n\nIf you did not request this, ignore this email.\n\n-- Nexova Team`,
        `<!DOCTYPE html><html><head><meta charset="utf-8"/></head>
<body style="font-family:Arial,sans-serif;background:#f9fafb;margin:0;padding:20px;">
  <div style="max-width:480px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
    <div style="background:#1B2A4A;padding:28px 32px;text-align:center;">
      <span style="font-size:22px;font-weight:900;color:#C4A882;">Nexova</span>
      <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;font-size:14px;">Login Verification</p>
    </div>
    <div style="padding:32px;">
      <p style="font-size:18px;color:#1e293b;font-weight:600;margin:0 0 8px;">Hi ${user.name} 👋</p>
      <p style="font-size:15px;color:#475569;line-height:1.6;margin:0 0 24px;">Use the code below to log in to your Nexova account:</p>
      <div style="background:#FAF8F6;border:2px solid #C4A882;border-radius:14px;padding:24px;text-align:center;margin-bottom:24px;">
        <p style="margin:0 0 8px;font-size:13px;color:#1B2A4A;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Your Login Code</p>
        <p style="margin:0;font-size:42px;font-weight:900;letter-spacing:10px;color:#1B2A4A;">${otp}</p>
        <p style="margin:10px 0 0;font-size:13px;color:#64748b;">⏰ Expires in <strong>10 minutes</strong></p>
      </div>
    </div>
    <div style="background:#f1f5f9;padding:16px 32px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#94a3b8;">Nexova Job Portal • Connect Talent with Opportunity</p>
    </div>
  </div>
</body></html>`
      );
      console.log(`[LoginOTP] Sent to ${emailClean}`);
    } catch (emailErr) {
      console.log(`[LoginOTP] Email failed for ${emailClean}:`, emailErr.message);
    }

    res.json({ message: 'OTP sent to your email. Please check your inbox.' });
  } catch (err) {
    console.error('[SendOTP]', err.message);
    res.status(500).json({ error: 'Could not send OTP. Try again.' });
  }
});

// POST /api/auth/verify-otp-login — verify OTP and log in
router.post('/verify-otp-login', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ error: 'Email and OTP are required.' });

    const emailClean = email.toLowerCase().trim();
    const record = otpStore.get(emailClean);

    if (!record)
      return res.status(400).json({ error: 'No OTP found. Please request a new one.' });
    if (Date.now() > record.expiresAt) {
      otpStore.delete(emailClean);
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }
    if (record.otp !== otp.trim())
      return res.status(400).json({ error: 'Wrong OTP. Please check your email and try again.' });

    const user = await User.findById(record.userId);
    if (!user) return res.status(404).json({ error: 'Account not found.' });

    otpStore.delete(emailClean);

    const token = generateToken(user._id);
    res.json({ message: 'Welcome back!', token, user: formatUser(user) });
  } catch (err) {
    console.error('[VerifyOTPLogin]', err.message);
    res.status(500).json({ error: 'Could not verify OTP. Try again.' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Please provide your email address.' });

    const emailClean = email.toLowerCase().trim();
    const user = await User.findOne({ email: emailClean });

    if (!user) {
      return res.json({ message: 'If this email is registered, you will receive a reset code shortly.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000;
    otpStore.set(emailClean, { otp, expiresAt });

    try {
      const emailService = require('../services/emailService');
      await emailService.sendPasswordResetOtp(user.email, user.name, otp);
      console.log(`[ForgotPassword] OTP email sent to ${emailClean}`);
    } catch (emailErr) {
      console.log(`[ForgotPassword] Email failed. OTP for ${emailClean}: ${otp}`);
    }

    try {
      if (user.phone) {
        const { notifyOTP } = require('../services/smsService');
        await notifyOTP(user.phone, user.name, otp);
      }
    } catch (smsErr) {
      console.log('[ForgotPassword] SMS OTP failed (non-critical):', smsErr.message);
    }

    res.json({ message: 'Reset code sent to your email and phone. Please check!' });
  } catch (err) {
    console.error('[ForgotPassword]', err.message);
    res.status(500).json({ error: 'Could not send reset code. Please try again.' });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and code are required.' });

    const emailClean = email.toLowerCase().trim();
    const record = otpStore.get(emailClean);

    if (!record)
      return res.status(400).json({ error: 'No reset code found. Please request a new code.' });
    if (Date.now() > record.expiresAt) {
      otpStore.delete(emailClean);
      return res.status(400).json({ error: 'This code has expired. Please request a new reset code.' });
    }
    if (record.otp !== otp.trim())
      return res.status(400).json({ error: 'Wrong code. Please check your email and try again.' });

    otpStore.set(emailClean, { ...record, verified: true });
    res.json({ message: 'Code verified! You can now set a new password.' });
  } catch (err) {
    console.error('[VerifyOTP]', err.message);
    res.status(500).json({ error: 'Could not verify code. Please try again.' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res.status(400).json({ error: 'Email, code, and new password are required.' });
    if (newPassword.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });

    const emailClean = email.toLowerCase().trim();
    const record = otpStore.get(emailClean);

    if (!record || !record.verified)
      return res.status(400).json({ error: 'Please complete the verification step first.' });
    if (Date.now() > record.expiresAt) {
      otpStore.delete(emailClean);
      return res.status(400).json({ error: 'Session expired. Please start the forgot password process again.' });
    }
    if (record.otp !== otp.trim())
      return res.status(400).json({ error: 'Invalid code. Please try again.' });

    const user = await User.findOne({ email: emailClean });
    if (!user) return res.status(404).json({ error: 'Account not found.' });

    otpStore.delete(emailClean);
    res.json({ message: 'Verified successfully! You can now sign in.' });
  } catch (err) {
    console.error('[ResetPassword]', err.message);
    res.status(500).json({ error: 'Could not reset password. Please try again.' });
  }
});

// GET /api/auth/profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Authentication required.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ success: true, user });
  } catch {
    res.status(401).json({ error: 'Invalid token.' });
  }
});

// POST /api/auth/send-phone-otp — send OTP to phone
router.post('/send-phone-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone number is required.' });

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Authentication required.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;
    otpStore.set(`phone:${phone}`, { otp, expiresAt, userId: user._id });

    let smsSent = false;
    try {
      const { sendSMS } = require('../services/smsService');
      const result = await sendSMS(phone, `Your Nexova phone verification code is: ${otp}. Expires in 10 minutes.`);
      smsSent = result.success;
      if (!result.success) console.log('[PhoneOTP] SMS failed:', result.reason);
    } catch (e) { console.log('[PhoneOTP] SMS error:', e.message); }

    if (smsSent) {
      res.json({ message: 'OTP sent to your phone.' });
    } else {
      res.json({
        message: 'Could not send SMS. Use this code to verify.',
        fallbackOtp: otp,
      });
    }
  } catch (err) {
    console.error('[SendPhoneOTP]', err.message);
    res.status(500).json({ error: 'Could not send OTP.' });
  }
});

// POST /api/auth/verify-phone — verify phone OTP
router.post('/verify-phone', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ error: 'Phone and OTP are required.' });

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Authentication required.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const record = otpStore.get(`phone:${phone}`);
    if (!record) return res.status(400).json({ error: 'No OTP found. Request a new one.' });
    if (Date.now() > record.expiresAt) {
      otpStore.delete(`phone:${phone}`);
      return res.status(400).json({ error: 'OTP expired. Request a new one.' });
    }
    if (record.otp !== otp.trim()) return res.status(400).json({ error: 'Wrong OTP.' });

    const user = await User.findByIdAndUpdate(decoded.id, { phoneVerified: true, phone }, { new: true });
    otpStore.delete(`phone:${phone}`);

    const newToken = generateToken(user._id);
    res.json({ message: 'Phone verified!', token: newToken, user: formatUser(user) });
  } catch (err) {
    console.error('[VerifyPhone]', err.message);
    res.status(500).json({ error: 'Verification failed.' });
  }
});

// Multer config for selfies
const selfieStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fs = require('fs');
    const dir = path.join(__dirname, '..', 'uploads', 'selfies');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `selfie_${req.user?.id || Date.now()}_${Date.now()}.jpg`);
  },
});
const uploadSelfie = multer({
  storage: selfieStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed.'));
  },
});

// POST /api/auth/upload-selfie — upload selfie
router.post('/upload-selfie', uploadSelfie.single('selfie'), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Authentication required.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!req.file) return res.status(400).json({ error: 'Please take a photo.' });

    const filePath = `/uploads/selfies/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(decoded.id, { selfie: filePath, selfieVerified: true }, { new: true });

    const newToken = generateToken(user._id);
    res.json({ message: 'Selfie uploaded!', token: newToken, user: { _id: user._id, id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, location: user.location, emailVerified: !!user.emailVerified, phoneVerified: !!user.phoneVerified, selfie: filePath, selfieVerified: true, verificationStatus: user.verificationStatus || 'none', idProof: user.idProof || '', savedJobs: user.savedJobs || [] } });
  } catch (err) {
    console.error('[UploadSelfie]', err.message);
    res.status(500).json({ error: 'Could not upload selfie.' });
  }
});

// POST /api/auth/upload-id — upload ID proof
router.post('/upload-id', upload.single('idProof'), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Authentication required.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!req.file) return res.status(400).json({ error: 'Please upload a file (JPG, PNG, or PDF).' });

    const filePath = `/uploads/ids/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(decoded.id, { idProof: filePath }, { new: true });

    const newToken = generateToken(user._id);
    res.json({ message: 'ID uploaded successfully!', token: newToken, user: formatUser(user) });
  } catch (err) {
    console.error('[UploadID]', err.message);
    res.status(500).json({ error: 'Could not upload ID.' });
  }
});

// POST /api/auth/request-verification — request admin verification
router.post('/request-verification', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Authentication required.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    if (user.verificationStatus === 'verified') return res.json({ message: 'Already verified.' });

    user.verificationStatus = 'pending';
    await user.save();

    res.json({ message: 'Verification request submitted! Admin will review shortly.', user: formatUser(user) });
  } catch (err) {
    console.error('[RequestVerification]', err.message);
    res.status(500).json({ error: 'Could not submit request.' });
  }
});

// GET /api/auth/admin/pending-users — fetch users pending verification
router.get('/admin/pending-users', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Authentication required.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await User.findById(decoded.id);
    if (!admin || (admin.role !== 'admin' && admin.role !== 'recruiter')) return res.status(403).json({ error: 'Only admins can view pending users.' });

    const users = await User.find({ verificationStatus: 'pending' }).select('name email selfie selfieVerified idProof verificationStatus createdAt');
    res.json({ users });
  } catch (err) {
    console.error('[PendingUsers]', err.message);
    res.status(500).json({ error: 'Could not fetch pending users.' });
  }
});

// POST /api/auth/admin/verify-user — admin approves/rejects
router.post('/admin/verify-user', async (req, res) => {
  try {
    const { userId, status, notes } = req.body;
    if (!userId || !['verified', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Valid userId and status (verified/rejected) required.' });
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Authentication required.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await User.findById(decoded.id);
    if (!admin || (admin.role !== 'admin' && admin.role !== 'recruiter')) return res.status(403).json({ error: 'Only admins can verify users.' });

    const user = await User.findByIdAndUpdate(userId, { verificationStatus: status, ...(notes ? { adminNotes: notes } : {}) }, { new: true });

    // Notify user via email
    try {
      const { sendEmail } = require('../services/emailService');
      if (status === 'verified') {
        await sendEmail(user.email, '🎉 Your Nexova account is verified!',
          `Hi ${user.name},\n\nCongratulations! Your account has been verified. You now have a verified badge on your profile.\n\nBest regards,\nNexova Team`);
      } else {
        await sendEmail(user.email, 'Verification update',
          `Hi ${user.name},\n\nYour verification request was not approved.\n\n${notes ? 'Reason: ' + notes + '\n\n' : ''}You can re-upload your ID and try again.\n\nBest regards,\nNexova Team`);
      }
    } catch (e) { console.log('[Email notify]', e.message); }

    res.json({ message: `User ${status}!` });
  } catch (err) {
    console.error('[AdminVerify]', err.message);
    res.status(500).json({ error: 'Could not update verification status.' });
  }
});

// POST /api/auth/update-profile — update user profile
router.post('/update-profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Authentication required.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, phone, location } = req.body;
    const user = await User.findByIdAndUpdate(decoded.id, { name, phone, location }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    const newToken = generateToken(user._id);
    res.json({ message: 'Profile updated!', token: newToken, user: formatUser(user) });
  } catch (err) {
    res.status(500).json({ error: 'Could not update profile.' });
  }
});

module.exports = router;