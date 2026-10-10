const https = require('https');

async function sendSMS(phone, message) {
  if (!phone) return { success: false, reason: 'No phone number' };

  // Clean number — remove +91, spaces, dashes, keep only 10 digits
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('91') && cleaned.length === 12) cleaned = cleaned.slice(2);
  if (cleaned.length !== 10) {
    console.warn(`[SMS] Invalid number: ${phone}`);
    return { success: false, reason: 'Invalid phone number' };
  }

  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) {
    console.log(`[SMS FALLBACK] To: ${cleaned} | ${message}`);
    return { success: true, fallback: true };
  }

  const payload = JSON.stringify({
    route: 'q',
    message: message,
    language: 'english',
    flash: 0,
    numbers: cleaned,
  });

  return new Promise((resolve) => {
    const options = {
      hostname: 'www.fast2sms.com',
      path: '/dev/bulkV2',
      method: 'POST',
      headers: {
        'authorization': apiKey,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.return === true) {
            console.log(`[SMS ✅] Sent to ${cleaned}`);
            resolve({ success: true });
          } else {
            console.error(`[SMS ❌] Failed:`, parsed.message || data);
            resolve({ success: false, reason: parsed.message });
          }
        } catch (e) {
          console.error(`[SMS ❌] Parse error:`, data);
          resolve({ success: false, reason: data });
        }
      });
    });

    req.on('error', (err) => {
      console.error(`[SMS ❌] Request error:`, err.message);
      resolve({ success: false, reason: err.message });
    });

    req.write(payload);
    req.end();
  });
}

async function notifyWelcome(phone, name) {
  return sendSMS(phone,
    `Welcome to Nexova, ${name}! Your account has been created successfully. Start browsing jobs now!`
  );
}

async function notifyLogin(phone, name) {
  return sendSMS(phone,
    `Nexova Login Alert: Hi ${name}, you have successfully logged in. If this was not you, contact us immediately!`
  );
}

async function notifyOTP(phone, name, otp) {
  return sendSMS(phone,
    `Nexova Password Reset: Hi ${name}, your OTP is ${otp}. This code expires in 15 minutes. Do not share it with anyone.`
  );
}

async function notifyApplicationSubmitted(phone, applicantName, jobTitle) {
  return sendSMS(phone,
    `Nexova: Hi ${applicantName}, your application for "${jobTitle}" has been submitted successfully. The employer will contact you soon!`
  );
}

async function notifyNewApplicant(phone, recruiterName, jobTitle) {
  return sendSMS(phone,
    `Nexova: Hi ${recruiterName}, someone just applied for your job "${jobTitle}". Check your Nexova dashboard!`
  );
}

module.exports = {
  sendSMS,
  notifyWelcome,
  notifyLogin,
  notifyOTP,
  notifyApplicationSubmitted,
  notifyNewApplicant,
};