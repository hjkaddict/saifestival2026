<template>
  <div class="program-container">
    <!-- 🔥 상단 고정 네비게이션 UI -->
    <nav class="program-nav">
      <!-- 중앙: 프로그램 드롭다운 메뉴 -->
      <div class="nav-center">
        <div class="dropdown-wrapper" @mouseenter="showMenu = true" @mouseleave="showMenu = false">
          <button class="nav-btn main-label">
            {{ locale.lang === 'kr' ? '프로그램' : 'PROGRAM' }}
          </button>
          <transition name="slide-fade">
            <div v-if="showMenu" class="dropdown-content">
              <button
                v-for="pgm in shuffledPrograms"
                :key="pgm.data.id"
                @click="scrollToSection(pgm.data.id)"
                class="dropdown-item"
              >
                {{ pgm.data.title[locale.lang] }}
              </button>
            </div>
          </transition>
        </div>
      </div>
    </nav>

    <div class="program-list">
      <template v-for="(pgm, index) in shuffledPrograms" :key="index">
        <!-- 🔥 id를 부여하여 스크롤 타겟 설정 -->
        <section :id="pgm.data.id" class="program-section">
          <!-- 프로그램 메타 정보 -->
          <div class="program-meta">
            <h2 class="program-type">
              <span v-html="pgm.data.title[locale.lang]"></span>
              <span
                class="date-time"
                v-html="pgm.data.period ? pgm.data.period[locale.lang] : pgm.data.date[locale.lang]"
              ></span>
            </h2>

            <div
              v-if="pgm.data.openingHours && pgm.data.openingHours[locale.lang]"
              class="info-group"
            >
              <div class="hours-container">
                <div
                  v-for="(time, tIdx) in pgm.data.openingHours[locale.lang].split('/')"
                  :key="tIdx"
                  class="hours-box"
                >
                  <span class="hours" v-html="time.trim()"></span>
                </div>
              </div>
            </div>
          </div>

          <!-- 프로그램 설명 -->
          <div class="program-content">
            <p
              class="description"
              v-html="pgm.data.description[locale.lang] || pgm.data.description['kr']"
            ></p>
          </div>

          <!-- 퍼포먼스 프로그램일 경우 아티스트 리스트 -->
          <div v-if="pgm.isPerformance" class="performance-artists-wrapper">
            <div v-for="day in performanceDays" :key="day.date" class="performance-day-group">
              <h3 class="day-title">{{ day.date }}</h3>
              <div class="artist-grid">
                <router-link
                  v-for="artist in day.shuffledArtists"
                  :key="artist.id"
                  :to="`/artists/${formatSlug(artist.name_en)}`"
                  class="artist-card"
                >
                  <div class="glitch-wrapper">
                    <div class="slice top" :style="getSliceStyle(artist.glitch, 'top')">
                      <img :src="artist.img" class="artist-img" />
                    </div>
                    <div class="slice bottom" :style="getSliceStyle(artist.glitch, 'bottom')">
                      <img :src="artist.img" class="artist-img" />
                    </div>
                    <div class="glitch-line" :style="getArtistLineStyle(artist.glitch)"></div>
                  </div>
                  <div class="artist-info">
                    <p class="artist-name-main">
                      {{ locale.lang === 'en' ? artist.name_en : artist.name_kr }}
                    </p>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </section>

        <!-- 섹션 사이 구분선 -->
        <div v-if="index < shuffledPrograms.length - 1" class="divider-space">
          <svg class="line-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line
              x1="0"
              :y1="lineConfigs[index]?.line1.y1"
              x2="100"
              :y2="lineConfigs[index]?.line1.y2"
              :stroke="lineConfigs[index]?.line1.color"
              :stroke-width="lineConfigs[index]?.line1.weight"
              :style="getDividerLineStyle(lineConfigs[index]?.line1)"
            />
          </svg>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
// ... 기존 import 동일 ...
import { localeStore } from '@/store/locale.js'
import { programExhibition } from '@/assets/data/program_exhibition.js'
import { programPerformance } from '@/assets/data/program_performance.js'
import { programWorkshop } from '@/assets/data/program_workshop.js'
import { artistsData } from '@/assets/data/artists.js'

