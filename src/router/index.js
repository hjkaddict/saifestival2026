import { createRouter, createWebHistory } from 'vue-router'

// 1. 페이지 컴포넌트 임포트 (views 폴더에 생성 예정)
import Home from '@/views/Home.vue'
import Artists from '@/views/Artists.vue'
import AboutView from '@/views/About.vue'
import Program from '@/views/Program.vue'
import Venue from '@/views/Venue.vue'
// import Schedule from '../views/Schedule.vue'
// import Ticket from '../views/Ticket.vue'
// import Archive from '../views/Archive.vue'

// 2. 경로(Routes) 정의
const routes = [
  { path: '/', name: 'Home', component: Home },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
  },
  { path: '/artists', name: 'Artists', component: Artists },
  {
    path: '/artists',
    redirect: () => {
      const randomId = artistsData[Math.floor(Math.random() * artistsData.length)].id
      return `/artists/${randomId}`
    },
  },
  {
    path: '/artists/:id',
    name: 'ArtistDetail',
    component: () => import('@/views/Artists.vue'),
    props: true, // URL 파라미터를 컴포넌트의 props로 전달
  },
  { path: '/program', name: 'Program', component: Program },
  { path: '/venue', name: 'Venue', component: Venue },
  // { path: '/schedule', name: 'Schedule', component: Schedule },
  // { path: '/ticket', name: 'Ticket', component: Ticket },
  // { path: '/archive', name: 'Archive', component: Archive },
  // { path: '/about', name: 'About', component: About },
]

// 3. 라우터 인스턴스 생성
const router = createRouter({
  history: createWebHistory(), // 깔끔한 URL 방식 (example.com/artists)
  routes,
  // 페이지 이동 시 항상 최상단으로 스크롤 이동
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
