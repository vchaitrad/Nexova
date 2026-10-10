import { useState } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';

const faqs = [
  { q: 'Is Nexova free to use?', a: 'Yes! Job seekers can sign up and apply for jobs completely free. Employers have free and premium posting options.' },
  { q: 'How do I post a job?', a: 'Create a recruiter account, head to your dashboard, and click "Post a Job". It takes just 2 minutes.' },
  { q: 'Which cities does Nexova cover?', a: 'We cover all major Indian cities and are rapidly expanding to tier-2 and tier-3 cities.' },
  { q: 'How do I book a home service?', a: 'Visit the Home Services section, choose a category, and select a verified professional near you.' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post('/contact', form);
      setSent(true);
      addToast({ message: 'Message sent successfully!' });
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to send message. Try again later.';
      addToast({ message: msg, type: 'error' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div>

      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '90px 20px 60px', textAlign: 'center', background: '#FFFFFF' }}>
        <div className="animate-blob" style={{ position: 'absolute', top: '5%', left: '10%', width: 280, height: 280, background: 'radial-gradient(circle, rgba(196,168,130,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div className="animate-blob-delay" style={{ position: 'absolute', bottom: '10%', right: '8%', width: 200, height: 200, background: 'radial-gradient(circle, rgba(240,226,222,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div className="animate-float" style={{ position: 'absolute', top: '15%', right: '20%', width: 50, height: 50, borderRadius: '50%', background: 'rgba(196,168,130,0.05)', pointerEvents: 'none' }} />
        <div className="animate-float-delay" style={{ position: 'absolute', bottom: '30%', left: '5%', width: 40, height: 40, borderRadius: '50%', background: 'rgba(240,226,222,0.08)', pointerEvents: 'none' }} />
        <div className="max-w-3xl mx-auto" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-tag" style={{ marginBottom: 20 }}>Contact Us</div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(44px, 6vw, 72px)', fontWeight: 700, color: '#1B2A4A', lineHeight: 1.1, marginBottom: 20 }}>
            We're Here to <span style={{ color: '#C4A882' }}>Help</span>
          </h1>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 17, color: 'rgba(27,42,74,0.55)', lineHeight: 1.8 }}>
            Have a question, feedback, or need support? Reach out — our team responds within 24 hours.
          </p>
        </div>
      </section>

      {/* CONTACT CARDS */}
      <section style={{ padding: '0 20px 60px', background: '#FFFFFF' }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-5">
          {[
            { icon: '📧', title: 'Email Us', info: 'vchaitrad@gmail.com', sub: 'We reply within 24 hours' },
            { icon: '📞', title: 'Call Us', info: '+91 8971193958', sub: 'Mon–Sat, 9am–6pm IST' },
            { icon: '📍', title: 'Visit Us', info: 'Hubli, Karnataka', sub: 'India 580030' },
          ].map((c, i) => (
            <div key={i} className="card-classic" style={{ padding: '32px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{c.icon}</div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 700, color: '#1B2A4A', marginBottom: 6 }}>{c.title}</h3>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, color: '#C4A882', marginBottom: 4 }}>{c.info}</div>
              <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(27,42,74,0.45)' }}>{c.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FORM + FAQ */}
      <section style={{ background: '#FAF8F6', padding: '60px 20px' }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <div className="section-tag" style={{ marginBottom: 16 }}>Send a Message</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 700, color: '#1B2A4A', marginBottom: 28 }}>Get in Touch</h2>
            {sent ? (
              <div className="card-classic" style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 28, fontWeight: 700, color: '#1B2A4A', marginBottom: 10 }}>Message Sent!</h3>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'rgba(27,42,74,0.45)' }}>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'rgba(27,42,74,0.55)', display: 'block', marginBottom: 6 }}>Your Name</label>
                    <input className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Ravi Kumar" required />
                  </div>
                  <div>
                    <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'rgba(27,42,74,0.55)', display: 'block', marginBottom: 6 }}>Email</label>
                    <input className="input-field" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="ravi@email.com" required />
                  </div>
                </div>
                <div>
                  <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'rgba(27,42,74,0.55)', display: 'block', marginBottom: 6 }}>Subject</label>
                  <input className="input-field" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="How can we help?" required />
                </div>
                <div>
                  <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'rgba(27,42,74,0.55)', display: 'block', marginBottom: 6 }}>Message</label>
                  <textarea className="input-field" rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Tell us more..." required style={{ resize: 'vertical' }} />
                </div>
                <button type="submit" disabled={sending} className="btn-primary" style={{ fontSize: 15, padding: '14px 32px', alignSelf: 'flex-start' }}>{sending ? 'Sending...' : 'Send Message →'}</button>
              </form>
            )}
          </div>

          <div>
            <div className="section-tag" style={{ marginBottom: 16 }}>FAQ</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 700, color: '#1B2A4A', marginBottom: 28 }}>Common Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{
                  borderRadius: 16, border: '1px solid rgba(27,42,74,0.06)',
                  overflow: 'hidden', background: openFaq === i ? '#FFFFFF' : 'transparent',
                  transition: 'all 0.2s',
                }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                    width: '100%', padding: '18px 20px', textAlign: 'left', background: 'none', border: 'none',
                    cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
                  }}>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 600, color: '#1B2A4A' }}>{faq.q}</span>
                    <span style={{ color: '#C4A882', fontSize: 20, flexShrink: 0 }}>{openFaq === i ? '−' : '+'}</span>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: '0 20px 18px' }}>
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(27,42,74,0.55)', lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
