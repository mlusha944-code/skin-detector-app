import './StatCard.css'

function StatCard({ label, value, color, variant = 'default' }) {
  return (
    <div className={`stat-card stat-${variant}`}>
      <span className="stat-label">{label}</span>
      <div className="stat-content">
        {color && <div className="stat-color" style={{ background: color }} />}
        <strong className="stat-value">{value}</strong>
      </div>
    </div>
  )
}

export default StatCard
