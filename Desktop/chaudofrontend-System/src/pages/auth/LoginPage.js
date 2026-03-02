import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const successMsg = location.state?.message;

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'tailor') navigate('/tailor/dashboard');
      else navigate('/home');
    } catch (err) {
      const data = err.response?.data;
      if (data?.non_field_errors) setError(data.non_field_errors[0]);
      else if (data?.detail) setError(data.detail);
      else if (typeof data === 'object') setError(Object.values(data).flat().join(' '));
      else setError('Imeshindwa kuingia. Jaribu tena.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="text-center mb-2">
          <div style={{ fontSize: '3rem' }}>✂️</div>
          <h2 className="auth-title">Karibu Tena!</h2>
          <p className="auth-subtitle">Ingiza taarifa zako ili kuendelea</p>
        </div>

        {successMsg && <div className="alert alert-success">{successMsg}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Jina la Kuingia (Username)</label>
            <input name="username" value={form.username} onChange={handleChange} className="form-input" placeholder="Jina la kuingia" required autoFocus />
          </div>
          <div className="form-group">
            <label className="form-label">Neno Siri</label>
            <input name="password" value={form.password} onChange={handleChange} className="form-input" type="password" placeholder="Neno siri" required />
          </div>
          <button type="submit" className="btn btn-primary w-full" style={{ marginTop: '0.5rem' }} disabled={loading}>
            {loading ? <><span className="spinner" /> Inaingia...</> : '🔐 Ingia'}
          </button>
        </form>

        <p className="text-center text-muted mt-2">
          Huna akaunti?{' '}
          <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate('/')}>
            Jisajili hapa
          </span>
        </p>
      </div>
    </div>
  );
}
