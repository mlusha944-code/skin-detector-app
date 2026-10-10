* {
  box-sizing: border-box;
}

:root {
  --bg: #0f172a;
  --panel: #111827;
  --panel-2: #1f2937;
  --text: #e5e7eb;
  --muted: #94a3b8;
  --accent: #f472b6;
  --accent-2: #f59e0b;
  --line: rgba(148, 163, 184, 0.18);
  --success: #34d399;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: Inter, "Segoe UI", sans-serif;
  background: linear-gradient(135deg, #0f172a, #111827 45%, #1e293b);
  color: var(--text);
}

.container {
  width: min(1200px, calc(100% - 32px));
  margin: 0 auto;
  padding: 32px 0 48px;
}

.topbar {
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 8px;
  color: var(--muted);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 12px;
}

h1,
h2,
h3,
p {
  margin-top: 0;
}

h1 {
  margin-bottom: 0;
  font-size: clamp(2rem, 4vw, 3rem);
}

.app-shell {
  display: grid;
  grid-template-columns: 1fr 1.4fr 1fr;
  gap: 20px;
}

.panel {
  background: rgba(17, 24, 39, 0.9);
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 22px 50px rgba(0, 0, 0, 0.2);
}

.upload-panel,
.results-panel {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.controls {
  margin-top: 16px;
}

input[type="file"] {
  display: none;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 18px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: rgba(148, 163, 184, 0.08);
  color: var(--text);
  cursor: pointer;
  transition: 0.2s ease;
  font-weight: 600;
}

.button:hover {
  transform: translateY(-1px);
  border-color: rgba(244, 114, 182, 0.5);
}

.button.primary {
  background: linear-gradient(135deg, var(--accent), #ec4899);
  color: white;
  border: none;
}

.hint {
  margin-top: 18px;
  color: var(--muted);
  line-height: 1.5;
}

.preview-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

#previewCanvas {
  width: 100%;
  max-height: 580px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(31, 41, 55, 1), rgba(15, 23, 42, 1));
  border: 1px solid var(--line);
  object-fit: contain;
}

.mask-toggle {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  color: var(--muted);
}

.mask-toggle input {
  accent-color: var(--accent);
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.stat-card {
  background: rgba(31, 41, 55, 0.75);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 16px 14px;
  min-height: 96px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.label {
  color: var(--muted);
  font-size: 0.82rem;
}

.stat-card strong {
  font-size: clamp(1.05rem, 2vw, 1.8rem);
}

.tone-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.tone-swatch {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.35);
  background: #f4d5b1;
  display: inline-block;
}

.summary-box {
  margin-top: 20px;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 16px;
}

.summary-box p {
  margin-bottom: 0;
  color: var(--text);
  line-height: 1.6;
}

@media (max-width: 920px) {
  .app-shell {
    grid-template-columns: 1fr;
  }

  .panel {
    padding: 18px;
  }
}
