/**
 * 이미지 decode/load 후 opacity 전환 (레이아웃은 유지하고 표시만 부드럽게)
 * :src가 바뀌면(updated) 다시 페이드합니다.
 */
function arm(el) {
  if (typeof window === 'undefined') return

  el._fadeImgAbort?.abort()
  const ac = new AbortController()
  el._fadeImgAbort = ac
  const { signal } = ac

  el.classList.add('fade-in-img')
  el.classList.remove('fade-in-img--ready')

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.classList.add('fade-in-img--ready')
    return
  }

  const done = () => {
    if (!signal.aborted) el.classList.add('fade-in-img--ready')
  }

  if (el.complete && el.naturalWidth > 0) {
    requestAnimationFrame(done)
    return
  }

  el.addEventListener('load', done, { once: true, signal })
  el.addEventListener('error', done, { once: true, signal })
}

export const fadeInImg = {
  mounted(el) {
    arm(el)
  },
  updated(el) {
    arm(el)
  },
  unmounted(el) {
    el._fadeImgAbort?.abort()
    el._fadeImgAbort = null
  },
}
