export default function StatusSelect({ value, onChange }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}>
      <option value="New">New</option>
      <option value="In Progress">In Progress</option>
      <option value="Resolved">Resolved</option>
    </select>
  );
}
