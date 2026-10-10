import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import BackgroundBlobs from '../components/BackgroundBlobs';

export default function PostJob() {
  const [form, setForm] = useState({ title: '', company: '', description: '', location: '', salary: '', type: 'Full-time' });
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== 'recruiter') {
    return (
      <div style={{ maxWidth: 448, margin: '0 auto', padding: '80px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🚫</div>
        <p style={{ fontSize: 20, fontWeight: 700, color: '#1B2A4A', fontFamily: 'Cormorant Garamond, serif', marginBottom: 8 }}>Only recruiters can post jobs</p>
        <p style={{ color: 'rgba(27,42,74,0.5)', fontFamily: 'DM Sans, sans-serif' }}>Sign up as a recruiter to post job listings.</p>
      </div>
    );
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/jobs', form);
      addToast({ message: 'Job posted! SMS alerts sent to job seekers.' });
      setForm({ title: '', company: '', description: '', location: '', salary: '', type: 'Full-time' });
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      addToast({ message: err.response?.data?.error || 'Could not post job.', type: 'error' });
    } finally { setLoading(false); }
  };

  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 8rem)', background: '#FAF8F6' }}>
      <BackgroundBlobs opacity={0.4} />
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '24px 16px', position: 'relative', zIndex: 1 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1B2A4A', fontFamily: 'Cormorant Garamond, serif', margin: '0 0 4px' }}>Post a New Job</h1>
      <p style={{ color: 'rgba(27,42,74,0.5)', marginBottom: 24, fontFamily: 'DM Sans, sans-serif', fontSize: 14 }}>Fill in the details below. Job seekers will be notified via SMS.</p>

      <div className="card-classic" style={{ padding: 24 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1B2A4A', marginBottom: 8, fontFamily: 'DM Sans, sans-serif' }}>Job Title *</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Plumber, Electrician, Driver" required
                className="input-field" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1B2A4A', marginBottom: 8, fontFamily: 'DM Sans, sans-serif' }}>Company Name</label>
              <input type="text" name="company" value={form.company} onChange={handleChange} placeholder="Company name"
                className="input-field" />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1B2A4A', marginBottom: 8, fontFamily: 'DM Sans, sans-serif' }}>Job Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the work, requirements, and daily pay..." rows="5" required
              className="input-field" style={{ resize: 'vertical', minHeight: 120 }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1B2A4A', marginBottom: 8, fontFamily: 'DM Sans, sans-serif' }}>Job Category *</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[
                { v: 'Plumbing', i: '🔧' }, { v: 'Electrician', i: '⚡' },
                { v: 'Cleaning', i: '🧹' }, { v: 'Painting', i: '🎨' },
                { v: 'Carpentry', i: '🛠️' }, { v: 'Construction', i: '🏗️' },
                { v: 'Driver', i: '🚚' }, { v: 'Cook', i: '🍳' },
                { v: 'Gardening', i: '🌿' }, { v: 'AC Service', i: '❄️' },
                { v: 'Pest Control', i: '🐛' }, { v: 'Mechanic', i: '🧑‍🔧' },
                { v: 'Labour', i: '👷' }, { v: 'Security', i: '🔒' },
                { v: 'Delivery', i: '📦' }, { v: 'Teaching', i: '👩‍🏫' },
                { v: 'IT', i: '💻' }, { v: 'Design', i: '✏️' },
                { v: 'Finance', i: '💰' }, { v: 'Healthcare', i: '🏥' },
              ].map((cat) => (
                <button type="button" key={cat.v} onClick={() => setForm({ ...form, category: cat.v })}
                  style={{
                    padding: '8px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                    fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', transition: 'all 0.15s ease',
                    border: form.category === cat.v ? '2px solid #1B2A4A' : '2px solid rgba(27,42,74,0.1)',
                    background: form.category === cat.v ? '#1B2A4A' : 'transparent',
                    color: form.category === cat.v ? '#FFFFFF' : 'rgba(27,42,74,0.6)',
                  }}>
                  {cat.i} {cat.v}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1B2A4A', marginBottom: 8, fontFamily: 'DM Sans, sans-serif' }}>Location *</label>
              <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="City, State" required
                className="input-field" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1B2A4A', marginBottom: 8, fontFamily: 'DM Sans, sans-serif' }}>Salary</label>
              <input type="text" name="salary" value={form.salary} onChange={handleChange} placeholder="e.g. ₹500/day or ₹15-20k/mo"
                className="input-field" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1B2A4A', marginBottom: 8, fontFamily: 'DM Sans, sans-serif' }}>Job Type</label>
              <select name="type" value={form.type} onChange={handleChange}
                className="input-field" style={{ cursor: 'pointer', appearance: 'auto' }}>
                {['Full-time', 'Part-time', 'Contract', 'Remote'].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="btn-primary" style={{ width: '100%', padding: '16px 0', fontSize: 16 }}>
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}
