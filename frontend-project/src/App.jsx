import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import api from './api';
import Navbar from './components/Navbar.jsx';
import Login from './pages/Login.jsx';
import Cars from './pages/Cars.jsx';
import Packages from './pages/Packages.jsx';
import ServicePackages from './pages/ServicePackages.jsx';
import Payments from './pages/Payments.jsx';
import Reports from './pages/Reports.jsx';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/auth/me').then(r => setUser(r.data.user)).catch(() => setUser(null)).finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
    navigate('/login');
  };

  if (loading) return <div className="p-8">Loading…</div>;

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onLogout={logout} />
      <main className="max-w-6xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Navigate to="/cars" replace />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/servicepackages" element={<ServicePackages />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<Navigate to="/cars" replace />} />
        </Routes>
      </main>
    </div>
  );
}
