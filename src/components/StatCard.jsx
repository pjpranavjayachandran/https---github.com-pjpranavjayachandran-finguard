// Reusable summary tile
export default function StatCard({ label, value, color }) {
  return (
    <div className="stat" style={{ borderTopColor: color }}>
      <p className="stat-value">{value}</p>
      <p className="stat-label">{label}</p>
    </div>
  );
}
