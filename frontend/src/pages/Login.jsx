import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      addToast({ message: 'Please enter your email', type: 'error' });
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/send-otp', { email: email.trim().toLowerCase() });
      setStep(2);
      setTimer(600);
      addToast({ message: 'OTP sent to your email!' });
    } catch (err) {
      addToast({ message: err.response?.data?.error || 'Failed to send OTP', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await api.post('/auth/send-otp', { email: email.trim().toLowerCase() });
      setTimer(600);
      addToast({ message: 'OTP resent to your email!' });
    } catch (err) {
      addToast({ message: err.response?.data?.error || 'Failed to resend OTP', type: 'error' });
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
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) {
      addToast({ message: 'Please enter the full 6-digit code', type: 'error' });
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-otp-login', {
        email: email.trim().toLowerCase(),
        otp: code,
      });
      login(data.user, data.token);
      addToast({ message: 'Welcome back, ' + data.user.name + '!' });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      addToast({ message: err.response?.data?.error || 'Invalid OTP', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes infinityDraw {
          0%   { stroke-dashoffset: 400; opacity: 0.3; }
          50%  { stroke-dashoffset: 0;   opacity: 1; }
          100% { stroke-dashoffset: -400; opacity: 0.3; }
        }
        @keyframes infinityGlow {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(196,168,130,0.4)); }
          50%       { filter: drop-shadow(0 0 12px rgba(196,168,130,0.8)); }
        }
        .infinity-svg {
          animation: infinityGlow 3s ease-in-out infinite;
        }
        .infinity-path {
          stroke-dasharray: 400;
          animation: infinityDraw 3s ease-in-out infinite;
        }
        .input-login {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1.5px solid rgba(27,42,74,0.12);
          outline: none;
          font-size: 14px;
          color: #1B2A4A;
          background: #FAF8F6;
          box-sizing: border-box;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .input-login:focus {
          border-color: #C4A882;
          box-shadow: 0 0 0 3px rgba(196,168,130,0.15);
        }
        .btn-signin {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          font-weight: 700;
          font-size: 15px;
          border: none;
          color: white;
          background: #1B2A4A;
          box-shadow: 0 4px 18px rgba(27,42,74,0.25);
          transition: all 0.25s ease;
          cursor: pointer;
          letter-spacing: 0.3px;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-signin:hover:not(:disabled) {
          background: #2C4270;
          box-shadow: 0 6px 22px rgba(27,42,74,0.35);
          transform: translateY(-1px);
        }
        .btn-signin:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
        .otp-input {
          width: 48px;
          height: 56px;
          text-align: center;
          font-size: 24px;
          font-weight: 700;
          border-radius: 12px;
          border: 1.5px solid rgba(27,42,74,0.12);
          outline: none;
          color: #1B2A4A;
          background: #FAF8F6;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .otp-input:focus {
          border-color: #C4A882;
          box-shadow: 0 0 0 3px rgba(196,168,130,0.15);
        }
      `}</style>

      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: '#FAF8F6' }}>

        <div className="w-full max-w-sm">

          {/* Animated Infinity Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex flex-col items-center gap-2">
              <div className="mb-1">
                <svg className="infinity-svg" width="72" height="40" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    className="infinity-path"
                    d="M60 30 C60 30 72 10 90 10 C108 10 120 20 120 30 C120 40 108 50 90 50 C72 50 60 30 60 30 C60 30 48 10 30 10 C12 10 0 20 0 30 C0 40 12 50 30 50 C48 50 60 30 60 30 Z"
                    stroke="#C4A882" strokeWidth="5" strokeLinecap="round" fill="none"
                  />
                </svg>
              </div>
              <span style={{
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontSize: 26, fontWeight: 700, color: '#1B2A4A', letterSpacing: '3px',
              }}>NEXOVA</span>
              <span style={{
                fontSize: 9, letterSpacing: '4px', color: '#C4A882',
                textTransform: 'uppercase', fontWeight: 600,
              }}>CAREER PORTAL</span>
            </Link>
          </div>

          {/* Card */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 28,
            padding: '36px 32px',
            boxShadow: '0 8px 40px rgba(27,42,74,0.08), 0 2px 8px rgba(27,42,74,0.04)',
            border: '1px solid rgba(196,168,130,0.15)',
          }}>
            {step === 1 ? (
              <>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1B2A4A', marginBottom: 4 }}>
                  Welcome Back
                </h2>
                <p style={{ fontSize: 13, color: 'rgba(27,42,74,0.4)', marginBottom: 24 }}>
                  Enter your email to receive a login code
                </p>
                <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1B2A4A', marginBottom: 8 }}>
                      Email
                    </label>
                    <input
                      className="input-login"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>
                  <button type="submit" disabled={loading} className="btn-signin" style={{ marginTop: 4 }}>
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <button onClick={() => { setStep(1); setOtp(['', '', '', '', '', '']); }} style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    fontSize: 18, color: 'rgba(27,42,74,0.4)',
                  }}>←</button>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1B2A4A', margin: 0 }}>
                    Check Your Email
                  </h2>
                </div>
                <p style={{ fontSize: 13, color: 'rgba(27,42,74,0.4)', marginBottom: 4 }}>
                  We sent a 6-digit code to <strong style={{ color: '#1B2A4A' }}>{email}</strong>
                </p>

                <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 20 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1B2A4A', marginBottom: 12, textAlign: 'center' }}>
                      Enter Code
                    </label>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          id={`otp-${i}`}
                          className="otp-input"
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

                  <button type="submit" disabled={loading} className="btn-signin" style={{ marginTop: 4 }}>
                    {loading ? 'Verifying...' : 'Verify & Login'}
                  </button>

                  <div style={{ textAlign: 'center', fontSize: 13, color: 'rgba(27,42,74,0.4)' }}>
                    {timer > 0 ? (
                      <span>Resend in <strong>{Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}</strong></span>
                    ) : (
                      <button onClick={handleResend} disabled={loading} style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#1B2A4A', fontWeight: 700, fontSize: 13,
                        textDecoration: 'underline', fontFamily: 'DM Sans, sans-serif',
                      }}>
                        Resend OTP
                      </button>
                    )}
                  </div>
                </form>
              </>
            )}

            {/* Sign up */}
            <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(27,42,74,0.4)', marginTop: 24 }}>
              New here?{' '}
              <Link to="/signup" style={{ fontWeight: 700, color: '#1B2A4A', textDecoration: 'none', borderBottom: '1px solid rgba(27,42,74,0.15)' }}>
                Create Free Account
              </Link>
            </p>
          </div>

          <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(27,42,74,0.3)', marginTop: 20 }}>
            Free to use · Safe & Secure
          </p>
        </div>
      </div>
    </>
  );
}
