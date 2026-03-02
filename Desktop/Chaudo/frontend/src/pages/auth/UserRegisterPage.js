import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';

export default function UserRegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '', password: '', confirm_password: '',
    full_name: '', location: '', phone_number: '', gender: '', email: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm_password) {
      setError('Neno siri hazifanani.'); return;
    }
    setLoading(true);
    try {
      const { confirm_password, ...payload } = form;
      await authAPI.registerUser(payload);
      navigate('/login', { state: { message: 'Umesajiliwa! Sasa unaweza kuingia.' } });
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const msgs = Object.values(data).flat().join(' ');
        setError(msgs);
      } else {
        setError('Hitilafu imetokea. Jaribu tena.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div style={{ cursor: 'pointer', color: 'var(--primary)', marginBottom: '1rem', fontWeight: 600 }}
          onClick={() => navigate('/')}>
          ← Rudi
        </div>
        <div className="text-center mb-2">
          <div style={{ fontSize: '2.5rem' }}>🛍️</div>
          <h2 className="auth-title">Jisajili kama Mteja</h2>
          <p className="auth-subtitle">Jaza taarifa zako zote</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Jina la Kuingia (Username) *</label>
            <input name="username" value={form.username} onChange={handleChange} className="form-input" placeholder="username" required />
          </div>
          <div className="form-group">
            <label className="form-label">Jina Kamili *</label>
            <input name="full_name" value={form.full_name} onChange={handleChange} className="form-input" placeholder="Jina Kamili" required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Mahali Unapoishi *</label>
              <input name="location" value={form.location} onChange={handleChange} className="form-input" placeholder="Mji/Mtaa" required />
            </div>
            <div className="form-group">
              <label className="form-label">Namba ya Simu *</label>
              <input name="phone_number" value={form.phone_number} onChange={handleChange} className="form-input" placeholder="+255..." required />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Jinsia *</label>
              <select name="gender" value={form.gender} onChange={handleChange} className="form-select" required>
                <option value="">Chagua...</option>
                <option value="male">Mwanaume</option>
                <option value="female">Mwanamke</option>
                <option value="other">Nyingine</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Barua Pepe</label>
              <input name="email" value={form.email} onChange={handleChange} className="form-input" type="email" placeholder="email@mfano.com" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Neno Siri *</label>
              <input name="password" value={form.password} onChange={handleChange} className="form-input" type="password" placeholder="Neno siri" required />
            </div>
            <div className="form-group">
              <label className="form-label">Rudia Neno Siri *</label>
              <input name="confirm_password" value={form.confirm_password} onChange={handleChange} className="form-input" type="password" placeholder="Rudia" required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? <><span className="spinner" />  Inasajili...</> : '✅ Jisajili'}
          </button>
        </form>

        <p className="text-center text-muted mt-2">
          Una akaunti?{' '}
          <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate('/login')}>
            Ingia
          </span>
        </p>
      </div>
    </div>
  );
}
