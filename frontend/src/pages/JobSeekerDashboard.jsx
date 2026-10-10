import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import BackgroundBlobs from '../components/BackgroundBlobs';
import { useAuth } from '../context/AuthContext';

export default function JobSeekerDashboard() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [tab, setTab] = useState('applications');

  const fetchApps = async () => {
    try {
      const { data } = await api.get('/applications/my');
      setApps(data.applications || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchSaved = async () => {
    try {
      const { data } = await api.get('/jobs/saved');
      setSavedJobs(data.jobs || []);
    } catch (err) { console.error(err); }
    finally { setLoadingSaved(false); }
  };

  useEffect(() => { fetchApps(); fetchSaved(); }, []);

  const handleWithdraw = async (appId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    setDeleting(appId);
    try {
      await api.delete(`/applications/${appId}`);
      setApps(prev => prev.filter(a => a._id !== appId));
    } catch (err) {
      alert(err.response?.data?.error || 'Could not withdraw. Try again.');
    } finally { setDeleting(null); }
  };

  const handleUnsave = async (jobId) => {
    try {
      await api.delete(`/jobs/${jobId}/save`);
      setSavedJobs(prev => prev.filter(j => j._id !== jobId));
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px 0', background: '#FAF8F6' }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(196,168,130,0.3)', borderTopColor: '#1B2A4A', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }}></div>
      <p style={{ color: 'rgba(27,42,74,0.5)', marginTop: 12, fontFamily: 'DM Sans, sans-serif' }}>Loading dashboard...</p>
    </div>
  );

  const pending  = apps.filter(a => a.status === 'pending').length;
  const accepted = apps.filter(a => a.status === 'accepted').length;
  const rejected = apps.filter(a => a.status === 'rejected').length;

  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 8rem)', background: '#FAF8F6' }}>
      <BackgroundBlobs opacity={0.4} />
      <div style={{ maxWidth: 896, margin: '0 auto', padding: '24px 16px', position: 'relative', zIndex: 1 }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1B2A4A', fontFamily: 'Cormorant Garamond, serif', margin: 0 }}>My Dashboard</h1>
          {user?.verificationStatus === 'verified' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600, background: '#E8F5E9', color: '#2E7D32', fontFamily: 'DM Sans, sans-serif' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#2E7D32" stroke="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              Verified
            </span>
          )}
        </div>
        <p style={{ color: 'rgba(27,42,74,0.5)', marginBottom: 24, fontFamily: 'DM Sans, sans-serif', fontSize: 14 }}>
          {apps.length} application{apps.length !== 1 ? 's' : ''} · {savedJobs.length} saved job{savedJobs.length !== 1 ? 's' : ''}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 16, marginBottom: 20 }}>
          {[
            { label: 'Total',    val: apps.length, icon: '📋' },
            { label: 'Pending',  val: pending,     icon: '⏳' },
            { label: 'Accepted', val: accepted,    icon: '✅' },
            { label: 'Rejected', val: rejected,    icon: '❌' },
          ].map((s, i) => (
            <div key={i} className="card-classic" style={{ padding: '20px 0', textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 36, fontWeight: 700, color: '#1B2A4A', fontFamily: 'Cormorant Garamond, serif', lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: 13, color: 'rgba(27,42,74,0.5)', fontFamily: 'DM Sans, sans-serif', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'rgba(245,240,235,0.5)', borderRadius: 12, padding: 4 }}>
          <button onClick={() => setTab('applications')} style={{
            flex: 1, padding: '10px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600,
            background: tab === 'applications' ? '#FFFFFF' : 'transparent',
            color: tab === 'applications' ? '#1B2A4A' : 'rgba(27,42,74,0.5)',
            boxShadow: tab === 'applications' ? '0 2px 8px rgba(27,42,74,0.06)' : 'none',
            transition: 'all 0.2s ease',
          }}>
            Applications ({apps.length})
          </button>
          <button onClick={() => setTab('saved')} style={{
            flex: 1, padding: '10px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600,
            background: tab === 'saved' ? '#FFFFFF' : 'transparent',
            color: tab === 'saved' ? '#1B2A4A' : 'rgba(27,42,74,0.5)',
            boxShadow: tab === 'saved' ? '0 2px 8px rgba(27,42,74,0.06)' : 'none',
            transition: 'all 0.2s ease',
          }}>
            Saved Jobs ({savedJobs.length})
          </button>
        </div>

        {/* Applications tab */}
        {tab === 'applications' && (
          <>
            {apps.length === 0 ? (
              <div className="card-classic" style={{ textAlign: 'center', padding: '64px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1B2A4A', fontFamily: 'Cormorant Garamond, serif', marginBottom: 8 }}>No applications yet</h3>
                <p style={{ color: 'rgba(27,42,74,0.5)', marginBottom: 24, fontFamily: 'DM Sans, sans-serif' }}>Browse available jobs and start applying.</p>
                <Link to="/jobs" className="btn-primary" style={{ padding: '14px 24px', fontSize: 14, textDecoration: 'none' }}>Browse Jobs</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {apps.map((app) => (
                  <div key={app._id} className="card-classic" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                      <Link to={`/jobs/${app.jobId?._id}`} style={{ flex: 1, minWidth: 0, textDecoration: 'none' }}>
                        <h3 style={{ fontWeight: 700, color: '#1B2A4A', fontSize: 17, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'DM Sans, sans-serif' }}>{app.jobId?.title || 'Unknown Job'}</h3>
                        {app.jobId?.location && <p style={{ color: 'rgba(27,42,74,0.5)', fontSize: 13, marginTop: 4, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>📍 {app.jobId.location} · {app.jobId.type}</p>}
                        {app.jobId?.company  && <p style={{ color: 'rgba(27,42,74,0.5)', fontSize: 13, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>{app.jobId.company}</p>}
                        <p style={{ fontSize: 12, color: 'rgba(27,42,74,0.35)', marginTop: 4, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
                          Applied {new Date(app.appliedAt || app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </Link>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                        <span style={{
                          padding: '8px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700,
                          fontFamily: 'DM Sans, sans-serif',
                          background: app.status === 'accepted' ? 'rgba(196,168,130,0.15)' : app.status === 'rejected' ? 'rgba(239,68,68,0.08)' : 'rgba(245,240,235,0.5)',
                          color: app.status === 'accepted' ? '#1B2A4A' : app.status === 'rejected' ? '#DC2626' : 'rgba(27,42,74,0.55)',
                        }}>
                          {app.status === 'accepted' ? '✅ ' : app.status === 'rejected' ? '❌ ' : '⏳ '}{app.status}
                        </span>
                        {app.status === 'pending' && (
                          <button onClick={(e) => handleWithdraw(app._id, e)} disabled={deleting === app._id}
                            style={{
                              padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                              color: '#DC2626', border: '1px solid rgba(239,68,68,0.3)',
                              background: 'transparent', cursor: 'pointer',
                              opacity: deleting === app._id ? 0.5 : 1,
                              fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => { e.target.style.background = 'rgba(239,68,68,0.06)'; }}
                            onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}>
                            {deleting === app._id ? 'Withdrawing...' : '🗑 Withdraw'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Saved Jobs tab */}
        {tab === 'saved' && (
          <>
            {loadingSaved ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ width: 32, height: 32, border: '3px solid rgba(196,168,130,0.3)', borderTopColor: '#1B2A4A', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }}></div>
              </div>
            ) : savedJobs.length === 0 ? (
              <div className="card-classic" style={{ textAlign: 'center', padding: '64px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>🔖</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1B2A4A', fontFamily: 'Cormorant Garamond, serif', marginBottom: 8 }}>No saved jobs</h3>
                <p style={{ color: 'rgba(27,42,74,0.5)', marginBottom: 24, fontFamily: 'DM Sans, sans-serif' }}>Save jobs to view them later.</p>
                <Link to="/jobs" className="btn-primary" style={{ padding: '14px 24px', fontSize: 14, textDecoration: 'none' }}>Browse Jobs</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {savedJobs.map((job) => (
                  <div key={job._id} className="card-classic" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                      <Link to={`/jobs/${job._id}`} style={{ flex: 1, minWidth: 0, textDecoration: 'none' }}>
                        <h3 style={{ fontWeight: 700, color: '#1B2A4A', fontSize: 17, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'DM Sans, sans-serif' }}>{job.title}</h3>
                        {job.location && <p style={{ color: 'rgba(27,42,74,0.5)', fontSize: 13, marginTop: 4, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>📍 {job.location} · {job.type}</p>}
                      </Link>
                      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                        <Link to={`/jobs/${job._id}`} className="btn-primary" style={{ padding: '8px 16px', fontSize: 13, textDecoration: 'none' }}>View</Link>
                        <button onClick={() => handleUnsave(job._id)} style={{
                          padding: '8px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                          color: 'rgba(27,42,74,0.5)', border: '1px solid rgba(27,42,74,0.1)',
                          background: 'transparent', cursor: 'pointer',
                          fontFamily: 'DM Sans, sans-serif',
                        }}>Unsave</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
