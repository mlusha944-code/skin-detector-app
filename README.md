const imageInput = document.getElementById('imageInput');
const previewCanvas = document.getElementById('previewCanvas');
const ctx = previewCanvas.getContext('2d');
const showMaskToggle = document.getElementById('showMask');

const skinCoverageEl = document.getElementById('skinCoverage');
const skinPixelsEl = document.getElementById('skinPixels');
const dominantToneEl = document.getElementById('dominantTone');
const skinTypeEl = document.getElementById('skinType');
const insightTextEl = document.getElementById('insightText');
const toneColorEl = document.getElementById('toneColor');

let currentImageData = null;
let currentMask = null;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function rgbToHsv(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (d !== 0) {
    switch (max) {
      case r:
        h = (g - b) / d % 6;
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
        break;
    }
  }

  h = (h * 60 + 360) % 360;
  return { h, s, v };
}

function rgbToYCrCb(r, g, b) {
  const y = 0.299 * r + 0.587 * g + 0.114 * b;
  const cb = -0.168736 * r - 0.331264 * g + 0.5 * b + 128;
  const cr = 0.5 * r - 0.418688 * g - 0.081312 * b + 128;
  return { y, cb, cr };
}

function isSkinPixel(r, g, b) {
  const { h, s, v } = rgbToHsv(r, g, b);

  const rgbRule =
    r > 95 &&
    g > 40 &&
    b > 20 &&
    r > g &&
    r > b &&
    Math.abs(r - g) > 15 &&
    (h >= 0 && h <= 50 || h >= 340);

  const hsvRule = h >= 0 && h <= 50 && s >= 0.23 && s <= 0.68 && v >= 0.2;
  const ycrcb = (() => {
    const { cb, cr } = rgbToYCrCb(r, g, b);
    return cb >= 85 && cb <= 135 && cr >= 135 && cr <= 180;
  })();

  return rgbRule || (hsvRule && ycrcb);
}

function classifySkinTone(avgR, avgG, avgB) {
  const luminance = 0.2126 * avgR + 0.7152 * avgG + 0.0722 * avgB;

  if (luminance < 65) return 'Deep brown';
  if (luminance < 90) return 'Brown';
  if (luminance < 120) return 'Olive';
  if (luminance < 150) return 'Medium';
  if (luminance < 175) return 'Light';
  return 'Very light';
}

function classifySkinType(avgR, avgG, avgB) {
  const luminance = 0.2126 * avgR + 0.7152 * avgG + 0.0722 * avgB;

  if (luminance < 80) return 'Type V–VI';
  if (luminance < 110) return 'Type IV';
  if (luminance < 140) return 'Type III';
  if (luminance < 170) return 'Type II';
  return 'Type I';
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
}

function clearResults() {
  skinCoverageEl.textContent = '0%';
  skinPixelsEl.textContent = '0';
  dominantToneEl.textContent = 'N/A';
  skinTypeEl.textContent = 'Undetermined';
  insightTextEl.textContent = 'Upload a photo to begin.';
  toneColorEl.style.background = '#f4d5b1';
}

function renderDetectedMask(mask, width, height) {
  const output = ctx.createImageData(width, height);
  const originalData = currentImageData.data;

  for (let i = 0; i < mask.length; i += 1) {
    const index = i * 4;
    const isSkin = mask[i];

    output.data[index] = isSkin ? 0 : originalData[index];
    output.data[index + 1] = isSkin ? 255 : originalData[index + 1];
    output.data[index + 2] = isSkin ? 150 : originalData[index + 2];
    output.data[index + 3] = 255;
  }

  ctx.putImageData(output, 0, 0);
}

function analyzeImage(image) {
  const maxWidth = 640;
  const scale = Math.min(1, maxWidth / image.width);
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  previewCanvas.width = width;
  previewCanvas.height = height;

  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0, width, height);

  const imageData = ctx.getImageData(0, 0, width, height);
  currentImageData = imageData;

  let skinPixelCount = 0;
  let totalPixels = width * height;
  let rTotal = 0;
  let gTotal = 0;
  let bTotal = 0;
  const mask = new Uint8Array(totalPixels);

  for (let i = 0; i < totalPixels; i += 1) {
    const offset = i * 4;
    const r = imageData.data[offset];
    const g = imageData.data[offset + 1];
    const b = imageData.data[offset + 2];

    const isSkin = isSkinPixel(r, g, b);

    if (isSkin) {
      mask[i] = 1;
      skinPixelCount += 1;
      rTotal += r;
      gTotal += g;
      bTotal += b;
    }
  }

  currentMask = mask;

  if (skinPixelCount === 0) {
    clearResults();
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, width, height);
    insightTextEl.textContent = 'No skin pixels detected. Try a well-lit photo with a clear face and neutral background.';
    return;
  }

  const skinCoverage = (skinPixelCount / totalPixels) * 100;
  const avgR = rTotal / skinPixelCount;
  const avgG = gTotal / skinPixelCount;
  const avgB = bTotal / skinPixelCount;

  const dominantColor = rgbToHex(Math.round(avgR), Math.round(avgG), Math.round(avgB));
  const toneName = classifySkinTone(avgR, avgG, avgB);
  const typeName = classifySkinType(avgR, avgG, avgB);

  skinCoverageEl.textContent = `${skinCoverage.toFixed(1)}%`;
  skinPixelsEl.textContent = `${skinPixelCount.toLocaleString()}`;
  dominantToneEl.textContent = toneName;
  skinTypeEl.textContent = typeName;
  toneColorEl.style.background = dominantColor;

  const insight = `The algorithm detected ${skinCoverage.toFixed(1)}% skin coverage. The dominant tone is ${toneName.toLowerCase()} with a skin type estimate of ${typeName}.`;
  insightTextEl.textContent = insight;

  if (showMaskToggle.checked) {
    renderDetectedMask(mask, width, height);
  } else {
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, width, height);
  }
}

function loadImageFromFile(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => analyzeImage(img);
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

imageInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  loadImageFromFile(file);
});

showMaskToggle.addEventListener('change', () => {
  if (!currentImageData || !currentMask) return;

  const image = new Image();
  image.src = previewCanvas.toDataURL();

  if (showMaskToggle.checked) {
    renderDetectedMask(currentMask, previewCanvas.width, previewCanvas.height);
  } else {
    ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    ctx.drawImage(image, 0, 0, previewCanvas.width, previewCanvas.height);
  }
});

clearResults();
