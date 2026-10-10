import { useState, useRef } from 'react'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const [imageFile, setImageFile] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImageFile(file)
    }
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div 
      className="app"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Dashboard 
        imageFile={imageFile}
        onImageSelect={handleFileSelect}
        fileInputRef={fileInputRef}
      />
    </div>
  )
}

export default App
