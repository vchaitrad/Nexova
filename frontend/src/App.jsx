import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import PostJob from './pages/PostJob';
import RecruiterDashboard from './pages/RecruiterDashboard';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import About from './pages/About';
import HomeServices from './pages/HomeServices';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import { useAuth } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<HomeServices />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/post-job" element={<ProtectedRoute role="recruiter"><PostJob /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}

function DashboardRouter() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return user.role === 'recruiter' ? <RecruiterDashboard /> : <JobSeekerDashboard />;
}