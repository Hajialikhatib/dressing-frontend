import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function RoleSelectPage() {
  const navigate = useNavigate();

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: 560 }}>
        <div className="text-center mb-2">
          <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>✂️</div>
          <h1 className="auth-title" style={{ fontSize: '2rem' }}>Dressing & Design</h1>
          <p className="auth-subtitle" style={{ fontSize: '1rem' }}>
            Karibu! Chagua aina yako ya akaunti kuendelea.
          </p>
        </div>

        <div className="role-selector">
          <div className="role-card" onClick={() => navigate('/register/user')}>
            <div className="role-icon">🛍️</div>
            <div className="role-name">Mteja (User)</div>
            <div className="role-desc">Tafuta na omba mitindo ya nguo</div>
          </div>
          <div className="role-card" onClick={() => navigate('/register/tailor')}>
            <div className="role-icon">🪡</div>
            <div className="role-name">Tailor</div>
            <div className="role-desc">Weka mitindo na pokea maagizo</div>
          </div>
        </div>

        <p className="text-center text-muted">
          Una akaunti tayari?{' '}
          <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => navigate('/login')}>
            Ingia hapa
          </span>
        </p>
      </div>
    </div>
  );
}
