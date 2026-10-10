import { Eye, EyeOff } from 'lucide-react'
import StatCard from './StatCard'
import './ResultsPanel.css'

function ResultsPanel({ results, loading, error, showMask, onToggleMask }) {
  if (error) {
    return (
      <div className="panel results-panel">
        <h2>Analysis</h2>
        <div className="error-box">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="panel results-panel">
        <h2>Analysis</h2>
        <div className="empty-state">
          <p>Upload an image to begin analysis</p>
        </div>
      </div>
    )
  }

  return (
    <div className="panel results-panel">
      <div className="results-header">
        <h2>Analysis Results</h2>
        <button
          className="mask-toggle"
          onClick={() => onToggleMask(!showMask)}
          title={showMask ? 'Hide mask' : 'Show mask'}
        >
          {showMask ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </div>

      <div className="stat-grid">
        <StatCard
          label="Skin Coverage"
          value={`${results.skinCoverage.toFixed(1)}%`}
          variant="primary"
        />
        <StatCard
          label="Skin Pixels"
          value={results.skinPixelCount.toLocaleString()}
          variant="info"
        />
        <StatCard
          label="Dominant Tone"
          value={results.toneName}
          color={results.dominantColor}
          variant="tone"
        />
        <StatCard
          label="Skin Type"
          value={results.typeName}
          variant="type"
        />
      </div>

      <div className="summary-box">
        <h3>Summary</h3>
        <p>{results.insight}</p>
      </div>

      <div className="details-box">
        <h3>Color Values</h3>
        <div className="color-details">
          <div className="color-item">
            <span>Hex</span>
            <code>{results.dominantColor}</code>
          </div>
          <div className="color-item">
            <span>RGB</span>
            <code>rgb({Math.round(results.avgR)}, {Math.round(results.avgG)}, {Math.round(results.avgB)})</code>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultsPanel
