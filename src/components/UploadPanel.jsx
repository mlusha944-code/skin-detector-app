import { Upload, X } from 'lucide-react'
import './UploadPanel.css'

function UploadPanel({ onImageSelect, fileInputRef, onClear, hasImage }) {
  return (
    <div className="panel upload-panel">
      <div className="panel-header">
        <h2>Upload Image</h2>
      </div>

      <div className="upload-content">
        <div className="upload-icon">
          <Upload size={32} />
        </div>

        <label className="upload-button primary" htmlFor="imageInput">
          <span>Choose Image</span>
        </label>
        <input
          id="imageInput"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onImageSelect(file)
          }}
        />

        <p className="divider">or drag and drop</p>

        <p className="hint">
          Use a clear, front-facing photo with natural lighting for best results.
        </p>

        {hasImage && (
          <button className="clear-button" onClick={onClear}>
            <X size={16} />
            <span>Clear</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default UploadPanel
