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

/** Horizontal split offset; on iOS snap to 0.5px to reduce WebKit raster blur. */
export function splitShiftPx(value) {
  if (!shouldSnapSplitShiftForIOS()) {
    return `${value.toFixed(2)}px`
  }
  const snapped = Math.round(value * 2) / 2
  return `${snapped.toFixed(1)}px`
}
