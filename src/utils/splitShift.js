/** Hangul UI: keep current split intensity. */
export const SPLIT_SCALE_KO = 0.56

/** Latin / English: subtler horizontal split. */
export const SPLIT_SCALE_LATIN = 0.36

const HANGUL_RE = /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/

export function splitScaleForLang(lang) {
  return lang === 'kr' ? SPLIT_SCALE_KO : SPLIT_SCALE_LATIN
}

/** Per label: Hangul → KO scale; otherwise Latin (e.g. EN names on KR site). */
export function splitScaleForText(text) {
  const s = String(text || '').trim()
  if (!s) return SPLIT_SCALE_LATIN
  if (HANGUL_RE.test(s)) return SPLIT_SCALE_KO
  return SPLIT_SCALE_LATIN
}

let iosSplitSnapCache = null

export function shouldSnapSplitShiftForIOS() {
  if (iosSplitSnapCache !== null) return iosSplitSnapCache
  if (typeof navigator === 'undefined') {
    iosSplitSnapCache = false
    return false
  }
  iosSplitSnapCache =
    /iP(hone|ad|od)/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  return iosSplitSnapCache
}

/** Horizontal split offset; on iOS snap to whole px to reduce WebKit raster blur. */
export function splitShiftPx(value) {
  if (!shouldSnapSplitShiftForIOS()) {
    return `${value.toFixed(2)}px`
  }
  let snapped = Math.round(value)
  if (snapped === 0 && value !== 0) {
    snapped = value > 0 ? 1 : -1
  }
  return `${snapped}px`
}
