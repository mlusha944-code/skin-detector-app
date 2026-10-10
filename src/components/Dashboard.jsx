import { useState, useRef, useEffect } from 'react'
import UploadPanel from './UploadPanel'
import PreviewPanel from './PreviewPanel'
import ResultsPanel from './ResultsPanel'
import { analyzeSkinDetection } from '../utils/skinDetection'
import './Dashboard.css'

function Dashboard({ imageFile, onImageSelect, fileInputRef }) {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showMask, setShowMask] = useState(true)
  const [error, setError] = useState(null)
  const canvasRef = useRef(null)
  const imageRef = useRef(null)

  useEffect(() => {
    if (!imageFile) {
      setResults(null)
      setError(null)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = async () => {
        imageRef.current = img
        setLoading(true)
        setError(null)
        try {
          const analysisResults = await analyzeSkinDetection(img, canvasRef.current)
          setResults(analysisResults)
        } catch (err) {
          setError('Failed to analyze image. Please try another photo.')
          console.error(err)
        } finally {
          setLoading(false)
        }
      }
      img.onerror = () => {
        setError('Failed to load image')
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(imageFile)
  }, [imageFile])

  const handleClear = () => {
    setResults(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <p className="eyebrow">AI-powered skin analysis</p>
          <h1>Skin Detector</h1>
          <p className="subtitle">Analyze your skin tone, coverage, and type using advanced image processing</p>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-grid">
          <UploadPanel 
            onImageSelect={onImageSelect}
            fileInputRef={fileInputRef}
            onClear={handleClear}
            hasImage={!!imageFile}
          />
          <PreviewPanel 
            canvasRef={canvasRef}
            imageFile={imageFile}
            image={imageRef.current}
            showMask={showMask}
            results={results}
            loading={loading}
          />
          <ResultsPanel 
            results={results}
            loading={loading}
            error={error}
            showMask={showMask}
            onToggleMask={setShowMask}
          />
        </div>
      </main>
    </div>
  )
}

export default Dashboard