export default {
  name: 'Program',
  data() {
    return {
      locale: localeStore,
      shuffledPrograms: [],
      lineConfigs: [],
      scrollProgress: 0,
      palette: ['#FF0000', '#FFA500', '#FFFF00', '#00FF00', '#FFC0CB'],
      performanceDays: [],
      showMenu: false, // 드롭다운 노출 여부
    }
  },
  mounted() {
    this.initPrograms()
    this.initPerformanceArtists()
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    initPrograms() {
      // 각 데이터에 ID 추가 (스크롤용)
      const baseData = [
        { data: { ...programExhibition, id: 'exhibition' }, isPerformance: false },
        { data: { ...programPerformance, id: 'performance' }, isPerformance: true },
        { data: { ...programWorkshop, id: 'workshop' }, isPerformance: false },
      ]
      this.shuffledPrograms = baseData.sort(() => Math.random() - 0.5)

      this.lineConfigs = Array.from({ length: this.shuffledPrograms.length - 1 }, () => ({
        line1: this.generateRandomLineParams(),
        line2: this.generateRandomLineParams(),
      }))
    },

    // 🔥 스크롤 이동 로직
    scrollToSection(id) {
      const el = document.getElementById(id)
      if (el) {
        const offset = 100 // 네비게이션 높이 고려
        const bodyRect = document.body.getBoundingClientRect().top
        const elementRect = el.getBoundingClientRect().top
        const elementPosition = elementRect - bodyRect
        const offsetPosition = elementPosition - offset

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        })
        this.showMenu = false
      }
    },

    // ... 기존 Methods(initPerformanceArtists, formatSlug, getSliceStyle 등) 동일 ...
    initPerformanceArtists() {
      const schedule = [
        { date: 'July 10', names: ['The Great △', 'Jiyoung Wi', 'Container', 'Dayoon Lee'] },
        {
          date: 'July 11',
          names: ['HELM', 'Luciano Maggiore', 'Seiji Morimoto', 'Tzu Ni', 'Eric Wong'],
        },
        {
          date: 'July 17',
          names: ['Yan Jun', 'Nick Klein', 'Audrey Chen', 'dianaband', 'Zhao Ziyi'],
        },
        { date: 'July 18', names: ['Choi Joonyong', 'Evicshen', 'EVOL', 'minsungsig'] },
      ]

      this.performanceDays = schedule.map((day) => {
        const dayArtists = artistsData.filter((a) =>
          day.names.some((name) => a.name_en.includes(name) || a.name_kr.includes(name)),
        )

        const shuffled = dayArtists
          .sort(() => Math.random() - 0.5)
          .map((artist) => ({
            ...artist,
            glitch: {
              split: 35 + Math.random() * 30,
              angle: (Math.random() - 0.5) * 120,
              skewX: (Math.random() - 0.5) * 30,
              dist: -10 + Math.random() * 20,
              lineColor: this.palette[Math.floor(Math.random() * this.palette.length)],
            },
          }))

        return { date: day.date, shuffledArtists: shuffled }
      })
    },

    formatSlug(name) {
      if (!name) return ''
      return encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'))
    },

    getSliceStyle(g, type) {
      const isTop = type === 'top'
      const clip = isTop
        ? `polygon(0 0, 100% 0, 100% ${g.split}%, 0 ${g.split + g.angle}%)`
        : `polygon(0 ${g.split + g.angle}%, 100% ${g.split}%, 100% 100%, 0 100%)`

      return {
        clipPath: clip,
        transform: `translate(${isTop ? -g.dist : g.dist}px, ${isTop ? -g.dist / 2 : g.dist / 2}px) skewX(${isTop ? g.skewX : -g.skewX}deg)`,
        filter: isTop ? 'none' : 'brightness(90%)',
      }
    },

    getArtistLineStyle(g) {
      return {
        top: `${g.split}%`,
        transform: `rotate(${g.angle}deg)`,
        backgroundColor: g.lineColor,
      }
    },

    generateRandomLineParams() {
      return {
        y1: 35 + Math.random() * 30,
        y2: 35 + Math.random() * 30,
        color: this.palette[Math.floor(Math.random() * this.palette.length)],
        weight: (2 + Math.random() * 6).toFixed(1),
        speed: 1 + Math.random() * 50,
        dir: Math.random() > 0.5 ? 1 : -1,
      }
    },

    handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      this.scrollProgress = docHeight > 0 ? scrollTop / docHeight : 0

      // 🔥 이 부분이 있어야 InterventionCanvas가 움직입니다.
      window.aboutScrollProgress = this.scrollProgress
      window.dispatchEvent(new Event('scroll-canvas'))

      // 만약 캔버스 내부에서 'scroll' 자체를 듣고 있다면 아래도 유효합니다.
      // window.dispatchEvent(new Event('scroll'))
    },

    getDividerLineStyle(config) {
      if (!config) return {}
      const moveX = this.scrollProgress * config.speed * config.dir
      return {
        transform: `translateX(${moveX}px)`,
        transition: 'transform 0.1s linear',
      }
    },
  },
}
</script>

