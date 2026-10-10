import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import BackgroundBlobs from '../components/BackgroundBlobs';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { addToast } = useToast();

  const handleRequestOtp = async (e) => {
    e?.preventDefault();
    setError('');
    if (!email.trim()) { setError('Please enter your email address'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Email should look like: yourname@gmail.com'); return; }
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: email.trim().toLowerCase() });
      addToast({ message: 'A reset code was sent to your email!' });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not send reset code. Please try again.');
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!otp.trim()) { setError('Please enter the code from your email'); return; }
    setLoading(true);
    try {
      await api.post('/auth/verify-otp', { email: email.trim().toLowerCase(), otp: otp.trim() });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || 'Wrong code. Please check your email and try again.');
    } finally { setLoading(false); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (!newPassword) { setError('Please enter a new password'); return; }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters long'); return; }
    if (newPassword !== confirmPassword) { setError('Both passwords must match. Please type the same password again.'); return; }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { email: email.trim().toLowerCase(), otp: otp.trim(), newPassword });
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not reset password. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 8rem)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', position: 'relative', background: '#FAF8F6' }}>
      <BackgroundBlobs opacity={0.4} />
      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 16, textDecoration: 'none' }}>
            <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #1B2A4A, #2C4270)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(27,42,74,0.2)' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L22 12L12 22L2 12L12 2Z" />
              </svg>
            </div>
            <span style={{ fontSize: 24, fontWeight: 700, color: '#1B2A4A', fontFamily: 'Cormorant Garamond, serif' }}>Nexova</span>
          </Link>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1B2A4A', fontFamily: 'Cormorant Garamond, serif', marginBottom: 4 }}>Forgot Password?</h1>
          <p style={{ color: 'rgba(27,42,74,0.5)', fontFamily: 'DM Sans, sans-serif', fontSize: 15 }}>Don't worry! We will help you.</p>
        </div>

        {step < 4 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, padding: '0 8px' }}>
            {[{ num: 1, label: 'Email' }, { num: 2, label: 'Code' }, { num: 3, label: 'New Password' }].map((s, i) => (
              <div key={s.num} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 13, border: '2px solid',
                    background: step > s.num ? '#1B2A4A' : step === s.num ? '#1B2A4A' : 'rgba(245,240,235,0.5)',
                    borderColor: step > s.num ? '#1B2A4A' : step === s.num ? '#1B2A4A' : 'rgba(27,42,74,0.12)',
                    color: step > s.num ? '#FFFFFF' : step === s.num ? '#FFFFFF' : 'rgba(27,42,74,0.35)',
                  }}>
                    {step > s.num ? '✓' : s.num}
                  </div>
                  <span style={{ fontSize: 11, marginTop: 4, fontWeight: 600, color: step >= s.num ? '#1B2A4A' : 'rgba(27,42,74,0.35)' }}>{s.label}</span>
                </div>
                {i < 2 && <div style={{ flex: 1, height: 3, margin: '0 8px', marginBottom: 16, borderRadius: 2, background: step > s.num ? '#1B2A4A' : 'rgba(27,42,74,0.08)' }} />}
              </div>
            ))}
          </div>
        )}

        <div className="card-classic" style={{ padding: 24 }}>

          {step === 1 && (
            <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: 20 }} noValidate>
              <div style={{
                background: 'rgba(196,168,130,0.12)', border: '1.5px solid rgba(196,168,130,0.25)',
                borderRadius: 12, padding: 14, display: 'flex', gap: 10,
              }}>
                <span style={{ fontSize: 24 }}>📧</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#1B2A4A', margin: 0 }}>Step 1: Enter your email</p>
                  <p style={{ fontSize: 13, color: 'rgba(27,42,74,0.55)', marginTop: 2 }}>We will send a secret code to your email. Use that code to create a new password.</p>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1B2A4A', marginBottom: 8 }}>Your Email Address</label>
                <input type="email" value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="example@gmail.com" autoComplete="email"
                  className="input-field"
                />
                <p style={{ fontSize: 12, color: 'rgba(27,42,74,0.35)', marginTop: 6 }}>This is the email you used to create your account</p>
              </div>
              {error && <ErrorBox message={error} />}
              <button type="submit" disabled={loading}
                className="btn-primary" style={{ width: '100%', padding: '16px 0', fontSize: 16 }}>
                {loading ? <Spinner text="Sending code..." /> : 'Send Reset Code to My Email'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: 20 }} noValidate>
              <div style={{
                background: 'rgba(196,168,130,0.12)', border: '1.5px solid rgba(196,168,130,0.25)',
                borderRadius: 12, padding: 14, display: 'flex', gap: 10,
              }}>
                <span style={{ fontSize: 24 }}>📬</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#1B2A4A', margin: 0 }}>Step 2: Enter the code</p>
                  <p style={{ fontSize: 13, color: 'rgba(27,42,74,0.55)', marginTop: 2 }}>Check your email <strong>{email}</strong>. We sent a code there. Type it below.</p>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1B2A4A', marginBottom: 8 }}>Enter the Code from Your Email</label>
                <input type="text" inputMode="numeric" value={otp}
                  onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setError(''); }}
                  placeholder="Enter code here" maxLength={6}
                  style={{
                    width: '100%', padding: '16px 0', borderRadius: 12, border: '1.5px solid rgba(27,42,74,0.12)',
                    outline: 'none', fontSize: 28, textAlign: 'center', letterSpacing: 8, fontWeight: 700,
                    background: '#FAF8F6', color: '#1B2A4A', fontFamily: 'DM Sans, sans-serif',
                    transition: 'all 0.2s',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#C4A882'; e.target.style.boxShadow = '0 0 0 4px rgba(196,168,130,0.12)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(27,42,74,0.12)'; e.target.style.boxShadow = 'none'; }}
                />
                <p style={{ fontSize: 12, color: 'rgba(27,42,74,0.35)', marginTop: 6, textAlign: 'center' }}>The code is in your email inbox. It expires in 15 minutes.</p>
              </div>
              {error && <ErrorBox message={error} />}
              <button type="submit" disabled={loading}
                className="btn-primary" style={{ width: '100%', padding: '16px 0', fontSize: 16 }}>
                {loading ? <Spinner text="Checking code..." /> : 'Verify Code'}
              </button>
              <button type="button" onClick={() => { setStep(1); setOtp(''); setError(''); }}
                className="btn-ghost" style={{ width: '100%', padding: '12px 0', fontSize: 14 }}>
                ← Go Back / Use Different Email
              </button>
              <p style={{ fontSize: 12, textAlign: 'center', color: 'rgba(27,42,74,0.35)' }}>
                Didn't get the email? Check your spam folder or{' '}
                <button type="button" onClick={handleRequestOtp} style={{ color: '#1B2A4A', fontWeight: 600, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 12 }}>resend the code</button>
              </p>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: 20 }} noValidate>
              <div style={{
                background: 'rgba(196,168,130,0.12)', border: '1.5px solid rgba(196,168,130,0.25)',
                borderRadius: 12, padding: 14, display: 'flex', gap: 10,
              }}>
                <span style={{ fontSize: 24 }}>🔒</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#1B2A4A', margin: 0 }}>Step 3: Create a new password</p>
                  <p style={{ fontSize: 13, color: 'rgba(27,42,74,0.55)', marginTop: 2 }}>Choose a new password you will remember easily.</p>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1B2A4A', marginBottom: 8 }}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? 'text' : 'password'} value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                    placeholder="Create a new password" autoComplete="new-password"
                    className="input-field" style={{ paddingRight: 56 }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 20, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(27,42,74,0.35)' }}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                <p style={{ fontSize: 12, color: 'rgba(27,42,74,0.35)', marginTop: 6 }}>At least 6 characters. Example: MyJob2024</p>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1B2A4A', marginBottom: 8 }}>Type the Same Password Again</label>
                <input type={showPassword ? 'text' : 'password'} value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                  placeholder="Type the same password again" autoComplete="new-password"
                  className="input-field"
                  style={{
                    borderColor: confirmPassword && newPassword !== confirmPassword ? '#EF4444' : confirmPassword && newPassword === confirmPassword ? '#1B2A4A' : undefined,
                    background: confirmPassword && newPassword !== confirmPassword ? 'rgba(239,68,68,0.06)' : confirmPassword && newPassword === confirmPassword ? 'rgba(27,42,74,0.04)' : undefined,
                  }}
                />
                {confirmPassword && newPassword === confirmPassword && <p style={{ fontSize: 12, color: '#1B2A4A', marginTop: 6, fontWeight: 600 }}>Passwords match!</p>}
                {confirmPassword && newPassword !== confirmPassword && <p style={{ fontSize: 12, color: '#EF4444', marginTop: 6, fontWeight: 600 }}>Passwords do not match</p>}
              </div>
              {error && <ErrorBox message={error} />}
              <button type="submit" disabled={loading}
                className="btn-primary" style={{ width: '100%', padding: '16px 0', fontSize: 16 }}>
                {loading ? <Spinner text="Saving new password..." /> : 'Save New Password'}
              </button>
            </form>
          )}

          {step === 4 && (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 20, padding: '16px 0' }}>
              <div style={{ fontSize: 64 }}>🎉</div>
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1B2A4A', fontFamily: 'Cormorant Garamond, serif', margin: 0 }}>Password Changed!</h2>
                <p style={{ color: 'rgba(27,42,74,0.5)', marginTop: 8, fontFamily: 'DM Sans, sans-serif', fontSize: 15, lineHeight: 1.6 }}>Your password has been successfully updated.<br />You can now sign in with your new password.</p>
              </div>
              <div style={{
                background: 'rgba(196,168,130,0.12)', border: '1.5px solid rgba(196,168,130,0.25)',
                borderRadius: 12, padding: 14,
              }}>
                <p style={{ fontSize: 13, color: '#1B2A4A', fontWeight: 600, margin: 0 }}>Remember your new password and keep it safe!</p>
              </div>
              <Link to="/login" className="btn-primary" style={{ width: '100%', padding: '16px 0', fontSize: 16, textDecoration: 'none', textAlign: 'center' }}>
                Go to Sign In
              </Link>
            </div>
          )}
        </div>

        {step < 4 && (
          <p style={{ textAlign: 'center', color: 'rgba(27,42,74,0.5)', marginTop: 20, fontFamily: 'DM Sans, sans-serif', fontSize: 13 }}>
            Remembered your password?{' '}
            <Link to="/login" style={{ color: '#1B2A4A', fontWeight: 700, textDecoration: 'underline' }}>Sign In →</Link>
          </p>
        )}
      </div>
    </div>
  );
}

function ErrorBox({ message }) {
  return (
    <div style={{
      background: 'rgba(239,68,68,0.08)', border: '1.5px solid rgba(239,68,68,0.2)',
      borderRadius: 12, padding: 12, display: 'flex', gap: 8, alignItems: 'flex-start',
    }}>
      <span style={{ fontSize: 18 }}>⚠️</span>
      <p style={{ fontSize: 13, color: '#DC2626', fontWeight: 600, margin: 0 }}>{message}</p>
    </div>
  );
}

function Spinner({ text }) {
  return (
    <>
      <span style={{
        display: 'inline-block', width: 20, height: 20,
        border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#FFFFFF',
        borderRadius: '50%', animation: 'spin 0.6s linear infinite',
      }}></span>
      {text}
    </>
  );
}
