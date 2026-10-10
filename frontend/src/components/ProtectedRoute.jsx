import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', background: '#FAF8F6' }}>
        <div style={{ width: 32, height: 32, border: '3px solid rgba(196,168,130,0.3)', borderTopColor: '#1B2A4A', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
      </div>
    );
  }

  const effectiveUser = user || JSON.parse(localStorage.getItem('user') || 'null');

  if (!effectiveUser) return <Navigate to="/login" replace />;
  if (role && effectiveUser.role !== role) return <Navigate to="/dashboard" replace />;

  return children;
}
