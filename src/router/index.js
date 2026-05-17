import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'

import Home from '@/views/Home.vue'
import BlankView from '@/views/BlankView.vue'
import Program from '@/views/Program.vue'
import Venue from '@/views/Venue.vue'
import Ticket from '@/views/Ticket.vue'
import Artists from '@/views/Artists.vue'
import AboutView from '@/views/About.vue'
import ExhibitionDetail from '@/views/ExhibitionDetail.vue'
import WorkshopDetail from '@/views/WorkshopDetail.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/artists', name: 'Artists', component: Artists },
  { path: '/artists/:id', name: 'ArtistDetail', component: Artists, props: true },
  { path: '/program', name: 'Program', component: Program },
  { path: '/program/exhibition/:id', name: 'ExhibitionDetail', component: ExhibitionDetail, props: true },
  { path: '/program/workshop/:id', name: 'WorkshopDetail', component: WorkshopDetail, props: true },
  { path: '/venue', name: 'Venue', component: Venue },
  { path: '/ticket', name: 'Ticket', component: Ticket },
  { path: '/about', name: 'about', component: AboutView },
  { path: '/archive', name: 'Archive', component: BlankView },
]

const PAGE_TRANSITION_MS = 340
const HISTORY_SCROLL_RESTORE_EVENT = 'saifestival:history-scroll-restore'
let pendingHistoryScroll = null

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

if (typeof window !== 'undefined') {
  window.history.scrollRestoration = 'manual'
}

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      pendingHistoryScroll = {
        left: savedPosition.left ?? savedPosition.x ?? 0,
        top: savedPosition.top ?? savedPosition.y ?? 0,
      }
      return { left: 0, top: 0, behavior: 'auto' }
    }

    if (to.hash) {
      return waitLayoutQuick().then(() => ({
        el: to.hash,
        top: 100,
        behavior: 'auto',
      }))
    }

    return waitLayoutQuick().then(() => ({
      left: 0,
      top: 0,
      behavior: 'auto',
    }))
  },
})

router.afterEach(() => {
  if (typeof window === 'undefined' || !pendingHistoryScroll) return
  const position = pendingHistoryScroll
  pendingHistoryScroll = null
  window.setTimeout(() => {
    window.dispatchEvent(new CustomEvent(HISTORY_SCROLL_RESTORE_EVENT, { detail: position }))
  }, PAGE_TRANSITION_MS * 2 + 80)
})

export default router
