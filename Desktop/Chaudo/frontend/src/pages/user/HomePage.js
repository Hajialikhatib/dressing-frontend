import React, { useEffect, useState } from 'react';
import { designAPI, authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import OrderModal from '../../components/OrderModal';
import CustomOrderModal from '../../components/CustomOrderModal';

const CLOTHING_TYPES = [
  { value: '', label: 'Aina Zote' },
  { value: 'male', label: 'Za Kiume' },
  { value: 'female', label: 'Za Kike' },
  { value: 'both', label: 'Za Wote' },
  { value: 'kids', label: 'Za Watoto' },
];

export default function HomePage() {
  const { user } = useAuth();
  const [designs, setDesigns] = useState([]);
  const [tailors, setTailors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [selectedTailorForCustom, setSelectedTailorForCustom] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dRes, tRes] = await Promise.all([
          designAPI.getAll(filter ? { clothing_type: filter } : {}),
          authAPI.getApprovedTailors(),
        ]);
        setDesigns(dRes.data);
        setTailors(tRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filter]);

  const getFirstName = () => {
    const name = user?.user_profile?.full_name || user?.username;
    return name?.split(' ')[0];
  };

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/400x300?text=Design';
    if (path.startsWith('http')) return path;
    return `http://localhost:8000${path}`;
  };

  const badgeClass = { male: 'badge-male', female: 'badge-female', both: 'badge-both', kids: 'badge-kids' };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
        borderRadius: 'var(--radius-lg)', padding: '2.5rem', color: '#fff', marginBottom: '2rem',
        boxShadow: '0 8px 32px rgba(139,58,142,0.3)'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Karibu, {getFirstName()}! 👋</h1>
        <p style={{ opacity: 0.9, marginTop: '0.5rem', fontSize: '1.05rem' }}>
          Gundua mitindo bora kutoka kwa matailor wetu. Chagua na uagize nguo yako ya ndoto!
        </p>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '0.75rem 1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{designs.length}</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Mitindo</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '0.75rem 1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{tailors.length}</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Matailor</div>
          </div>
        </div>
      </div>

      {/* Custom Order Section */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem' }}>
          ✏️ Una Muundo Wako Mwenyewe?
        </h3>
        <p className="text-muted" style={{ marginBottom: '1rem' }}>
          Tuma picha au maelezo ya muundo wako mwenyewe kwa tailor unayemchagua.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {tailors.map(t => (
            <button key={t.id} className="btn btn-outline btn-sm" onClick={() => {
              setSelectedTailorForCustom(t);
              setShowCustomModal(true);
            }}>
              🪡 {t.tailor_profile?.full_name || t.username}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>👗 Mitindo Yote</h2>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {CLOTHING_TYPES.map(ct => (
            <button
              key={ct.value}
              className={`btn btn-sm ${filter === ct.value ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter(ct.value)}
            >
              {ct.label}
            </button>
          ))}
        </div>
      </div>

      {/* Designs Grid */}
      {loading ? (
        <div className="flex-center" style={{ padding: '4rem' }}>
          <div className="spinner spinner-dark" style={{ width: '3rem', height: '3rem' }} />
        </div>
      ) : designs.length === 0 ? (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😔</div>
          <p>Hakuna mitindo inayopatikana kwa sasa.</p>
        </div>
      ) : (
        <div className="design-grid">
          {designs.map(design => (
            <div key={design.id} className="design-card" onClick={() => setSelectedDesign(design)}>
              <img src={getImageUrl(design.image)} alt={design.title} />
              <div className="design-card-body">
                <span className={`design-type-badge ${badgeClass[design.clothing_type] || 'badge-both'}`}>
                  {design.clothing_type === 'male' ? '👔 Za Kiume' :
                   design.clothing_type === 'female' ? '👗 Za Kike' :
                   design.clothing_type === 'kids' ? '🧒 Za Watoto' : '👔👗 Za Wote'}
                </span>
                <div className="design-title">{design.title}</div>
                <div className="design-tailor">✂️ {design.tailor_name} · 📍 {design.tailor_location}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  <span className="design-price">TZS {parseInt(design.price).toLocaleString()}</span>
                  <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); setSelectedDesign(design); }}>
                    Agiza
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Modal */}
      {selectedDesign && (
        <OrderModal
          design={selectedDesign}
          onClose={() => setSelectedDesign(null)}
        />
      )}

      {/* Custom Order Modal */}
      {showCustomModal && selectedTailorForCustom && (
        <CustomOrderModal
          tailor={selectedTailorForCustom}
          onClose={() => { setShowCustomModal(false); setSelectedTailorForCustom(null); }}
        />
      )}
    </div>
  );
}
