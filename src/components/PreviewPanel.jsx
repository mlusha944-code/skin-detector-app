import { useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'
import './PreviewPanel.css'

function PreviewPanel({ canvasRef, imageFile, image, showMask, results, loading }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current || !image) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Scale image to fit canvas
    const maxWidth = 640
    const scale = Math.min(1, maxWidth / image.width)
    const width = Math.max(1, Math.round(image.width * scale))
    const height = Math.max(1, Math.round(image.height * scale))

    canvas.width = width
    canvas.height = height

    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(image, 0, 0, width, height)
  }, [image, canvasRef])

  return (
    <div className="panel preview-panel">
      <div className="preview-container" ref={containerRef}>
        {!imageFile && (
          <div className="preview-placeholder">
            <p>No image selected</p>
          </div>
        )}
        {imageFile && (
          <>
            {loading && (
              <div className="loading-overlay">
                <Loader2 size={40} className="spinner" />
                <p>Analyzing...</p>
              </div>
            )}
            <canvas ref={canvasRef} className="preview-canvas" />
          </>
        )}
      </div>
    </div>
  )
}

export default PreviewPanel
