export default function StatusBadge({ status }) {
  const map = {
    'New': 'badge new',
    'In Progress': 'badge progress',
    'Resolved': 'badge resolved'
  };
  return <span className={map[status] || 'badge'}>{status}</span>;
}
