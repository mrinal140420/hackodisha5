import { useEffect, useState } from 'react';
import ReportForm from '../features/reports/ReportForm.jsx';
import MapView from '../features/reports/MapView.jsx';
import api from '../api/axios.js';
import ReportCard from '../components/ReportCard.jsx';

export default function CitizenHome() {
  const [reports, setReports] = useState([]);
  const [pickedLocation, setPickedLocation] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const fetch = async () => {
    try {
      const { data } = await api.get('/reports');
      setReports(data);
    } catch (err) {
      // silently ignore if not logged in; still show map
      console.error(err);
    }
  };

  useEffect(() => { fetch(); }, [refresh]);

  return (
    <>
      <div className="grid grid-2" style={{ alignItems: 'start', gap: 16 }}>
        <div>
          <ReportForm onCreated={() => setRefresh(r => r + 1)} defaultLocation={pickedLocation} />
          <h3 style={{ marginTop: 8 }}>All Reports</h3>
          <div className="grid" style={{ gap: 12 }}>
            {reports.length ? reports.map(r => <ReportCard key={r._id} report={r} />) : <div className="card"><p>No reports yet.</p></div>}
          </div>
        </div>

        <div>
          <MapView
            reports={reports}
            showExisting={true}
            onPick={(coords) => setPickedLocation(coords)}
            center={[21.1458, 79.0882]}
            zoom={13}
          />
        </div>
      </div>
    </>
  );
}
