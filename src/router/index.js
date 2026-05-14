import { createRouter, createWebHistory } from 'vue-router'

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

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return {
        el: to.hash,
        top: 100,
        behavior: 'smooth',
      }
    }
    return { top: 0 }
  },
})

export default router
