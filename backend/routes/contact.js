const express = require('express');
const router = express.Router();
const { sendEmail } = require('../services/emailService');

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const adminEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'vchaitrad@gmail.com';

    await sendEmail(
      adminEmail,
      `[Nexova Contact] ${subject}`,
      `From: ${name} (${email})\n\n${message}`,
      `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="font-family:Arial,sans-serif;background:#f9fafb;margin:0;padding:20px;">
  <div style="max-width:560px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
    <div style="background:#1B2A4A;padding:24px 32px;text-align:center;">
      <span style="font-size:20px;font-weight:900;color:#C4A882;">Nexova</span>
      <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:13px;">New Contact Message</p>
    </div>
    <div style="padding:32px;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:8px 0;font-weight:700;color:#1B2A4A;width:90px;">Name</td><td style="padding:8px 0;color:#475569;">${name}</td></tr>
        <tr><td style="padding:8px 0;font-weight:700;color:#1B2A4A;">Email</td><td style="padding:8px 0;color:#475569;">${email}</td></tr>
        <tr><td style="padding:8px 0;font-weight:700;color:#1B2A4A;">Subject</td><td style="padding:8px 0;color:#475569;">${subject}</td></tr>
      </table>
      <div style="background:#f8fafc;border-radius:12px;padding:20px;margin-top:16px;">
        <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#334155;">Message:</p>
        <p style="margin:0;color:#475569;line-height:1.7;white-space:pre-wrap;">${message}</p>
      </div>
    </div>
    <div style="background:#f1f5f9;padding:16px 32px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#94a3b8;">Sent from Nexova Contact Form</p>
    </div>
  </div>
</body>
</html>`
    );

    await sendEmail(
      email,
      'Thank you for contacting Nexova',
      `Hi ${name},\n\nThank you for reaching out! We have received your message and will get back to you within 24 hours.\n\nHere's a copy of your message:\nSubject: ${subject}\nMessage: ${message}\n\nBest regards,\nNexova Team`,
      `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="font-family:Arial,sans-serif;background:#f9fafb;margin:0;padding:20px;">
  <div style="max-width:480px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
    <div style="background:#1B2A4A;padding:28px 32px;text-align:center;">
      <span style="font-size:22px;font-weight:900;color:#C4A882;">Nexova</span>
      <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;font-size:14px;">We received your message</p>
    </div>
    <div style="padding:32px;">
      <p style="font-size:18px;color:#1e293b;font-weight:600;margin:0 0 8px;">Hi ${name} 👋</p>
      <p style="font-size:15px;color:#475569;line-height:1.6;margin:0 0 20px;">Thank you for reaching out! We have received your message and will get back to you within <strong>24 hours</strong>.</p>
      <div style="background:#f8fafc;border-radius:12px;padding:16px 20px;">
        <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#334155;">Your Message:</p>
        <p style="margin:0 0 4px;color:#64748b;font-size:14px;"><strong>Subject:</strong> ${subject}</p>
        <p style="margin:0;color:#64748b;font-size:14px;"><strong>Message:</strong> ${message}</p>
      </div>
    </div>
    <div style="background:#f1f5f9;padding:16px 32px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#94a3b8;">Nexova Job Portal • Connect Talent with Opportunity</p>
    </div>
  </div>
</body>
</html>`
    );

    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error('[Contact] Error:', err.message);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

module.exports = router;
