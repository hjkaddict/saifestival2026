import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'

import Home from '@/views/Home.vue'
import Artists from '@/views/Artists.vue'
import AboutView from '@/views/About.vue'
import Program from '@/views/Program.vue'
import Venue from '@/views/Venue.vue'
import Ticket from '@/views/Ticket.vue'
import { artistsData } from '@/assets/data/artists.js'

function artistSlug(nameEn) {
  return nameEn.toLowerCase().trim().replace(/\s+/g, '-')
}

function randomArtistPath() {
  const artist = artistsData[Math.floor(Math.random() * artistsData.length)]
  return `/artists/${artistSlug(artist.name_en)}`
}

const routes = [
  { path: '/', name: 'Home', component: Home },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
  },
  {
    path: '/artists',
    name: 'Artists',
    redirect: () => randomArtistPath(),
  },
  {
    path: '/artists/:id',
    name: 'ArtistDetail',
    component: Artists,
    props: true,
  },
  { path: '/program', name: 'Program', component: Program },
  { path: '/venue', name: 'Venue', component: Venue },
  { path: '/ticket', name: 'Ticket', component: Ticket },
]

const SCROLL_STORE_PREFIX = 'saifestival:scroll:'

function scrollStoreKey(fullPath) {
  return `${SCROLL_STORE_PREFIX}${fullPath}`
}

/** 이전 페이지 레이아웃이 잡힌 뒤 스크롤 복원 (뒤로/앞으로 가기) */
function waitForLayoutThenScroll() {
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

function parseSaved(savedPosition) {
  if (!savedPosition) return null
  const left = savedPosition.left ?? savedPosition.x ?? 0
  const top = savedPosition.top ?? savedPosition.y ?? 0
  return { left, top }
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
    const normalized = parseSaved(savedPosition)

    const restore = (left, top) =>
      waitForLayoutThenScroll().then(() => ({
        left,
        top,
        behavior: 'auto',
      }))

    if (normalized) {
      navigatedByPopState = false
      return restore(normalized.left, normalized.top)
    }

    if (navigatedByPopState && typeof window !== 'undefined') {
      navigatedByPopState = false
      try {
        const raw = sessionStorage.getItem(scrollStoreKey(to.fullPath))
        if (raw) {
          const { left, top } = JSON.parse(raw)
          if (typeof top === 'number' && Number.isFinite(top)) {
            return restore(typeof left === 'number' && Number.isFinite(left) ? left : 0, top)
          }
        }
      } catch {
        /* ignore */
      }
    }

    navigatedByPopState = false

    if (to.hash) {
      return waitForLayoutThenScroll().then(() => ({
        el: to.hash,
        top: 100,
        behavior: 'smooth',
      }))
    }

    return waitForLayoutThenScroll().then(() => ({ top: 0, left: 0, behavior: 'auto' }))
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
