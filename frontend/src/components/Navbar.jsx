import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/jobs', label: 'Job Portal' },
    { to: '/services', label: 'Home Services' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
  ];

  const infinityIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round">
      <path d="M5 12c0-2.5 2-4 4-4s4 1.5 4 4-2 4-4 4-4-1.5-4-4zM11 12c0-2.5 2-4 4-4s4 1.5 4 4-2 4-4 4-4-1.5-4-4z"/>
    </svg>
  );

  return (
    <nav style={{
      background: scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.75)',
      backdropFilter: 'blur(20px)',
      borderBottom: scrolled ? '1px solid rgba(27,42,74,0.08)' : '1px solid transparent',
      boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.04)' : 'none',
      position: 'sticky', top: 0, zIndex: 50,
      transition: 'all 0.4s ease',
    }}>
      <div className="max-w-7xl mx-auto px-5 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: 'linear-gradient(135deg, #1B2A4A, #2C4270)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(27,42,74,0.2)',
            transition: 'transform 0.3s ease',
          }} className="group-hover:scale-105">
            {infinityIcon}
          </div>
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 700, color: '#1B2A4A', lineHeight: 1 }}>Nexova</div>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, letterSpacing: '3px', color: '#1B2A4A', textTransform: 'uppercase', marginTop: 1 }}>Career Portal</div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 500,
              color: '#1B2A4A', padding: '8px 16px', borderRadius: 100,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.target.style.background = 'rgba(27,42,74,0.06)'; e.target.style.color = '#1B2A4A'; }}
            onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#1B2A4A'; }}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link to="/dashboard" style={{
                fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 500,
                color: '#1B2A4A', padding: '8px 20px', borderRadius: 100,
                border: '1.5px solid rgba(27,42,74,0.2)',
                transition: 'all 0.2s ease',
              }}>
                Dashboard
                {user.verificationStatus === 'verified' && (
                  <span style={{ marginLeft: 4, fontSize: 11, color: '#2E7D32' }}>✓</span>
                )}
              </Link>
              <Link to="/profile" style={{
                fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 500,
                color: '#1B2A4A', padding: '8px 20px', borderRadius: 100,
                border: '1.5px solid rgba(27,42,74,0.2)',
                transition: 'all 0.2s ease',
              }}>Profile</Link>
              <button onClick={logout} style={{
                fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600,
                background: '#1B2A4A', color: '#FFFFFF', padding: '9px 22px', borderRadius: 100,
                border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(27,42,74,0.15)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.target.style.background = '#2C4270'; }}
              onMouseLeave={e => { e.target.style.background = '#1B2A4A'; }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 500,
                color: '#1B2A4A', padding: '8px 20px', borderRadius: 100,
                border: '1.5px solid rgba(27,42,74,0.2)',
                transition: 'all 0.2s ease',
              }}>Login</Link>
              <Link to="/signup" style={{
                fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600,
                background: '#1B2A4A', color: '#FFFFFF', padding: '9px 22px', borderRadius: 100,
                boxShadow: '0 4px 14px rgba(27,42,74,0.15)',
                transition: 'all 0.2s ease',
              }}>Get Started</Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)} style={{ color: '#1B2A4A' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? <><path d="M18 6L6 18"/><path d="M6 6l12 12"/></> : <><path d="M3 12h18"/><path d="M3 6h18"/><path d="M3 18h18"/></>}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div style={{ background: '#FFFFFF', borderTop: '1px solid rgba(27,42,74,0.08)', padding: '12px 20px 20px', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} style={{
              display: 'block', padding: '12px 4px',
              fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 500, color: '#1B2A4A',
              borderBottom: '1px solid rgba(27,42,74,0.06)',
            }}>{l.label}</Link>
          ))}
          <div className="flex gap-3 mt-4">
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="btn-outline flex-1 text-center">Profile</Link>
                <button onClick={() => { logout(); setMenuOpen(false); }} className="btn-primary flex-1">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-outline flex-1 text-center">Login</Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className="btn-primary flex-1 text-center">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
