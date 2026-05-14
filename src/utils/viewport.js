/** 모바일 브라우저 UI(주소창 등)를 반영한 실제 보이는 높이 */
export function getVisibleViewportHeight() {
  return window.visualViewport?.height ?? window.innerHeight
}

export function syncAppViewportHeight() {
  const h = getVisibleViewportHeight()
  document.documentElement.style.setProperty('--app-vh', `${h * 0.01}px`)
  window.dispatchEvent(new Event('app-vh-change'))
}

export function installViewportHeightSync() {
  const update = () => syncAppViewportHeight()

  update()
  window.addEventListener('resize', update)
  window.addEventListener('orientationchange', update)

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', update)
    window.visualViewport.addEventListener('scroll', update)
  }

  return () => {
    window.removeEventListener('resize', update)
    window.removeEventListener('orientationchange', update)
    if (window.visualViewport) {
      window.visualViewport.removeEventListener('resize', update)
      window.visualViewport.removeEventListener('scroll', update)
    }
  }
}
