import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [tailors, setTailors] = useState([]);
  const [tab, setTab] = useState('tailors');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [uRes, tRes] = await Promise.all([adminAPI.getUsers(), adminAPI.getTailors()]);
      setUsers(uRes.data);
      setTailors(tRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleTailorAction = async (tailorId, action) => {
    setProcessing(`${tailorId}-${action}`);
    try {
      await adminAPI.tailorAction(tailorId, action);
      load();
    } catch { alert('Hitilafu imetokea.'); }
    finally { setProcessing(null); }
  };

  const handleDelete = async (userId) => {
    try {
      await adminAPI.deleteUser(userId);
      setDeleteConfirm(null);
      load();
    } catch { alert('Imeshindwa kufuta.'); }
  };

  const stats = {
    users: users.length,
    tailors: tailors.length,
    pendingTailors: tailors.filter(t => t.tailor_profile?.approval_status === 'pending').length,
    approvedTailors: tailors.filter(t => t.tailor_profile?.approval_status === 'approved').length,
  };

  if (loading) return (
    <div className="flex-center" style={{ minHeight: '60vh' }}>
      <div className="spinner spinner-dark" style={{ width: '3rem', height: '3rem' }} />
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1F1F2E 0%, #374151 100%)',
        borderRadius: 'var(--radius-lg)', padding: '2rem', color: '#fff', marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>⚙️ Admin Dashboard</h1>
        <p style={{ opacity: 0.8, marginTop: '0.4rem' }}>Simamia watumiaji na matailor wa mfumo</p>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-value">{stats.users}</div>
          <div className="stat-label">Wateja (Users)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#F97316' }}>{stats.pendingTailors}</div>
          <div className="stat-label">Tailors Wanasubiri</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#22C55E' }}>{stats.approvedTailors}</div>
          <div className="stat-label">Tailors Waliothibitishwa</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.tailors}</div>
          <div className="stat-label">Tailors Wote</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button className={`btn ${tab === 'tailors' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('tailors')}>
          🪡 Matailor
          {stats.pendingTailors > 0 && (
            <span className="nav-badge" style={{ background: '#EF4444', marginLeft: '0.5rem' }}>{stats.pendingTailors}</span>
          )}
        </button>
        <button className={`btn ${tab === 'users' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('users')}>
          👤 Wateja ({stats.users})
        </button>
      </div>

      {/* ─── Tailors Tab ────────────────────────────────────────── */}
      {tab === 'tailors' && (
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Orodha ya Matailor</h3>
          {tailors.length === 0 ? (
            <p className="text-muted text-center" style={{ padding: '2rem' }}>Hakuna matailor waliojisajili bado.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Jina Kamili</th>
                    <th>Username</th>
                    <th>Simu</th>
                    <th>Mahali</th>
                    <th>Aina ya Nguo</th>
                    <th>Hali</th>
                    <th>Vitendo</th>
                  </tr>
                </thead>
                <tbody>
                  {tailors.map(tailor => {
                    const profile = tailor.tailor_profile;
                    const status = profile?.approval_status;
                    return (
                      <tr key={tailor.id}>
                        <td><strong>{profile?.full_name || '—'}</strong></td>
                        <td>{tailor.username}</td>
                        <td>{profile?.phone_number || '—'}</td>
                        <td>{profile?.location || '—'}</td>
                        <td>
                          {profile?.clothing_type === 'male' ? '👔 Kiume' :
                           profile?.clothing_type === 'female' ? '👗 Kike' :
                           profile?.clothing_type === 'both' ? '👔👗 Wote' : '—'}
                        </td>
                        <td>
                          <span className={`status-badge ${status === 'approved' ? 'status-accepted' : status === 'rejected' ? 'status-rejected' : 'status-pending'}`}>
                            {status === 'approved' ? '✅ Ameidhinishwa' : status === 'rejected' ? '❌ Amekataliwa' : '⏳ Anasubiri'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {status !== 'approved' && (
                              <button className="btn btn-success btn-sm"
                                disabled={processing === `${tailor.id}-approve`}
                                onClick={() => handleTailorAction(tailor.id, 'approve')}>
                                {processing === `${tailor.id}-approve` ? '...' : '✅ Thibitisha'}
                              </button>
                            )}
                            {status !== 'rejected' && (
                              <button className="btn btn-danger btn-sm"
                                disabled={processing === `${tailor.id}-reject`}
                                onClick={() => handleTailorAction(tailor.id, 'reject')}>
                                {processing === `${tailor.id}-reject` ? '...' : '❌ Kataa'}
                              </button>
                            )}
                            <button className="btn btn-sm" style={{ background: '#6B7280', color: '#fff' }}
                              onClick={() => setDeleteConfirm(tailor)}>
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ─── Users Tab ──────────────────────────────────────────── */}
      {tab === 'users' && (
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Orodha ya Wateja</h3>
          {users.length === 0 ? (
            <p className="text-muted text-center" style={{ padding: '2rem' }}>Hakuna wateja waliojisajili bado.</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Jina Kamili</th>
                    <th>Username</th>
                    <th>Barua Pepe</th>
                    <th>Simu</th>
                    <th>Mahali</th>
                    <th>Jinsia</th>
                    <th>Vitendo</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => {
                    const profile = user.user_profile;
                    return (
                      <tr key={user.id}>
                        <td><strong>{profile?.full_name || '—'}</strong></td>
                        <td>{user.username}</td>
                        <td>{profile?.email || user.email || '—'}</td>
                        <td>{profile?.phone_number || '—'}</td>
                        <td>{profile?.location || '—'}</td>
                        <td>
                          {profile?.gender === 'male' ? '👨 Mwanaume' :
                           profile?.gender === 'female' ? '👩 Mwanamke' : profile?.gender || '—'}
                        </td>
                        <td>
                          <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm(user)}>
                            🗑️ Futa
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div className="text-center" style={{ padding: '1rem 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
              <h3 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Futa Mtumiaji?</h3>
              <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
                Je, una uhakika wa kufuta mtumiaji{' '}
                <strong>
                  {deleteConfirm.user_profile?.full_name || deleteConfirm.tailor_profile?.full_name || deleteConfirm.username}
                </strong>?
                <br />
                <span style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>
                  Taarifa zake zote zitafutwa kabisa.
                </span>
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
