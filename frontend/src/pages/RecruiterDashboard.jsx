import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import BackgroundBlobs from '../components/BackgroundBlobs';

const tabs = [
  { key: 'jobs',   label: 'Jobs',      icon: '📋' },
  { key: 'apps',   label: 'Applicants', icon: '👥' },
  { key: 'admin',  label: 'Admin',      icon: '🛡️' },
];

export default function RecruiterDashboard() {
  const [tab, setTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const [jobsRes, appsRes, pendingRes] = await Promise.all([
          api.get('/jobs/my'),
          api.get('/applicants'),
          api.get('/auth/admin/pending-users').catch(() => ({ data: { users: [] } }))
        ]);
        setJobs(jobsRes.data.jobs || []);
        setApplicants(appsRes.data.applications || []);
        setPendingUsers(pendingRes.data.users || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, []);

  const verifyUser = async (userId, status) => {
    try {
      await api.post('/auth/admin/verify-user', { userId, status });
      addToast({ message: `User ${status === 'verified' ? 'verified' : 'rejected'}!` });
      setPendingUsers(prev => prev.filter(u => u._id !== userId));
      setApplicants(prev => prev.map(a =>
        a.applicantId?._id === userId
          ? { ...a, applicantId: { ...a.applicantId, verificationStatus: status } }
          : a
      ));
    } catch (err) {
      addToast({ message: err.response?.data?.error || 'Could not update.', type: 'error' });
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/applications/${id}/status`, { status });
      addToast({ message: `Application ${status === 'accepted' ? 'accepted' : 'rejected'}! Email sent.` });
      setApplicants(prev => prev.map(a => a._id === id ? { ...a, status } : a));
    } catch (err) {
      addToast({ message: err.response?.data?.error || 'Could not update.', type: 'error' });
    }
  };

  const closeJob = async (id) => {
    try {
      await api.patch(`/jobs/${id}/close`);
      addToast({ message: 'Job closed.' });
      setJobs(prev => prev.map(j => j._id === id ? { ...j, status: 'closed' } : j));
    } catch (err) {
      addToast({ message: 'Could not close job.', type: 'error' });
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px 0', background: '#FAF8F6' }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(196,168,130,0.3)', borderTopColor: '#1B2A4A', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }}></div>
      <p style={{ color: 'rgba(27,42,74,0.5)', marginTop: 12, fontFamily: 'DM Sans, sans-serif' }}>Loading dashboard...</p>
    </div>
  );

  const activeJobs = jobs.filter(j => j.status === 'open').length;
  const pendingApps = applicants.filter(a => a.status === 'pending').length;

  const tabStyle = (k) => ({
    padding: '10px 20px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', border: 'none',
    background: tab === k ? '#1B2A4A' : 'transparent', color: tab === k ? '#fff' : 'rgba(27,42,74,0.55)', transition: 'all 0.15s',
  });

  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 8rem)', background: '#FAF8F6' }}>
      <BackgroundBlobs opacity={0.4} />
      <div style={{ maxWidth: 1152, margin: '0 auto', padding: '24px 16px', position: 'relative', zIndex: 1 }}>
        <div className="flex flex-col sm:flex-row" style={{ alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1B2A4A', fontFamily: 'Cormorant Garamond, serif', margin: '0 0 4px' }}>Recruiter Dashboard</h1>
            <p style={{ color: 'rgba(27,42,74,0.5)', marginTop: 4, fontFamily: 'DM Sans, sans-serif', fontSize: 14 }}>Manage your jobs and applicants</p>
          </div>
          {tab === 'jobs' && (
            <Link to="/post-job" className="btn-primary" style={{ padding: '14px 24px', fontSize: 14, textDecoration: 'none' }}>
              + Post New Job
            </Link>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={tabStyle(t.key)}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {tab !== 'admin' && (
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 16, marginBottom: 32 }}>
            {[
              { label: 'Active Jobs', val: activeJobs, icon: '📋' },
              { label: 'Total Jobs', val: jobs.length, icon: '📁' },
              { label: 'Applicants', val: applicants.length, icon: '👥' },
              { label: 'Pending', val: pendingApps, icon: '⏳' },
            ].map((s, i) => (
              <div key={i} className="card-classic" style={{ padding: '20px 0', textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: 36, fontWeight: 700, color: '#1B2A4A', fontFamily: 'Cormorant Garamond, serif', lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: 13, color: 'rgba(27,42,74,0.5)', fontFamily: 'DM Sans, sans-serif', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'jobs' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1B2A4A', fontFamily: 'Cormorant Garamond, serif', marginBottom: 16 }}>Your Jobs</h2>
            {jobs.length === 0 ? (
              <div className="card-classic" style={{ textAlign: 'center', padding: '48px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1B2A4A', fontFamily: 'Cormorant Garamond, serif', marginBottom: 8 }}>No jobs posted yet</h3>
                <p style={{ color: 'rgba(27,42,74,0.5)', marginBottom: 16, fontFamily: 'DM Sans, sans-serif' }}>Post your first job to start receiving applications.</p>
                <Link to="/post-job" className="btn-primary" style={{ padding: '12px 24px', fontSize: 14, textDecoration: 'none' }}>Post a Job</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {jobs.map((job) => (
                  <div key={job._id} className="card-classic" style={{ padding: 20 }}>
                    <div className="flex flex-col sm:flex-row" style={{ alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                      <div>
                        <h3 style={{ fontWeight: 700, color: '#1B2A4A', fontSize: 17, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>{job.title}</h3>
                        <p style={{ color: 'rgba(27,42,74,0.5)', fontSize: 13, marginTop: 4, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>📍 {job.location} · {job.type} · {new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{
                          padding: '6px 12px', borderRadius: 12, fontSize: 13, fontWeight: 700, fontFamily: 'DM Sans, sans-serif',
                          background: job.status === 'open' ? 'rgba(196,168,130,0.15)' : 'rgba(245,240,235,0.5)',
                          color: job.status === 'open' ? '#1B2A4A' : 'rgba(27,42,74,0.5)',
                        }}>{job.status === 'open' ? '✅ Open' : 'Closed'}</span>
                        {job.status === 'open' && (
                          <button onClick={() => closeJob(job._id)} style={{
                            padding: '6px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600,
                            color: 'rgba(27,42,74,0.55)', background: 'rgba(245,240,235,0.5)',
                            border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                          }}
                          onMouseEnter={(e) => { e.target.style.background = 'rgba(239,68,68,0.08)'; e.target.style.color = '#DC2626'; }}
                          onMouseLeave={(e) => { e.target.style.background = 'rgba(245,240,235,0.5)'; e.target.style.color = 'rgba(27,42,74,0.55)'; }}>
                            Close
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'apps' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1B2A4A', fontFamily: 'Cormorant Garamond, serif', marginBottom: 16 }}>Applicants</h2>
            {applicants.length === 0 ? (
              <div className="card-classic" style={{ textAlign: 'center', padding: '48px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1B2A4A', fontFamily: 'Cormorant Garamond, serif', marginBottom: 8 }}>No applicants yet</h3>
                <p style={{ color: 'rgba(27,42,74,0.5)', fontFamily: 'DM Sans, sans-serif' }}>Applicants will appear here when people apply to your jobs.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {applicants.map((app) => {
                  const av = app.applicantId;
                  const verified = av?.verificationStatus === 'verified';
                  return (
                    <div key={app._id} className="card-classic" style={{ padding: 20 }}>
                      <div className="flex flex-col sm:flex-row" style={{ alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                          <div style={{ flexShrink: 0 }}>
                            {av?.selfie ? (
                              <img src={`${av.selfie}`} alt={av?.name}
                                style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: verified ? '2px solid #2E7D32' : '2px solid #C4A882' }}
                                onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = `<div style="width:52px;height:52px;border-radius:12px;background:rgba(196,168,130,0.2);display:flex;align-items:center;justify-content:center;"><span style="color:#1B2A4A;font-weight:700;font-size:18;">${(av?.name?.[0] || '?').toUpperCase()}</span></div>` }} />
                            ) : (
                              <div style={{ width: 52, height: 52, borderRadius: 12, background: 'rgba(196,168,130,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ color: '#1B2A4A', fontWeight: 700, fontSize: 18, fontFamily: 'DM Sans, sans-serif' }}>{av?.name?.[0]?.toUpperCase() || '?'}</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                              <h3 style={{ fontWeight: 700, color: '#1B2A4A', fontSize: 17, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>{av?.name || 'Unknown'}</h3>
                              {av?.emailVerified && <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: '#E8F5E9', color: '#2E7D32', fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>✅ Email</span>}
                              {verified && <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: '#E8F5E9', color: '#2E7D32', fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>🛡️ Verified</span>}
                            </div>
                            <p style={{ color: 'rgba(27,42,74,0.5)', fontSize: 13, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>{app.jobId?.title} · {av?.email}</p>
                            {av?.phone && <p style={{ color: 'rgba(27,42,74,0.35)', fontSize: 13, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>📱 {av.phone}</p>}
                            <p style={{ fontSize: 12, color: 'rgba(27,42,74,0.35)', marginTop: 4, fontFamily: 'DM Sans, sans-serif' }}>Applied {new Date(app.appliedAt || app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{
                            padding: '6px 12px', borderRadius: 12, fontSize: 13, fontWeight: 700, fontFamily: 'DM Sans, sans-serif',
                            background: app.status === 'accepted' ? 'rgba(196,168,130,0.15)' : app.status === 'rejected' ? 'rgba(239,68,68,0.08)' : 'rgba(245,240,235,0.5)',
                            color: app.status === 'accepted' ? '#1B2A4A' : app.status === 'rejected' ? '#DC2626' : 'rgba(27,42,74,0.55)',
                          }}>
                            {app.status === 'accepted' ? '✅ ' : app.status === 'rejected' ? '❌ ' : '⏳ '}{app.status}
                          </span>
                          {app.status === 'pending' && (
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button onClick={() => updateStatus(app._id, 'accepted')} style={{
                                padding: '8px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700,
                                background: '#1B2A4A', color: '#FFFFFF', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                              }}
                              onMouseEnter={(e) => { e.target.style.background = '#2C4270'; }}
                              onMouseLeave={(e) => { e.target.style.background = '#1B2A4A'; }}>
                                Accept
                              </button>
                              <button onClick={() => updateStatus(app._id, 'rejected')} style={{
                                padding: '8px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600,
                                color: 'rgba(27,42,74,0.55)', background: 'rgba(245,240,235,0.5)',
                                border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                              }}
                              onMouseEnter={(e) => { e.target.style.background = 'rgba(239,68,68,0.08)'; e.target.style.color = '#DC2626'; }}
                              onMouseLeave={(e) => { e.target.style.background = 'rgba(245,240,235,0.5)'; e.target.style.color = 'rgba(27,42,74,0.55)'; }}>
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {tab === 'admin' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1B2A4A', fontFamily: 'Cormorant Garamond, serif', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
              🛡️ Verify Users {pendingUsers.length > 0 && <span style={{ fontSize: 12, padding: '2px 10px', borderRadius: 100, background: '#DC2626', color: '#fff', fontWeight: 600 }}>{pendingUsers.length} pending</span>}
            </h2>
            <p style={{ fontSize: 13, color: 'rgba(27,42,74,0.5)', fontFamily: 'DM Sans, sans-serif', marginBottom: 16 }}>Review users who requested account verification</p>

            {pendingUsers.length === 0 ? (
              <div className="card-classic" style={{ textAlign: 'center', padding: '48px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>👍</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1B2A4A', fontFamily: 'Cormorant Garamond, serif', marginBottom: 8 }}>No pending requests</h3>
                <p style={{ color: 'rgba(27,42,74,0.5)', fontFamily: 'DM Sans, sans-serif' }}>Users who request verification will appear here.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {pendingUsers.map((u) => (
                  <div key={u._id} className="card-classic" style={{ padding: 20 }}>
                    <div className="flex flex-col sm:flex-row" style={{ alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <div style={{ flexShrink: 0 }}>
                          {u.selfie ? (
                            <img src={`${u.selfie}`} alt={u.name}
                              style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid #C4A882' }}
                              onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = `<div style="width:56px;height:56px;border-radius:12px;background:rgba(196,168,130,0.2);display:flex;align-items:center;justify-content:center;"><span style="color:#1B2A4A;font-weight:700;font-size:20;">${(u.name?.[0] || '?').toUpperCase()}</span></div>` }} />
                          ) : (
                            <div style={{ width: 56, height: 56, borderRadius: 12, background: 'rgba(196,168,130,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ color: '#1B2A4A', fontWeight: 700, fontSize: 20, fontFamily: 'DM Sans, sans-serif' }}>{u.name?.[0]?.toUpperCase() || '?'}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 style={{ fontWeight: 700, color: '#1B2A4A', fontSize: 17, margin: 0, fontFamily: 'DM Sans, sans-serif' }}>{u.name}</h3>
                          <p style={{ color: 'rgba(27,42,74,0.5)', fontSize: 13, marginTop: 2, fontFamily: 'DM Sans, sans-serif' }}>{u.email}</p>
                          <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: u.selfie ? '#E8F5E9' : '#F5F5F5', color: u.selfie ? '#2E7D32' : '#9E9E9E', fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>🤳 Selfie {u.selfie ? '✓' : '—'}</span>
                            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: u.idProof ? '#E8F5E9' : '#F5F5F5', color: u.idProof ? '#2E7D32' : '#9E9E9E', fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>🪪 ID {u.idProof ? '✓' : '—'}</span>
                            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: '#F5F5F5', color: '#9E9E9E', fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>📅 {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => verifyUser(u._id, 'verified')} style={{
                          padding: '8px 20px', borderRadius: 12, fontSize: 13, fontWeight: 700,
                          background: '#1B2A4A', color: '#FFFFFF', border: 'none', cursor: 'pointer',
                          fontFamily: 'DM Sans, sans-serif',
                        }}>✅ Approve</button>
                        <button onClick={() => verifyUser(u._id, 'rejected')} style={{
                          padding: '8px 20px', borderRadius: 12, fontSize: 13, fontWeight: 600,
                          color: 'rgba(27,42,74,0.55)', background: 'rgba(245,240,235,0.5)',
                          border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                        }}
                        onMouseEnter={(e) => { e.target.style.background = 'rgba(239,68,68,0.08)'; e.target.style.color = '#DC2626'; }}
                        onMouseLeave={(e) => { e.target.style.background = 'rgba(245,240,235,0.5)'; e.target.style.color = 'rgba(27,42,74,0.55)'; }}>
                          ❌ Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
