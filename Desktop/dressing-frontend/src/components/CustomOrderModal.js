import React, { useState } from 'react';
import { orderAPI } from '../services/api';

export default function CustomOrderModal({ tailor, onClose }) {
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) { setError('Tafadhali eleza muundo unaotaka.'); return; }
    setLoading(true); setError('');
    try {
      await orderAPI.placeOrder({
        tailor: tailor.id,
        order_type: 'custom',
        quantity,
        custom_description: description,
        custom_design_image: image || undefined,
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
            <h3 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--success)' }}>Agizo Maalum Limetumwa!</h3>
            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
              Agizo lako maalum kwa <strong>{tailor.tailor_profile?.full_name || tailor.username}</strong> limetumwa. Subiri uthibitisho.
            </p>
            <button className="btn btn-primary" onClick={onClose}>Sawa, Asante!</button>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <h2 className="modal-title">✏️ Agizo Maalum</h2>
              <button className="modal-close" onClick={onClose}>×</button>
            </div>

            <div style={{ background: '#FAF5FF', borderRadius: '10px', padding: '0.75rem', marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.9rem' }}>
                Unatuma agizo maalum kwa: <strong>🪡 {tailor.tailor_profile?.full_name || tailor.username}</strong>
              </p>
              {tailor.tailor_profile?.location && (
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  📍 {tailor.tailor_profile.location}
                </p>
              )}
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label className="form-label">Maelezo ya Muundo Wako *</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)}
                className="form-input" rows={4}
                placeholder="Eleza kwa undani: rangi unayotaka, urefu, mtindo, vipimo, n.k."
                style={{ resize: 'vertical' }} />
            </div>

            <div className="form-group">
              <label className="form-label">Picha ya Muundo (Hiari)</label>
              <input type="file" accept="image/*" onChange={handleImageChange} className="form-input" style={{ padding: '0.5rem' }} />
              {preview && (
                <img src={preview} alt="Preview" style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: '10px', marginTop: '0.75rem' }} />
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Idadi ya Nguo</label>
              <input type="number" min={1} max={100} value={quantity}
                onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                className="form-input" />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-outline" onClick={onClose} style={{ flex: 1 }}>Ghairi</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{ flex: 2 }}>
                {loading ? <><span className="spinner" /> Inatuma...</> : '📤 Tuma Agizo Maalum'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
