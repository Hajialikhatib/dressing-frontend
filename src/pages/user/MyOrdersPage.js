import React, { useEffect, useState } from 'react';
import { orderAPI } from '../../services/api';

const STATUS_LABELS = {
  pending: { label: 'Inasubiri', cls: 'status-pending', icon: '⏳' },
  accepted: { label: 'Imekubaliwa', cls: 'status-accepted', icon: '✅' },
  rejected: { label: 'Imekataliwa', cls: 'status-rejected', icon: '❌' },
  completed: { label: 'Imekamilika', cls: 'status-completed', icon: '🎉' },
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getMyOrders()
      .then(r => setOrders(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://localhost:8000${path}`;
  };

  if (loading) return (
    <div className="flex-center" style={{ minHeight: '60vh' }}>
      <div className="spinner spinner-dark" style={{ width: '3rem', height: '3rem' }} />
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div className="page-header">
        <h1 className="page-title">📦 Maagizo Yangu</h1>
        <p className="page-subtitle">Angalia hali ya maagizo yako yote</p>
      </div>

      {orders.length === 0 ? (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📭</div>
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Hujafanya agizo bado</h3>
          <p className="text-muted">Nenda kwenye ukurasa wa nyumbani na uchague muundo unaokupendeza!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map(order => {
            const st = STATUS_LABELS[order.status] || STATUS_LABELS.pending;
            const imgSrc = order.order_type === 'custom'
              ? getImageUrl(order.custom_design_image)
              : getImageUrl(order.design_detail?.image);
            return (
              <div key={order.id} className="card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {imgSrc && (
                  <img src={imgSrc} alt="Design" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: '10px', flexShrink: 0 }} />
                )}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>
                      {order.order_type === 'custom'
                        ? '✏️ Muundo Maalum'
                        : order.design_detail?.title || 'Muundo'
                      }
                    </h3>
                    <span className={`status-badge ${st.cls}`}>{st.icon} {st.label}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <div>
                      <span className="text-muted">Tailor: </span>
                      <strong>{order.tailor_full_name}</strong>
                    </div>
                    <div>
                      <span className="text-muted">Idadi: </span>
                      <strong>{order.quantity}</strong>
                    </div>
                    <div>
                      <span className="text-muted">Aina: </span>
                      <strong>{order.order_type === 'custom' ? 'Maalum' : 'Kutoka kwa Mitindo'}</strong>
                    </div>
                    <div>
                      <span className="text-muted">Tarehe: </span>
                      <strong>{new Date(order.created_at).toLocaleDateString('sw-TZ')}</strong>
                    </div>
                  </div>

                  {order.notes && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      📝 {order.notes}
                    </p>
                  )}
                  {order.custom_description && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      📝 {order.custom_description}
                    </p>
                  )}
                  {order.status === 'rejected' && order.rejection_reason && (
                    <div className="alert alert-error" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}>
                      ❌ Sababu ya kukataa: {order.rejection_reason}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
