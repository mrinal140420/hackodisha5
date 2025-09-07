import StatusBadge from './StatusBadge.jsx';

export default function ReportCard({ report }) {
  return (
    <div className="card">
      <img src={report.imageUrl} alt="issue" style={{ width: '100%', borderRadius: 8 }} />
      <h3>{report.category}</h3>
      <p>{report.description}</p>
      <p><strong>Citizen:</strong> {report.citizen?.name}</p>
      <StatusBadge status={report.status} />
    </div>
  );
}
