# Skin Detector - React App

A polished web application for AI-powered skin tone, coverage, and type analysis using advanced image processing.

## Features

✨ **Modern React Interface**
- Built with Vite + React 18
- Responsive dashboard design
- Dark theme with gradient accents

📸 **Image Input**
- File upload support
- Camera capture (mobile)
- Drag-and-drop functionality
- Real-time image preview

🔍 **Skin Analysis**
- Skin coverage percentage
- Detected skin pixel count
- Dominant skin tone classification
- Skin type estimation (Fitzpatrick scale)
- Color values (Hex & RGB)

🎨 **Advanced Detection**
- RGB thresholding
- HSV color space analysis
- YCrCb color space analysis
- Reusable `skinDetection` module

## Installation

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## Project Structure

```
src/
├── components/
│   ├── Dashboard.jsx         # Main container
│   ├── UploadPanel.jsx       # File upload interface
│   ├── PreviewPanel.jsx      # Image preview & canvas
│   ├── ResultsPanel.jsx      # Analysis results display
│   └── StatCard.jsx          # Reusable stat component
├── utils/
│   └── skinDetection.js      # Core detection module
├── App.jsx
├── main.jsx
└── index.css
```

## Skin Detection Module

The `skinDetection.js` module provides reusable functions:

- `rgbToHsv()` - Convert RGB to HSV color space
- `rgbToYCrCb()` - Convert RGB to YCrCb color space
- `isSkinPixel()` - Determine if a pixel is skin
- `classifySkinTone()` - Classify dominant tone
- `classifySkinType()` - Estimate skin type
- `analyzeSkinDetection()` - Main analysis pipeline

## Build

```bash
npm run build
```

Builds the app for production to the `dist/` folder.

## Future Enhancements

- [ ] Deep learning model integration (TensorFlow.js)
- [ ] React Native mobile app
- [ ] Backend API version
- [ ] Advanced UV and sun damage detection
- [ ] Skin condition analysis (acne, dryness, etc.)

## License

MIT
