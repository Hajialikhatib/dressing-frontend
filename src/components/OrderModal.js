import React, { useState } from 'react';
import { orderAPI } from '../services/api';

export default function OrderModal({ design, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/400x300?text=Design';
    if (path.startsWith('http')) return path;
    return `http://localhost:8000${path}`;
  };

  const handleOrder = async () => {
    setLoading(true); setError('');
    try {
      await orderAPI.placeOrder({
        tailor: design.tailor,
        design: design.id,
        order_type: 'design',
        quantity,
        notes,
      });
      setSuccess(true);
    } catch (err) {
      const data = err.response?.data;
      setError(data ? Object.values(data).flat().join(' ') : 'Hitilafu imetokea.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {success ? (
          <div className="text-center" style={{ padding: '2rem 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
            <h3 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--success)' }}>Agizo Limetumwa!</h3>
            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
              Agizo lako kwa <strong>{design.title}</strong> limetumwa kwa tailor. Subiri uthibitisho.
            </p>
            <button className="btn btn-primary" onClick={onClose}>Sawa, Asante!</button>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <h2 className="modal-title">🛒 Agiza Muundo Huu</h2>
              <button className="modal-close" onClick={onClose}>×</button>
            </div>

            <img src={getImageUrl(design.image)} alt={design.title}
              style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: '12px', marginBottom: '1.25rem' }} />

            <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#FAF5FF', borderRadius: '10px' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{design.title}</h3>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>{design.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <span className="text-muted">Tailor: <strong>{design.tailor_name}</strong></span>
                <span style={{ fontWeight: 800, color: 'var(--primary)' }}>
                  TZS {parseInt(design.price).toLocaleString()}
                </span>
              </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label className="form-label">Idadi ya Nguo</label>
              <input type="number" min={1} max={100} value={quantity}
                onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Maelezo / Maombi Maalum</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)}
                className="form-input" rows={3} placeholder="Rangi unayotaka, vipimo, n.k." style={{ resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-outline" onClick={onClose} style={{ flex: 1 }}>Ghairi</button>
              <button className="btn btn-primary" onClick={handleOrder} disabled={loading} style={{ flex: 2 }}>
                {loading ? <><span className="spinner" /> Inatuma...</> : '📤 Tuma Agizo'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
