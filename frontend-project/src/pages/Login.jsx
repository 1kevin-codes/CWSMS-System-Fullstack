import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const r = await api.post('/auth/login', { username, password });
      onLogin(r.data.user);
      navigate('/cars');
    } catch (e) {
      setErr(e.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <form onSubmit={submit} className="bg-white p-6 rounded shadow w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-blue-700">CWSMS Login</h1>
        {err && <div className="bg-red-100 text-red-700 p-2 rounded text-sm">{err}</div>}
        <div>
          <label className="block text-sm mb-1">Username</label>
          <input className="w-full border rounded p-2" value={username} onChange={e=>setUsername(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input type="password" className="w-full border rounded p-2" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Sign in</button>
      </form>
    </div>
  );
}
