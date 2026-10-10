import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import BackgroundBlobs from '../components/BackgroundBlobs';

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quickApplying, setQuickApplying] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data.job);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, [id]);

  useEffect(() => {
    if (user && job) {
      setSaved((user.savedJobs || []).some(sid => String(sid) === id));
    }
  }, [user, job, id]);

  const handleToggleSave = async () => {
    if (!user) { navigate('/login'); return; }
    setSaving(true);
    try {
      if (saved) {
        await api.delete(`/jobs/${id}/save`);
        setSaved(false);
        addToast({ message: 'Job removed from saved.' });
      } else {
        await api.post(`/jobs/${id}/save`);
        setSaved(true);
        addToast({ message: 'Job saved!' });
      }
    } catch (err) {
      addToast({ message: 'Could not update.', type: 'error' });
    } finally { setSaving(false); }
  };

  const handleQuickApply = async () => {
    if (!user) { navigate('/login'); return; }
    setQuickApplying(true);
    try {
      const { data } = await api.post(`/jobs/${id}/quick-apply`);
      addToast({ message: data.message || 'Applied!' });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      const msg = err.response?.data?.error || 'Could not apply.';
      addToast({ message: msg, type: 'error' });
    } finally { setQuickApplying(false); }
  };

  const handleResendVerify = async () => {
    if (!user?.email) return;
    try {
      await api.post('/auth/resend-verify', { email: user.email });
      addToast({ message: 'Verification code sent to your email!' });
    } catch (err) {
      addToast({ message: 'Failed to resend.', type: 'error' });
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px 0', background: '#FAF8F6' }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(196,168,130,0.3)', borderTopColor: '#1B2A4A', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }}></div>
      <p style={{ color: 'rgba(27,42,74,0.5)', marginTop: 12, fontFamily: 'DM Sans, sans-serif' }}>Loading job details...</p>
    </div>
  );
  if (!job) return (
    <div style={{ maxWidth: 768, margin: '0 auto', padding: '80px 16px', textAlign: 'center', background: '#FAF8F6' }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>😕</div>
      <p style={{ fontSize: 20, fontWeight: 700, color: '#1B2A4A', fontFamily: 'Cormorant Garamond, serif', marginBottom: 8 }}>Job not found</p>
      <Link to="/jobs" style={{ color: '#1B2A4A', fontWeight: 600, fontFamily: 'DM Sans, sans-serif', textDecoration: 'underline' }}>← Back to Jobs</Link>
    </div>
  );

  const isOwner = user && String(job.postedBy?._id) === user.id;

  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 8rem)', background: '#FAF8F6' }}>
      <BackgroundBlobs opacity={0.4} />
      <div style={{ maxWidth: 768, margin: '0 auto', padding: '24px 16px', position: 'relative', zIndex: 1 }}>
      <Link to="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#1B2A4A', fontWeight: 600, fontFamily: 'DM Sans, sans-serif', textDecoration: 'underline', marginBottom: 16 }}>← Back to Jobs</Link>

      <div className="card-classic" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '24px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
            <div>
              <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 700, color: '#1B2A4A', fontFamily: 'Cormorant Garamond, serif', margin: 0 }}>{job.title}</h1>
              {job.company && <p style={{ color: 'rgba(27,42,74,0.5)', fontSize: 18, marginTop: 4, margin: 0 }}>{job.company}</p>}
              <p style={{ color: 'rgba(27,42,74,0.5)', marginTop: 4, fontFamily: 'DM Sans, sans-serif', fontSize: 14 }}>
                <span>📍 {job.location}</span>
                {job.type && <span style={{ marginLeft: 16 }}>💼 {job.type}</span>}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              {user && (
                <button onClick={handleToggleSave} disabled={saving} aria-label={saved ? 'Unsave job' : 'Save job'}
                  style={{
                    width: 40, height: 40, borderRadius: '50%', border: '1.5px solid rgba(27,42,74,0.1)',
                    background: saved ? '#1B2A4A' : 'transparent', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => { if (!saved) { e.currentTarget.style.background = 'rgba(27,42,74,0.06)'; }}}
                  onMouseLeave={e => { if (!saved) { e.currentTarget.style.background = 'transparent'; }}}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? '#FFFFFF' : 'none'} stroke={saved ? '#FFFFFF' : 'rgba(27,42,74,0.4)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                  </svg>
                </button>
              )}
              <span style={{
                padding: '8px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700,
                fontFamily: 'DM Sans, sans-serif',
                background: job.status === 'open' ? 'rgba(196,168,130,0.15)' : 'rgba(245,240,235,0.5)',
                color: job.status === 'open' ? '#1B2A4A' : 'rgba(27,42,74,0.5)',
              }}>
                {job.status === 'open' ? '✅ Open' : 'Closed'}
              </span>
            </div>
          </div>

          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 16, padding: 16,
            background: 'rgba(245,240,235,0.4)', borderRadius: 12,
            marginBottom: 24, fontSize: 13, color: 'rgba(27,42,74,0.55)',
            fontFamily: 'DM Sans, sans-serif',
          }}>
            <span style={{ fontFamily: 'DM Sans, sans-serif' }}>👤 Posted by: {job.postedBy?.name || 'Unknown'}</span>
            <span style={{ fontFamily: 'DM Sans, sans-serif' }}>📅 {job.createdAt ? new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</span>
            {job.salary && <span style={{ fontFamily: 'DM Sans, sans-serif' }}>💰 {job.salary}</span>}
          </div>

          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1B2A4A', fontFamily: 'Cormorant Garamond, serif', marginBottom: 12 }}>Job Description</h3>
            <p style={{ color: 'rgba(27,42,74,0.55)', lineHeight: 1.7, whiteSpace: 'pre-line', fontSize: 15, fontFamily: 'DM Sans, sans-serif' }}>{job.description}</p>
          </div>

          {!isOwner && job.status === 'open' && user && !user.emailVerified && (
            <div>
              <div style={{
                padding: 14, background: 'rgba(196,168,130,0.12)', borderRadius: 12,
                color: '#1B2A4A', fontSize: 14, textAlign: 'center', marginBottom: 12,
                fontFamily: 'DM Sans, sans-serif',
              }}>
                ⚠️ Verify your email to apply
              </div>
              <button onClick={handleResendVerify}
                className="btn-outline" style={{ width: '100%', padding: '12px 0', fontSize: 14 }}>
                Send Verification Code
              </button>
            </div>
          )}
          {!isOwner && job.status === 'open' && (!user || user.emailVerified) && (
            <button onClick={handleQuickApply} disabled={quickApplying}
              className="btn-primary" style={{ width: '100%', padding: '18px 0', fontSize: 18 }}>
              ⚡ {quickApplying ? 'Applying...' : 'Quick Apply'}
            </button>
          )}
          {isOwner && (
            <div style={{
              padding: 16, background: 'rgba(196,168,130,0.12)', borderRadius: 12,
              color: '#1B2A4A', fontSize: 15, fontWeight: 700, textAlign: 'center',
              fontFamily: 'DM Sans, sans-serif',
            }}>
              This is your job posting
            </div>
          )}
          {job.status !== 'open' && (
            <div style={{
              padding: 16, background: 'rgba(245,240,235,0.4)', borderRadius: 12,
              color: 'rgba(27,42,74,0.5)', fontSize: 15, fontWeight: 700, textAlign: 'center',
              fontFamily: 'DM Sans, sans-serif',
            }}>
              This job is closed
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
