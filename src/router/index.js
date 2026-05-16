import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'

import Home from '@/views/Home.vue'
import BlankView from '@/views/BlankView.vue'
import Program from '@/views/Program.vue'
import Venue from '@/views/Venue.vue'
import Ticket from '@/views/Ticket.vue'
import Artists from '@/views/Artists.vue'
import AboutView from '@/views/About.vue'
import WorkshopDetail from '@/views/WorkshopDetail.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/artists', name: 'Artists', component: Artists },
  { path: '/artists/:id', name: 'ArtistDetail', component: Artists, props: true },
  { path: '/program', name: 'Program', component: Program },
  { path: '/program/workshop/:id', name: 'WorkshopDetail', component: WorkshopDetail, props: true },
  { path: '/venue', name: 'Venue', component: Venue },
  { path: '/ticket', name: 'Ticket', component: Ticket },
  { path: '/about', name: 'about', component: AboutView },
  { path: '/archive', name: 'Archive', component: BlankView },
]

const SCROLL_STORE_PREFIX = 'saifestival:scroll:'

/** App.vue `page-fade` duration와 맞출 것 (mode out-in = 퇴장+진입 순차) */
const PAGE_TRANSITION_MS = 340

function scrollStoreKey(fullPath) {
  return `${SCROLL_STORE_PREFIX}${fullPath}`
}

function readStoredScroll(fullPath) {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(scrollStoreKey(fullPath))
    if (!raw) return null
    const { left, top } = JSON.parse(raw)
    if (typeof top !== 'number' || !Number.isFinite(top)) return null
    const l = typeof left === 'number' && Number.isFinite(left) ? left : 0
    return { left: l, top }
  } catch {
    return null
  }
}

/** 일반 이동(push)·맨 위 정렬 */
function waitLayoutQuick() {
  return new Promise((resolve) => {
    nextTick(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resolve()
        })
      })
    })
  })
}

/**
 * 뒤로/앞으로 가기 등 스크롤 복원: router-view transition(out-in) 후에 적용해야
 * 잘못된 높이로 스크롤되거나 이후 맨 위로 덮이는 현상을 줄입니다.
 */
function waitAfterRouteTransition() {
  return new Promise((resolve) => {
    nextTick(() => {
      const reduce =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const ms = reduce ? 0 : PAGE_TRANSITION_MS * 2 + 80
      setTimeout(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            resolve()
          })
        })
      }, ms)
    })
  })
}

function parseSaved(savedPosition) {
  if (!savedPosition) return null
  const left = savedPosition.left ?? savedPosition.x ?? 0
  const top = savedPosition.top ?? savedPosition.y ?? 0
  return { left, top }
}

/** 접근성: 모션 줄이기 설정이면 즉시 스크롤 */
function scrollMotion() {
  if (typeof window === 'undefined') return 'auto'
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
}

if (typeof window !== 'undefined') {
  window.history.scrollRestoration = 'manual'
}

let navigatedByPopState = false
if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    navigatedByPopState = true
  })
}

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    const stored = readStoredScroll(to.fullPath)
    const wasPop = navigatedByPopState
    if (typeof window !== 'undefined') {
      navigatedByPopState = false
    }

    const restoreDelayed = (left, top) =>
      waitAfterRouteTransition().then(() => ({
        left,
        top,
        behavior: scrollMotion(),
      }))

    const restoreQuick = (left, top) =>
      waitLayoutQuick().then(() => ({
        left,
        top,
        behavior: scrollMotion(),
      }))

    /* popstate: 세션에 저장한 위치가 가장 정확 (Vue history.state.scroll 이 0,0으로 오는 경우 많음) */
    if (wasPop && stored) {
      return restoreDelayed(stored.left, stored.top)
    }

    const normalized = parseSaved(savedPosition)
    if (normalized) {
      if (
        stored &&
        normalized.top === 0 &&
        normalized.left === 0 &&
        (stored.top > 0 || stored.left > 0)
      ) {
        return restoreDelayed(stored.left, stored.top)
      }
      return restoreQuick(normalized.left, normalized.top)
    }

    if (to.hash) {
      return waitAfterRouteTransition().then(() => ({
        el: to.hash,
        top: 100,
        behavior: scrollMotion(),
      }))
    }

    return restoreQuick(0, 0)
  },
})

router.beforeEach((to, from) => {
  if (typeof window === 'undefined') return
  if (!from.matched.length) return
  try {
    sessionStorage.setItem(
      scrollStoreKey(from.fullPath),
      JSON.stringify({
        left: window.scrollX,
        top: window.scrollY,
      }),
    )
  } catch {
    /* ignore */
  }
})

export default router
