const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  const host = process.env.EMAIL_HOST;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (host && user && pass) {
    try {
      transporter = nodemailer.createTransport({
        host, port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_PORT === '465',
        auth: { user, pass },
      });
      console.log('[Email] SMTP configured ✅');
    } catch (e) { console.warn('[Email] Failed to create transporter:', e.message); }
  } else {
    console.log('[Email] No SMTP config found. Email fallback to console.');
  }
  return transporter;
}

async function sendEmail(to, subject, text, html) {
  if (!to) return { success: false, reason: 'No email address' };
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@nexova.com';
  const t = getTransporter();
  if (!t) {
    console.log(`[EMAIL FALLBACK] To: ${to} | Subject: ${subject} | Body: ${text}`);
    return { success: true, fallback: true };
  }
  try {
    await t.sendMail({ from: `"Nexova" <${from}>`, to, subject, text, html });
    console.log(`[Email] Sent to ${to}`);
    return { success: true };
  } catch (err) {
    console.error(`[Email] Failed to ${to}:`, err.message);
    return { success: false, reason: err.message };
  }
}

async function sendPasswordResetOtp(email, name, otp) {
  const subject = `Your Nexova Password Reset Code: ${otp}`;
  const text = `Hello ${name || 'there'},\n\nYour reset code is: ${otp}\n\nThis code expires in 15 minutes.\n\nSteps:\n1. Go back to the Nexova app\n2. Enter this code: ${otp}\n3. Create your new password\n\nIf you did NOT ask to reset your password, ignore this email.\n\n-- Nexova Team`;
  const html = `
<!DOCTYPE html><html><head><meta charset="utf-8"/></head>
<body style="font-family:Arial,sans-serif;background:#f9fafb;margin:0;padding:20px;">
  <div style="max-width:480px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
    <div style="background:#2563eb;padding:28px 32px;text-align:center;">
      <span style="font-size:22px;font-weight:900;color:white;">Nexova</span>
      <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;font-size:15px;">Password Reset</p>
    </div>
    <div style="padding:32px;">
      <p style="font-size:18px;color:#1e293b;font-weight:600;margin:0 0 8px;">Hello ${name || 'there'} 👋</p>
      <p style="font-size:15px;color:#475569;line-height:1.6;margin:0 0 24px;">You asked to reset your password. Use the code below:</p>
      <div style="background:#eff6ff;border:2px solid #bfdbfe;border-radius:14px;padding:24px;text-align:center;margin-bottom:24px;">
        <p style="margin:0 0 8px;font-size:13px;color:#2563eb;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Your Reset Code</p>
        <p style="margin:0;font-size:42px;font-weight:900;letter-spacing:10px;color:#1e40af;">${otp}</p>
        <p style="margin:10px 0 0;font-size:13px;color:#64748b;">⏰ Expires in <strong>15 minutes</strong></p>
      </div>
      <div style="background:#f8fafc;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
        <p style="margin:0 0 10px;font-size:14px;font-weight:700;color:#334155;">How to use this code:</p>
        <ol style="margin:0;padding-left:20px;color:#475569;font-size:14px;line-height:2;">
          <li>Open the Nexova app</li>
          <li>Enter the code above when asked</li>
          <li>Choose a new password</li>
        </ol>
      </div>
      <p style="font-size:13px;color:#94a3b8;line-height:1.5;margin:0;">🔒 If you did <strong>not</strong> request this, ignore this email. Your account is safe.</p>
    </div>
    <div style="background:#f1f5f9;padding:16px 32px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#94a3b8;">Nexova Job Portal • Do not reply to this email</p>
    </div>
  </div>
</body></html>`;
  return sendEmail(email, subject, text, html);
}

module.exports = { sendEmail, sendPasswordResetOtp };