<style scoped>
/* 🔥 네비게이션 스타일 */
.program-nav {
  position: fixed;
  top: 30px;
  left: 0;
  width: 100%;
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  z-index: 2000;
  pointer-events: none; /* 컨테이너 자체는 클릭 무시 */
}

.nav-left,
.nav-center {
  pointer-events: auto; /* 버튼들은 클릭 가능하게 */
}

.nav-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.nav-btn {
  background: #000;
  color: #fff;
  padding: 6px 15px;
  font-family: monospace;
  font-size: 0.9rem;
  border: 1px solid #000;
  text-decoration: none;
  cursor: pointer;
  display: inline-block;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: #fff;
  color: #000;
}

/* 드롭다운 스타일 */
.dropdown-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dropdown-content {
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: #fff;
  border: 1px solid #000;
  padding: 5px;
  box-shadow: 10px 10px 0px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
  background: transparent;
  border: none;
  padding: 8px 20px;
  font-family: monospace;
  font-size: 0.85rem;
  text-align: center;
  cursor: pointer;
  white-space: nowrap;
}

.dropdown-item:hover {
  background: #000;
  color: #fff;
}

/* 애니메이션 */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* 기존 스타일 유지 */
.program-container {
  width: 100%;
  background-color: #fff;
  padding-top: 100px; /* 네비게이션 공간 확보 */
}

.program-section {
  max-width: 900px;
  margin: 0 auto;
  padding: 80px 20px;
  scroll-margin-top: 100px; /* scrollTo 시 여백 */
}

/* ... 이하 기존 CSS 동일 ... */
.performance-artists-wrapper {
  margin-top: 40px;
}
.performance-day-group {
  margin-bottom: 10px;
}
.day-title {
  font-family: monospace;
  font-size: 1.2rem;
  font-weight: 900;
  margin-bottom: 10px;
  border-bottom: 2px solid #000;
  display: inline-block;
}
.artist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  padding-bottom: 20px;
}
.artist-card {
  text-decoration: none;
  color: inherit;
  padding-bottom: 10px;
}
.glitch-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: visible;
  margin-bottom: 2px;
}
.slice {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}
.artist-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.artist-card:hover .slice {
  transform: translate(0, 0) skewX(0) !important;
  filter: none !important;
}
.artist-name-main {
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
  text-align: center;
  font-family: monospace;
}
.program-type {
  font-family: monospace;
  font-size: 1.8rem;
  font-weight: 900;
  margin-bottom: 10px;
}
.date-time {
  padding-left: 1rem;
  font-size: 1rem;
  font-weight: 400;
}
.info-group {
  margin-bottom: 25px;
}
.hours-container {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.hours-box {
  border: 1px solid #000;
  padding: 4px 10px;
  border-radius: 2px;
}
.hours {
  font-family: monospace;
  font-size: 0.85rem;
  font-weight: 600;
}
.description {
  font-family: 'Pretendard', sans-serif;
  line-height: 1.8;
  white-space: pre-line;
  word-break: keep-all;
}
.divider-space {
  width: 100vw;
  height: 200px;
  margin: 20px 0;
  mix-blend-mode: difference;
}
.line-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}
</style>
