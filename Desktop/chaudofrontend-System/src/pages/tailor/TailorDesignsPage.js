import React, { useEffect, useState } from 'react';
import { designAPI } from '../../services/api';

const CLOTHING_TYPES = [
  { value: 'male', label: 'Za Kiume' },
  { value: 'female', label: 'Za Kike' },
  { value: 'both', label: 'Za Kike & Kiume' },
  { value: 'kids', label: 'Za Watoto' },
];

const emptyForm = { title: '', description: '', clothing_type: '', price: '', is_available: true, image: null };

export default function TailorDesignsPage() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const load = () => {
    designAPI.getMyDesigns().then(r => setDesigns(r.data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setForm(p => ({ ...p, image: file }));
      setImagePreview(file ? URL.createObjectURL(file) : null);
    } else if (type === 'checkbox') {
      setForm(p => ({ ...p, [name]: checked }));
    } else {
      setForm(p => ({ ...p, [name]: value }));
    }
  };

  const openAdd = () => { setForm(emptyForm); setImagePreview(null); setEditId(null); setShowForm(true); setError(''); };
  const openEdit = (d) => {
    setForm({ title: d.title, description: d.description, clothing_type: d.clothing_type, price: d.price, is_available: d.is_available, image: null });
    setImagePreview(d.image ? (d.image.startsWith('http') ? d.image : `http://localhost:8000${d.image}`) : null);
    setEditId(d.id); setShowForm(true); setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault(); setError(''); setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== null && v !== undefined) fd.append(k, v); });
      if (editId) await designAPI.update(editId, fd);
      else await designAPI.create(fd);
      setShowForm(false); load();
    } catch (err) {
      const data = err.response?.data;
      setError(data ? Object.values(data).flat().join(' ') : 'Hitilafu imetokea.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try { await designAPI.delete(id); setDeleteConfirm(null); load(); }
    catch { alert('Imeshindwa kufuta.'); }
  };

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/400x300?text=Design';
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">👗 Mitindo Yangu</h1>
          <p className="page-subtitle">Simamia mitindo yako ya nguo</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>➕ Ongeza Muundo</button>
      </div>

      {designs.length === 0 ? (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>👗</div>
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Hujaweka mitindo bado</h3>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>Anza kuongeza mitindo yako ili wateja waweze kukuona.</p>
          <button className="btn btn-primary" onClick={openAdd}>➕ Ongeza Muundo wa Kwanza</button>
        </div>
      ) : (
        <div className="design-grid">
          {designs.map(d => (
            <div key={d.id} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow)', border: '1px solid var(--border)', background: '#fff' }}>
              <div style={{ position: 'relative' }}>
                <img src={getImageUrl(d.image)} alt={d.title} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                {!d.is_available && (
                  <div style={{
                    position: 'absolute', top: '0.5rem', right: '0.5rem',
                    background: 'rgba(0,0,0,0.6)', color: '#fff',
                    padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem'
                  }}>Imefichwa</div>
                )}
              </div>
              <div style={{ padding: '1rem' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{d.title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.5rem', lineHeight: 1.4 }}>{d.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontWeight: 800, color: 'var(--primary)' }}>TZS {parseInt(d.price).toLocaleString()}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {d.clothing_type === 'male' ? '👔 Kiume' : d.clothing_type === 'female' ? '👗 Kike' : d.clothing_type === 'kids' ? '🧒 Watoto' : '👔👗 Wote'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => openEdit(d)}>✏️ Hariri</button>
                  <button className="btn btn-danger btn-sm" style={{ flex: 1 }} onClick={() => setDeleteConfirm(d)}>🗑️ Futa</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
            <div className="modal-header">
              <h2 className="modal-title">{editId ? '✏️ Hariri Muundo' : '➕ Ongeza Muundo Mpya'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Jina la Muundo *</label>
                <input name="title" value={form.title} onChange={handleChange} className="form-input" placeholder="Jina la muundo" required />
              </div>
              <div className="form-group">
                <label className="form-label">Maelezo *</label>
                <textarea name="description" value={form.description} onChange={handleChange} className="form-input" rows={3} style={{ resize: 'vertical' }} placeholder="Eleza muundo..." required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Aina ya Nguo *</label>
                  <select name="clothing_type" value={form.clothing_type} onChange={handleChange} className="form-select" required>
                    <option value="">Chagua...</option>
                    {CLOTHING_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Bei (TZS) *</label>
                  <input name="price" value={form.price} onChange={handleChange} className="form-input" type="number" min={0} placeholder="Bei" required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Picha ya Muundo {!editId && '*'}</label>
                <input type="file" name="image" accept="image/*" onChange={handleChange} className="form-input" style={{ padding: '0.5rem' }} {...(!editId && { required: true })} />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: '10px', marginTop: '0.75rem' }} />
                )}
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input type="checkbox" name="is_available" checked={form.is_available} onChange={handleChange} id="is_available" style={{ width: 18, height: 18, cursor: 'pointer' }} />
                <label htmlFor="is_available" style={{ cursor: 'pointer', fontWeight: 600 }}>Inaonekana kwa wateja</label>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowForm(false)}>Ghairi</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={saving}>
                  {saving ? <><span className="spinner" /> Inasavisha...</> : editId ? '💾 Hifadhi Mabadiliko' : '✅ Ongeza Muundo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div className="text-center" style={{ padding: '1rem 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
              <h3 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Futa Muundo?</h3>
              <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
                Je, una uhakika wa kufuta "<strong>{deleteConfirm.title}</strong>"? Kitendo hiki hakiwezi kubatilishwa.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setDeleteConfirm(null)}>Ghairi</button>
                <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => handleDelete(deleteConfirm.id)}>🗑️ Futa</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
