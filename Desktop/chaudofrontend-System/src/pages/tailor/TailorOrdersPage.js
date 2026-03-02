import React, { useEffect, useState } from 'react';
import { orderAPI } from '../../services/api';

const FILTERS = [
  { value: '', label: 'Yote' },
  { value: 'pending', label: '⏳ Zinazosubiri' },
  { value: 'accepted', label: '✅ Zilizokubaliwa' },
  { value: 'rejected', label: '❌ Zilizokataliwa' },
  { value: 'completed', label: '🎉 Zilizokamilika' },
];

export default function TailorOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [actionModal, setActionModal] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const load = () => {
    orderAPI.getTailorOrders().then(r => setOrders(r.data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = filter ? orders.filter(o => o.status === filter) : orders;

  const handleAction = async (orderId, action) => {
    setProcessing(true);
    try {
      await orderAPI.orderAction(orderId, {
        status: action,
        ...(action === 'rejected' && rejectionReason ? { rejection_reason: rejectionReason } : {}),
      });
      setActionModal(null);
      setRejectionReason('');
      load();
    } catch (err) {
      alert('Hitilafu imetokea. Jaribu tena.');
    } finally {
      setProcessing(false);
    }
  };

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
        <h1 className="page-title">📋 Maagizo Ya Wateja</h1>
        <p className="page-subtitle">Simamia na jibu maagizo ya wateja wako</p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {FILTERS.map(f => (
          <button key={f.value} className={`btn btn-sm ${filter === f.value ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter(f.value)}>
            {f.label}
            {f.value === 'pending' && orders.filter(o => o.status === 'pending').length > 0 && (
              <span className="nav-badge" style={{ marginLeft: '0.4rem', background: '#EF4444' }}>
                {orders.filter(o => o.status === 'pending').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
          <p>Hakuna maagizo {filter ? 'ya aina hii' : ''} kwa sasa.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(order => {
            const imgSrc = order.order_type === 'custom'
              ? getImageUrl(order.custom_design_image)
              : getImageUrl(order.design_detail?.image);

            return (
              <div key={order.id} className="card">
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  {imgSrc && (
                    <img src={imgSrc} alt="Order" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '10px', flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <div>
                        <h3 style={{ fontWeight: 700 }}>
                          {order.order_type === 'custom' ? '✏️ Agizo Maalum' : order.design_detail?.title || 'Muundo'}
                        </h3>
                        <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                          Kutoka kwa: <strong>{order.user_full_name}</strong>
                        </p>
                      </div>
                      <span className={`status-badge status-${order.status}`}>
                        {order.status === 'pending' ? '⏳ Inasubiri' :
                         order.status === 'accepted' ? '✅ Imekubaliwa' :
                         order.status === 'rejected' ? '❌ Imekataliwa' : '🎉 Imekamilika'}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <div><span className="text-muted">Idadi: </span><strong>{order.quantity}</strong></div>
                      <div><span className="text-muted">Aina: </span><strong>{order.order_type === 'custom' ? 'Maalum' : 'Kawaida'}</strong></div>
                      <div><span className="text-muted">Tarehe: </span><strong>{new Date(order.created_at).toLocaleDateString('sw-TZ')}</strong></div>
                    </div>

                    {(order.notes || order.custom_description) && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem', background: '#F9FAFB', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                        📝 {order.notes || order.custom_description}
                      </p>
                    )}

                    {order.status === 'rejected' && order.rejection_reason && (
                      <div className="alert alert-error" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}>
                        Sababu: {order.rejection_reason}
                      </div>
                    )}

                    {order.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <button className="btn btn-success btn-sm" onClick={() => handleAction(order.id, 'accepted')} disabled={processing}>
                          ✅ Kubali
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => { setActionModal(order); setRejectionReason(''); }} disabled={processing}>
                          ❌ Kataa
                        </button>
                      </div>
                    )}

                    {order.status === 'accepted' && (
                      <button className="btn btn-sm" style={{ background: '#1D4ED8', color: '#fff' }}
                        onClick={() => handleAction(order.id, 'completed')} disabled={processing}>
                        🎉 Maliza Agizo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Modal */}
      {actionModal && (
        <div className="modal-overlay" onClick={() => setActionModal(null)}>
          <div className="modal" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">❌ Kataa Agizo</h3>
              <button className="modal-close" onClick={() => setActionModal(null)}>×</button>
            </div>
            <p className="text-muted" style={{ marginBottom: '1rem' }}>
              Eleza sababu ya kukataa agizo hili (hiari — mteja ataona).
            </p>
            <div className="form-group">
              <label className="form-label">Sababu ya Kukataa</label>
              <textarea value={rejectionReason} onChange={e => setRejectionReason(e.target.value)}
                className="form-input" rows={3} placeholder="Mfano: Siwezi kushona aina hii kwa wakati huu..."
                style={{ resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setActionModal(null)}>Ghairi</button>
              <button className="btn btn-danger" style={{ flex: 1 }} disabled={processing}
                onClick={() => handleAction(actionModal.id, 'rejected')}>
                {processing ? <><span className="spinner" /> ...</> : '❌ Kataa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
