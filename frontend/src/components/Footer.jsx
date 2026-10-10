import { Link } from 'react-router-dom';

export default function Footer() {
  const links = {
    Platform: [
      { to: '/jobs', label: 'Job Portal' },
      { to: '/services', label: 'Home Services' },
      { to: '/post-job', label: 'Post a Job' },
      { to: '/dashboard', label: 'Dashboard' },
    ],
    Company: [
      { to: '/about', label: 'About Us' },
      { to: '/contact', label: 'Contact' },
      { to: '/signup', label: 'Sign Up' },
      { to: '/login', label: 'Login' },
    ],
  };

  const infinityIcon = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F0E2DE" strokeWidth="2.2" strokeLinecap="round">
      <path d="M5 12c0-2.5 2-4 4-4s4 1.5 4 4-2 4-4 4-4-1.5-4-4zM11 12c0-2.5 2-4 4-4s4 1.5 4 4-2 4-4 4-4-1.5-4-4z"/>
    </svg>
  );

  return (
    <footer style={{ background: '#1B2A4A', color: '#FFFFFF' }}>
      <div style={{ background: '#2C4270', padding: '14px 20px', textAlign: 'center' }}>
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.04em' }}>
          India's most trusted job & home services platform · 10,000+ active opportunities
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-14">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'linear-gradient(135deg, #C4A882, #E8DCC8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {infinityIcon}
              </div>
              <div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24, fontWeight: 700, color: '#FFFFFF' }}>Nexova</div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, letterSpacing: '3px', color: '#C4A882', textTransform: 'uppercase', marginTop: 1 }}>Career Portal</div>
              </div>
            </div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 280 }}>
              Connecting job seekers and employers across India. Simple, fast, and trusted by thousands.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              {['📧', '🐦', '💼', '📱'].map((icon, i) => (
                <div key={i} style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: 'rgba(196,168,130,0.12)',
                  border: '1px solid rgba(196,168,130,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', fontSize: 16,
                }}>{icon}</div>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([cat, items]) => (
            <div key={cat}>
              <h4 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 700, color: '#C4A882', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>{cat}</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map(l => (
                  <li key={l.to}>
                    <Link to={l.to} style={{
                      fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.55)',
                      textDecoration: 'none', transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.target.style.color = '#C4A882'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.55)'}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 48, paddingTop: 24, display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>© 2026 Nexova · Made with ❤️ for India</p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Privacy · Terms · Cookies</p>
        </div>
      </div>
    </footer>
  );
}
