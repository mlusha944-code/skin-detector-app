/**
 * Skin Detection Utilities - Reusable module for skin analysis
 * Uses RGB/HSV/YCrCb thresholding for accurate skin detection
 */

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export function rgbToHsv(r, g, b) {
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
        h = ((g - b) / d % 6) * 60;
        break;
      case g:
        h = ((b - r) / d + 2) * 60;
        break;
      default:
        h = ((r - g) / d + 4) * 60;
        break;
    }
  }

  h = (h + 360) % 360;
  return { h, s, v };
}

export function rgbToYCrCb(r, g, b) {
  const y = 0.299 * r + 0.587 * g + 0.114 * b;
  const cb = -0.168736 * r - 0.331264 * g + 0.5 * b + 128;
  const cr = 0.5 * r - 0.418688 * g - 0.081312 * b + 128;
  return { y, cb, cr };
}

export function isSkinPixel(r, g, b) {
  const { h, s, v } = rgbToHsv(r, g, b);
  const { cb, cr } = rgbToYCrCb(r, g, b);

  // RGB thresholding rule
  const rgbRule =
    r > 95 &&
    g > 40 &&
    b > 20 &&
    r > g &&
    r > b &&
    Math.abs(r - g) > 15 &&
    ((h >= 0 && h <= 50) || h >= 340);

  // HSV thresholding rule
  const hsvRule = h >= 0 && h <= 50 && s >= 0.23 && s <= 0.68 && v >= 0.2;

  // YCrCb thresholding rule
  const ycrcbRule = cb >= 85 && cb <= 135 && cr >= 135 && cr <= 180;

  // Combine rules: RGB rule OR (HSV rule AND YCrCb rule)
  return rgbRule || (hsvRule && ycrcbRule);
}

export function classifySkinTone(avgR, avgG, avgB) {
  const luminance = 0.2126 * avgR + 0.7152 * avgG + 0.0722 * avgB;

  if (luminance < 65) return 'Deep brown';
  if (luminance < 90) return 'Brown';
  if (luminance < 120) return 'Olive';
  if (luminance < 150) return 'Medium';
  if (luminance < 175) return 'Light';
  return 'Very light';
}

export function classifySkinType(avgR, avgG, avgB) {
  const luminance = 0.2126 * avgR + 0.7152 * avgG + 0.0722 * avgB;

  if (luminance < 80) return 'Type V–VI';
  if (luminance < 110) return 'Type IV';
  if (luminance < 140) return 'Type III';
  if (luminance < 170) return 'Type II';
  return 'Type I';
}

export function rgbToHex(r, g, b) {
  return `#${[r, g, b]
    .map((channel) => channel.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`;
}

export async function analyzeSkinDetection(image, canvas) {
  return new Promise((resolve, reject) => {
    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Cannot get canvas context');

      // Scale image to fit canvas
      const maxWidth = 640;
      const scale = Math.min(1, maxWidth / image.width);
      const width = Math.max(1, Math.round(image.width * scale));
      const height = Math.max(1, Math.round(image.height * scale));

      canvas.width = width;
      canvas.height = height;

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(image, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      let skinPixelCount = 0;
      const totalPixels = width * height;
      let rTotal = 0;
      let gTotal = 0;
      let bTotal = 0;
      const mask = new Uint8Array(totalPixels);

      // Analyze each pixel
      for (let i = 0; i < totalPixels; i++) {
        const offset = i * 4;
        const r = data[offset];
        const g = data[offset + 1];
        const b = data[offset + 2];

        const isSkin = isSkinPixel(r, g, b);

        if (isSkin) {
          mask[i] = 1;
          skinPixelCount++;
          rTotal += r;
          gTotal += g;
          bTotal += b;
        }
      }

      if (skinPixelCount === 0) {
        resolve({
          skinCoverage: 0,
          skinPixelCount: 0,
          dominantColor: '#f4d5b1',
          toneName: 'No skin detected',
          typeName: 'Undetermined',
          avgR: 0,
          avgG: 0,
          avgB: 0,
          insight: 'No skin pixels detected. Try a well-lit photo with a clear face.',
          mask,
        });
        return;
      }

      // Calculate averages
      const avgR = rTotal / skinPixelCount;
      const avgG = gTotal / skinPixelCount;
      const avgB = bTotal / skinPixelCount;

      const skinCoverage = (skinPixelCount / totalPixels) * 100;
      const dominantColor = rgbToHex(Math.round(avgR), Math.round(avgG), Math.round(avgB));
      const toneName = classifySkinTone(avgR, avgG, avgB);
      const typeName = classifySkinType(avgR, avgG, avgB);

      const insight = `Detected ${skinCoverage.toFixed(1)}% skin coverage. Dominant tone: ${toneName.toLowerCase()}. Estimated skin type: ${typeName}.`;

      resolve({
        skinCoverage,
        skinPixelCount,
        dominantColor,
        toneName,
        typeName,
        avgR,
        avgG,
        avgB,
        insight,
        mask,
      });
    } catch (error) {
      reject(error);
    }
  });
}
