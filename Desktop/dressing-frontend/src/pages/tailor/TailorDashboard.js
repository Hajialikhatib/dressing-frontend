import React, { useEffect, useState } from 'react';
import { orderAPI, designAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function TailorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const profile = user?.tailor_profile;

  useEffect(() => {
    Promise.all([
      orderAPI.getTailorOrders(),
      designAPI.getMyDesigns(),
    ]).then(([oRes, dRes]) => {
      setOrders(oRes.data);
      setDesigns(dRes.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    accepted: orders.filter(o => o.status === 'accepted').length,
    designs: designs.length,
  };

  if (loading) return (
    <div className="flex-center" style={{ minHeight: '60vh' }}>
      <div className="spinner spinner-dark" style={{ width: '3rem', height: '3rem' }} />
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      {/* Welcome */}
      <div style={{
        background: 'linear-gradient(135deg, #6B2A6E 0%, #BE185D 100%)',
        borderRadius: 'var(--radius-lg)', padding: '2rem', color: '#fff', marginBottom: '2rem',
      }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
          Habari, {profile?.full_name?.split(' ')[0] || user?.username}! 🪡
        </h1>
        <p style={{ opacity: 0.9, marginTop: '0.35rem' }}>
          {profile?.location && `📍 ${profile.location} · `}
          {profile?.clothing_type === 'male' ? '👔 Za Kiume' : profile?.clothing_type === 'female' ? '👗 Za Kike' : '👔👗 Za Kike & Kiume'}
        </p>
        {profile?.bio && <p style={{ opacity: 0.75, fontSize: '0.9rem', marginTop: '0.5rem' }}>{profile.bio}</p>}
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Maagizo Yote</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#F97316' }}>{stats.pending}</div>
          <div className="stat-label">Yanayosubiri</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#22C55E' }}>{stats.accepted}</div>
          <div className="stat-label">Yaliyokubaliwa</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#8B3A8E' }}>{stats.designs}</div>
          <div className="stat-label">Mitindo Yangu</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <button className="btn btn-primary" onClick={() => navigate('/tailor/designs')}>
          ➕ Ongeza Muundo Mpya
        </button>
        <button className="btn btn-outline" onClick={() => navigate('/tailor/orders')}>
          📋 Angalia Maagizo ({stats.pending} Mapya)
        </button>
      </div>

      {/* Recent orders */}
      {orders.length > 0 && (
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>📩 Maagizo Mapya Zaidi</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {orders.slice(0, 5).map(order => (
              <div key={order.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.75rem', background: '#FAF5FF', borderRadius: '10px', flexWrap: 'wrap', gap: '0.5rem'
              }}>
                <div>
                  <strong>{order.user_full_name}</strong>
                  <span className="text-muted" style={{ marginLeft: '0.5rem', fontSize: '0.85rem' }}>
                    → {order.order_type === 'custom' ? '✏️ Maalum' : order.design_detail?.title || 'Muundo'}
                  </span>
                </div>
                <span className={`status-badge status-${order.status}`}>
                  {order.status === 'pending' ? '⏳ Inasubiri' : order.status === 'accepted' ? '✅ Imekubaliwa' : order.status === 'rejected' ? '❌ Imekataliwa' : '🎉 Imekamilika'}
                </span>
              </div>
            ))}
          </div>
          {orders.length > 5 && (
            <button className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }} onClick={() => navigate('/tailor/orders')}>
              Angalia Zote ({orders.length})
            </button>
          )}
        </div>
      )}
    </div>
  );
}
