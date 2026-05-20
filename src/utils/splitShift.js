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
