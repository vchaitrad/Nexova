import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import BackgroundBlobs from '../components/BackgroundBlobs';

export default function Signup() {
  const [form, setForm] = useState({
    name: '', email: '', role: 'jobseeker',
    phone: '', location: '',
  });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [signupData, setSignupData] = useState(null);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      addToast({ message: 'Name and email are required', type: 'error' });
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', {
        ...form,
        email: form.email.trim().toLowerCase(),
        name: form.name.trim(),
        website: '',
        timestamp: Date.now(),
      });
      setSignupData(data);
      login(data.user, data.token);
      setStep(2);
      addToast({ message: 'Account created! Check your email for verification code.' });
    } catch (err) {
      addToast({ message: err.response?.data?.error || 'Signup failed. Try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`votp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`votp-${index - 1}`)?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) {
      addToast({ message: 'Enter the full 6-digit code', type: 'error' });
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-email', {
        email: form.email.trim().toLowerCase(),
        otp: code,
      });
      login(data.user, data.token);
      addToast({ message: 'Email verified! Welcome to Nexova!' });
      navigate('/dashboard');
    } catch (err) {
      addToast({ message: err.response?.data?.error || 'Verification failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await api.post('/auth/resend-verify', { email: form.email.trim().toLowerCase() });
      addToast({ message: 'Verification code resent!' });
    } catch (err) {
      addToast({ message: err.response?.data?.error || 'Failed to resend', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const infinityIcon = (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round">
      <path d="M5 12c0-2.5 2-4 4-4s4 1.5 4 4-2 4-4 4-4-1.5-4-4zM11 12c0-2.5 2-4 4-4s4 1.5 4 4-2 4-4 4-4-1.5-4-4z"/>
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ position: 'relative', background: '#FAF8F6' }}>
      <BackgroundBlobs opacity={0.4} />
      <div className="w-full max-w-sm" style={{ position: 'relative', zIndex: 1 }}>

        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1B2A4A, #2C4270)', boxShadow: '0 8px 24px rgba(27,42,74,0.2)' }}>
              {infinityIcon}
            </div>
            <span className="text-2xl font-extrabold tracking-wide" style={{ color: '#1B2A4A', fontFamily: 'Cormorant Garamond, serif' }}>NEXOVA</span>
            <span className="text-xs tracking-widest" style={{ color: '#C4A882', fontWeight: 600 }}>CAREER PORTAL</span>
          </Link>
        </div>

        <div className="rounded-3xl p-8" style={{ background: '#FFFFFF', border: '1px solid rgba(196,168,130,0.15)', boxShadow: '0 8px 40px rgba(27,42,74,0.08)' }}>

          {step === 1 ? (
            <>
              <h2 className="text-2xl font-extrabold mb-1" style={{ color: '#1B2A4A' }}>Create Account</h2>
              <p className="text-sm mb-6" style={{ color: 'rgba(27,42,74,0.45)' }}>Join and start finding work today</p>

              <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#1B2A4A' }}>Full Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange}
                    placeholder="Your full name" required
                    style={{
                      width: '100%', padding: '12px 16px', borderRadius: 12,
                      border: '1.5px solid rgba(27,42,74,0.1)', outline: 'none',
                      fontSize: 14, color: '#1B2A4A', background: '#FAF8F6',
                      boxSizing: 'border-box', fontFamily: 'DM Sans, sans-serif',
                    }}
                    onFocus={e => e.target.style.borderColor = '#C4A882'}
                    onBlur={e => e.target.style.borderColor = 'rgba(27,42,74,0.1)'} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#1B2A4A' }}>Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    placeholder="you@example.com" required
                    style={{
                      width: '100%', padding: '12px 16px', borderRadius: 12,
                      border: '1.5px solid rgba(27,42,74,0.1)', outline: 'none',
                      fontSize: 14, color: '#1B2A4A', background: '#FAF8F6',
                      boxSizing: 'border-box', fontFamily: 'DM Sans, sans-serif',
                    }}
                    onFocus={e => e.target.style.borderColor = '#C4A882'}
                    onBlur={e => e.target.style.borderColor = 'rgba(27,42,74,0.1)'} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#1B2A4A' }}>I am a...</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setForm({ ...form, role: 'jobseeker' })}
                      style={{
                        padding: '14px', borderRadius: 12, fontWeight: 700, fontSize: 14,
                        border: `2px solid ${form.role === 'jobseeker' ? '#1B2A4A' : 'rgba(27,42,74,0.1)'}`,
                        background: form.role === 'jobseeker' ? '#1B2A4A' : 'transparent',
                        color: form.role === 'jobseeker' ? '#FFFFFF' : 'rgba(27,42,74,0.5)',
                        cursor: 'pointer', transition: 'all 0.2s ease',
                        fontFamily: 'DM Sans, sans-serif',
                      }}>
                      Job Seeker
                    </button>
                    <button type="button" onClick={() => setForm({ ...form, role: 'recruiter' })}
                      style={{
                        padding: '14px', borderRadius: 12, fontWeight: 700, fontSize: 14,
                        border: `2px solid ${form.role === 'recruiter' ? '#1B2A4A' : 'rgba(27,42,74,0.1)'}`,
                        background: form.role === 'recruiter' ? '#1B2A4A' : 'transparent',
                        color: form.role === 'recruiter' ? '#FFFFFF' : 'rgba(27,42,74,0.5)',
                        cursor: 'pointer', transition: 'all 0.2s ease',
                        fontFamily: 'DM Sans, sans-serif',
                      }}>
                      Recruiter
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: '#1B2A4A' }}>Phone</label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91..."
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: 12,
                        border: '1.5px solid rgba(27,42,74,0.1)', outline: 'none',
                        fontSize: 14, color: '#1B2A4A', background: '#FAF8F6',
                        boxSizing: 'border-box', fontFamily: 'DM Sans, sans-serif',
                      }}
                      onFocus={e => e.target.style.borderColor = '#C4A882'}
                      onBlur={e => e.target.style.borderColor = 'rgba(27,42,74,0.1)'} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: '#1B2A4A' }}>Location</label>
                    <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="City"
                      style={{
                        width: '100%', padding: '12px 16px', borderRadius: 12,
                        border: '1.5px solid rgba(27,42,74,0.1)', outline: 'none',
                        fontSize: 14, color: '#1B2A4A', background: '#FAF8F6',
                        boxSizing: 'border-box', fontFamily: 'DM Sans, sans-serif',
                      }}
                      onFocus={e => e.target.style.borderColor = '#C4A882'}
                      onBlur={e => e.target.style.borderColor = 'rgba(27,42,74,0.1)'} />
                  </div>
                </div>
                <div style={{ position: 'absolute', left: '-9999px', opacity: 0 }} aria-hidden="true">
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                </div>
                <button type="submit" disabled={loading}
                  style={{
                    width: '100%', padding: '14px', borderRadius: 14,
                    fontWeight: 700, fontSize: 15, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                    background: loading ? '#4A5F85' : '#1B2A4A',
                    color: '#FFFFFF',
                    fontFamily: 'DM Sans, sans-serif',
                    boxShadow: '0 4px 14px rgba(27,42,74,0.2)',
                    transition: 'all 0.2s ease',
                  }}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>

              <p className="text-center text-sm mt-6" style={{ color: 'rgba(27,42,74,0.45)' }}>
                Already have an account?{' '}
                <Link to="/login" className="font-bold" style={{ color: '#1B2A4A', borderBottom: '1px solid rgba(27,42,74,0.15)', textDecoration: 'none' }}>
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <button onClick={() => { setStep(1); setOtp(['', '', '', '', '', '']); }} style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  fontSize: 18, color: 'rgba(27,42,74,0.4)',
                }}>←</button>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1B2A4A', margin: 0 }}>
                  Verify Your Email
                </h2>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(27,42,74,0.4)', marginBottom: 4 }}>
                We sent a 6-digit code to <strong style={{ color: '#1B2A4A' }}>{form.email}</strong>
              </p>
              <p style={{ fontSize: 12, color: 'rgba(196,168,130,0.8)', marginBottom: 20 }}>
                ⚠️ You must verify to apply for jobs
              </p>

              <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1B2A4A', marginBottom: 12, textAlign: 'center' }}>
                    Enter Code
                  </label>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`votp-${i}`}
                        style={{
                          width: 48, height: 56, textAlign: 'center', fontSize: 24, fontWeight: 700,
                          borderRadius: 12, border: '1.5px solid rgba(27,42,74,0.12)', outline: 'none',
                          color: '#1B2A4A', background: '#FAF8F6',
                          fontFamily: 'DM Sans, sans-serif',
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      />
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  style={{
                    width: '100%', padding: '14px', borderRadius: 14,
                    fontWeight: 700, fontSize: 15, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                    background: loading ? '#4A5F85' : '#C4A882',
                    color: '#FFFFFF',
                    fontFamily: 'DM Sans, sans-serif',
                    boxShadow: '0 4px 14px rgba(196,168,130,0.3)',
                    transition: 'all 0.2s ease',
                  }}>
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </button>

                <div style={{ textAlign: 'center' }}>
                  <button type="button" onClick={handleResend} disabled={loading} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#1B2A4A', fontWeight: 600, fontSize: 13,
                    textDecoration: 'underline', fontFamily: 'DM Sans, sans-serif',
                  }}>
                    Resend code
                  </button>
                </div>

                <div style={{
                  padding: 12, background: 'rgba(245,240,235,0.5)', borderRadius: 12,
                  fontSize: 12, color: 'rgba(27,42,74,0.5)', textAlign: 'center',
                  fontFamily: 'DM Sans, sans-serif',
                }}>
                  You can skip this now and verify later from your Profile page
                </div>
              </form>
            </>
          )}
        </div>
        <p className="text-center text-xs mt-5" style={{ color: 'rgba(27,42,74,0.3)' }}>
          Free to use · Safe & Secure
        </p>
      </div>
    </div>
  );
}
