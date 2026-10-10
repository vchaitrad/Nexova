import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import BackgroundBlobs from '../components/BackgroundBlobs';

export default function Jobs() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [applying, setApplying] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await api.get('/jobs', { params: { search, type } });
        setJobs(data.jobs || []);
      } catch (err) {
        const msg = err.response?.data?.error || err.message || 'Could not fetch jobs.';
        setError(msg);
        console.error(err);
      } finally { setLoading(false); }
    })();
  }, [search, type]);

  const handleQuickApply = async (jobId) => {
    if (!user) {
      addToast({ message: 'Please login first to apply.', type: 'error' });
      return;
    }
    setApplying(jobId);
    try {
      const { data } = await api.post(`/jobs/${jobId}/quick-apply`);
      addToast({ message: data.message });
    } catch (err) {
      addToast({ message: err.response?.data?.error || 'Could not apply.', type: 'error' });
    } finally { setApplying(null); }
  };

  const categories = [
    { icon: '🔧', label: 'Plumbing' }, { icon: '⚡', label: 'Electrician' },
    { icon: '🧹', label: 'Cleaning' }, { icon: '🎨', label: 'Painting' },
    { icon: '🛠️', label: 'Carpentry' }, { icon: '🏗️', label: 'Construction' },
    { icon: '🚚', label: 'Driver' }, { icon: '🍳', label: 'Cook' },
    { icon: '🌿', label: 'Gardening' }, { icon: '❄️', label: 'AC Service' },
    { icon: '🐛', label: 'Pest Control' }, { icon: '🧑‍🔧', label: 'Mechanic' },
    { icon: '👷', label: 'Labour' }, { icon: '🔒', label: 'Security' },
    { icon: '📦', label: 'Delivery' }, { icon: '👩‍🏫', label: 'Teaching' },
  ];

  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 8rem)', background: '#FAF8F6' }}>
      <BackgroundBlobs opacity={0.4} />
      <div style={{ maxWidth: 1152, margin: '0 auto', padding: '24px 16px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1B2A4A', fontFamily: 'Cormorant Garamond, serif', margin: 0 }}>Find Jobs</h1>
          <p style={{ color: 'rgba(27,42,74,0.5)', fontFamily: 'DM Sans, sans-serif', fontSize: 14, marginTop: 4 }}>{jobs.length} job{jobs.length !== 1 ? 's' : ''} available</p>
        </div>

        <div style={{ overflow: 'hidden', padding: '10px 0', marginBottom: 20, borderTop: '1px solid rgba(27,42,74,0.06)', borderBottom: '1px solid rgba(27,42,74,0.06)', background: 'rgba(245,240,235,0.4)' }}>
          <div style={{ display: 'flex', whiteSpace: 'nowrap' }}>
            <div className="animate-marquee" style={{ display: 'flex', flexShrink: 0 }}>
              {[...categories, ...categories].map((item, i) => (
                <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 24px', borderRight: '1px solid rgba(27,42,74,0.06)', cursor: 'pointer' }} onClick={() => setSearch(item.label)}>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: '#1B2A4A', letterSpacing: '0.03em' }}>{item.icon} {item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'row', gap: 12, marginBottom: 24, maxWidth: 560, margin: '0 auto' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 18 }}>🔍</span>
            <input type="text" placeholder="Search jobs, company, or location..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="input-field" style={{ paddingLeft: 48 }} />
          </div>
          <select value={type} onChange={(e) => setType(e.target.value)}
            className="input-field" style={{ cursor: 'pointer', appearance: 'auto' }}>
            <option value="">All Types</option>
            {['Full-time', 'Part-time', 'Contract', 'Remote'].map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ width: 40, height: 40, border: '3px solid rgba(196,168,130,0.3)', borderTopColor: '#1B2A4A', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }}></div>
            <p style={{ color: 'rgba(27,42,74,0.5)', marginTop: 12, fontFamily: 'DM Sans, sans-serif', fontSize: 14 }}>Loading jobs...</p>
          </div>
        ) : error ? (
          <div className="card-classic" style={{ textAlign: 'center', padding: '64px 0', maxWidth: 448, margin: '0 auto', border: '1.5px solid rgba(239,68,68,0.2)' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1B2A4A', fontFamily: 'Cormorant Garamond, serif', marginBottom: 8 }}>Something went wrong</h3>
            <p style={{ color: 'rgba(27,42,74,0.5)', marginBottom: 16, fontFamily: 'DM Sans, sans-serif', fontSize: 14 }}>{error}</p>
            <button onClick={() => window.location.reload()} className="btn-primary" style={{ padding: '12px 24px', fontSize: 14 }}>Try Again</button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="card-classic" style={{ textAlign: 'center', padding: '64px 0', maxWidth: 448, margin: '0 auto' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1B2A4A', fontFamily: 'Cormorant Garamond, serif', marginBottom: 8 }}>No jobs found</h3>
            <p style={{ color: 'rgba(27,42,74,0.5)', marginBottom: 8, fontFamily: 'DM Sans, sans-serif' }}>Try changing your search or filters.</p>
            <p style={{ color: 'rgba(27,42,74,0.35)', fontFamily: 'DM Sans, sans-serif', fontSize: 13 }}>Check back later for new job postings.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 16 }}>
            {jobs.map((job) => (
              <Link to={`/jobs/${job._id}`} key={job._id} className="card-classic" style={{ padding: 24, display: 'block', textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12, background: 'rgba(196,168,130,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <span style={{ color: '#1B2A4A', fontWeight: 700, fontSize: 18, fontFamily: 'DM Sans, sans-serif' }}>{job.title?.[0]?.toUpperCase()}</span>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ fontWeight: 700, color: '#1B2A4A', fontSize: 15, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'DM Sans, sans-serif' }}>{job.title}</h3>
                    {job.company && <p style={{ color: 'rgba(27,42,74,0.5)', fontSize: 13, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'DM Sans, sans-serif' }}>{job.company}</p>}
                  </div>
                </div>
                <p style={{ color: 'rgba(27,42,74,0.55)', fontSize: 13, marginBottom: 12, fontFamily: 'DM Sans, sans-serif' }}>
                  <span>📍 {job.location}</span>
                  {job.type && <span style={{ marginLeft: 12 }}>💼 {job.type}</span>}
                </p>
                <p style={{ color: 'rgba(27,42,74,0.5)', fontSize: 13, lineHeight: 1.6, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontFamily: 'DM Sans, sans-serif' }}>{job.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(27,42,74,0.06)', fontSize: 12, color: 'rgba(27,42,74,0.35)' }}>
                  <span style={{ fontFamily: 'DM Sans, sans-serif' }}>👤 {job.postedBy?.name || 'Company'}</span>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontFamily: 'DM Sans, sans-serif' }}>📅 {job.createdAt ? new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''}</span>
                    <button onClick={(e) => { e.preventDefault(); handleQuickApply(job._id); }} disabled={applying === job._id} style={{
                      padding: '10px 20px', borderRadius: 24, fontSize: 14, fontWeight: 700,
                      background: applying === job._id ? '#4A5F85' : '#1B2A4A',
                      color: '#FFFFFF', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                      transition: 'all 0.2s', whiteSpace: 'nowrap',
                    }}
                      onMouseEnter={(e) => { if (applying !== job._id) e.target.style.background = '#2C4270'; }}
                      onMouseLeave={(e) => { if (applying !== job._id) e.target.style.background = '#1B2A4A'; }}>
                      ⚡ {applying === job._id ? 'Applying...' : 'Quick Apply'}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
