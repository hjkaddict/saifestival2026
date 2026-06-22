import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'

import Home from '@/views/Home.vue'
import BlankView from '@/views/BlankView.vue'
import Program from '@/views/Program.vue'
import Venue from '@/views/Venue.vue'
import Ticket from '@/views/Ticket.vue'
import Artists from '@/views/Artists.vue'
import AboutView from '@/views/About.vue'
import CuratorsNote from '@/views/CuratorsNote.vue'
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
  { path: '/curators-note', name: 'CuratorsNote', component: CuratorsNote },
  { path: '/archive', name: 'Archive', component: BlankView },
]

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
      return false
    }

    // Program section anchors scroll after the page transition (see App.vue).
    if (to.hash && to.name !== 'Program') {
      return waitLayoutQuick().then(() => ({
        el: to.hash,
        top: 100,
        behavior: 'auto',
      }))
    }

    return false
  },
})

export default router
