function hashSeed(seed) {
  const s = String(seed)
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function createSeededRandom(seed) {
  let state = hashSeed(seed) >>> 0
  return () => {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function buildOrganicClipPath(rand = Math.random) {
  const r = typeof rand === 'function' ? rand : Math.random
  const steps = 14
  const topPhase = r() * Math.PI * 2
  const botPhase = r() * Math.PI * 2
  const topFreq = 1.1 + r() * 1.2
  const botFreq = 1.1 + r() * 1.2
  const topAmp = 4 + r() * 5
  const botAmp = 4 + r() * 5
  const sideAmp = 1 + r() * 2
  const topBase = 11 + r() * 4
  const botBase = 89 - (11 + r() * 4)
  const jitter = () => (r() - 0.5) * 0.8

  const wave = (t, freq, phase, amp) =>
    Math.sin(t * Math.PI * freq + phase) * amp * 0.55 +
    Math.sin(t * Math.PI * freq * 1.9 + phase * 0.7) * amp * 0.22

  const pts = []

  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const x = t * 100
    const y = topBase + wave(t, topFreq, topPhase, topAmp) + jitter()
    pts.push(`${x.toFixed(1)}% ${Math.max(6, Math.min(24, y)).toFixed(1)}%`)
  }

  for (let i = 1; i <= 3; i++) {
    const t = i / 3
    const y = t * 100
    const x = 100 - sideAmp * 0.25 + wave(t, 1.8, topPhase, sideAmp) * 0.35 + jitter()
    pts.push(`${Math.min(99, x).toFixed(1)}% ${y.toFixed(1)}%`)
  }

  for (let i = steps; i >= 0; i--) {
    const t = i / steps
    const x = t * 100
    const y = botBase + wave(t, botFreq, botPhase, botAmp) + jitter()
    pts.push(`${x.toFixed(1)}% ${Math.min(94, Math.max(76, y)).toFixed(1)}%`)
  }

  for (let i = 2; i >= 1; i--) {
    const t = i / 3
    const y = t * 100
    const x = sideAmp * 0.25 + wave(t, 1.8, botPhase, sideAmp) * 0.35 + jitter()
    pts.push(`${Math.max(1, x).toFixed(1)}% ${y.toFixed(1)}%`)
  }

  return `polygon(${pts.join(', ')})`
}

export function seededOrganicHighlight(seed, bgColor = null) {
  const rand = createSeededRandom(seed)
  const r = (a, b) => a + rand() * (b - a)
  const style = {
    '--hl-clip': buildOrganicClipPath(rand),
    '--hl-rotate': `${r(-0.35, 0.35).toFixed(2)}deg`,
    '--hl-sx': r(1.01, 1.04).toFixed(3),
    '--hl-sy': r(1.02, 1.06).toFixed(3),
    '--hl-inset-x': `${r(5, 8).toFixed(1)}px`,
    '--hl-inset-y': `${r(3, 5).toFixed(1)}px`,
  }
  if (bgColor) style['--organic-bg-color'] = bgColor
  return style
}

export function randomOrganicHighlight(bgColor = null) {
  const r = (a, b) => a + Math.random() * (b - a)
  const style = {
    '--hl-clip': buildOrganicClipPath(),
    '--hl-rotate': `${r(-0.35, 0.35).toFixed(2)}deg`,
    '--hl-sx': r(1.01, 1.04).toFixed(3),
    '--hl-sy': r(1.02, 1.06).toFixed(3),
    '--hl-inset-x': `${r(5, 8).toFixed(1)}px`,
    '--hl-inset-y': `${r(3, 5).toFixed(1)}px`,
  }
  if (bgColor) style['--organic-bg-color'] = bgColor
  return style
}

export const ARTISTS_LINEUP_BTN_ORGANIC = seededOrganicHighlight('artists-lineup-btn', '#000')
