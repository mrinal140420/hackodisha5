import { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import ReportCard from '../../components/ReportCard.jsx';
import StatusSelect from '../../components/StatusSelect.jsx';

/**
 * Dashboard - lists reports and provides minimal authority controls:
 * - view all reports
 * - update status (authority only)
 * - assignTo (optional text input)
 */
export default function Dashboard({ refreshSignal }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [changing, setChanging] = useState({}); // id => bool

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/reports');
      setReports(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [refreshSignal]);

  const updateStatus = async (id, status) => {
    try {
      setChanging(prev => ({ ...prev, [id]: true }));
      await api.patch(`/reports/${id}/status`, { status });
      await fetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setChanging(prev => ({ ...prev, [id]: false }));
    }
  };

  const assign = async (id, assignedTo) => {
    try {
      setChanging(prev => ({ ...prev, [id]: true }));
      await api.patch(`/reports/${id}/status`, { assignedTo });
      await fetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Assign failed');
    } finally {
      setChanging(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div>
      <h2>Reports Dashboard</h2>
      {loading ? <p>Loading...</p> : null}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {reports.map(r => (
          <div key={r._id} className="card">
            <img src={r.imageUrl} alt="" style={{ width: '100%', borderRadius: 8 }} />
            <h3>{r.category}</h3>
            <p>{r.description}</p>
            <p><strong>By:</strong> {r.citizen?.name || 'Unknown'} <br /><strong>At:</strong> {new Date(r.createdAt).toLocaleString()}</p>

            <div style={{ marginTop: 8 }}>
              <label style={{ display: 'block', marginBottom: 6 }}>Status</label>
              <StatusSelect value={r.status} onChange={(s) => updateStatus(r._id, s)} />
            </div>

            <div style={{ marginTop: 8 }}>
              <label style={{ display: 'block', marginBottom: 6 }}>Assign to (user id)</label>
              <input placeholder="authority user id (optional)" defaultValue={r.assignedTo || ''} onBlur={(e) => assign(r._id, e.target.value || null)} />
              <small style={{ display: 'block', marginTop: 6, color: '#6b7280' }}>{changing[r._id] ? 'Saving...' : ''}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
