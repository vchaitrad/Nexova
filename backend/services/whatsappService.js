const getTwilio = () => {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) return null;
  try {
    return require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  } catch (e) {
    console.warn('[WhatsApp] Twilio not installed. Run: npm install twilio');
    return null;
  }
};

async function sendWhatsApp(phone, message) {
  if (!phone) return { success: false, reason: 'No phone number' };
  let cleaned = phone.replace(/\s/g, '');
  if (!cleaned.startsWith('+')) cleaned = '+91' + cleaned.replace(/^0/, '');
  const to = `whatsapp:${cleaned}`;
  const from = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';
  const client = getTwilio();
  if (!client) {
    console.log(`[WhatsApp FALLBACK] To: ${to} | Message: ${message}`);
    return { success: true, fallback: true };
  }
  try {
    await client.messages.create({ body: message, from, to });
    console.log(`[WhatsApp] Sent to ${to} ✅`);
    return { success: true };
  } catch (err) {
    console.error(`[WhatsApp] Failed to ${to}:`, err.message);
    return { success: false, reason: err.message };
  }
}

async function notifyWelcome(phone, name) {
  return sendWhatsApp(phone, `👋 *Welcome to Nexova!*\n\nHi *${name}*! Your account has been created successfully.\n\nYou will receive job updates on this WhatsApp number. Happy job hunting! 🎯`);
}

module.exports = { sendWhatsApp, notifyWelcome };