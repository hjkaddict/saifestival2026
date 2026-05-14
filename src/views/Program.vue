<template>
  <div class="program-container">
    <!-- 🔥 상단 고정 네비게이션 UI -->
    <nav class="program-nav">
      <!-- 중앙: 프로그램 드롭다운 메뉴 -->
      <div class="nav-center">
        <div
          ref="dropdownRef"
          class="dropdown-wrapper"
          @mouseenter="onDropdownEnter"
          @mouseleave="onDropdownLeave"
        >
          <button type="button" class="nav-btn main-label" @click.stop="toggleProgramMenu">
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
              <span class="program-title" v-html="pgm.data.title[locale.lang]"></span>
            </h2>
            <p
              v-if="pgm.data.period || pgm.data.date"
              class="program-date"
              v-html="pgm.data.period ? pgm.data.period[locale.lang] : pgm.data.date[locale.lang]"
            ></p>

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
                    <p class="artist-name-main" :style="getArtistNameStyle(artist.glitch)">
                      {{ locale.lang === 'en' ? artist.name_en : artist.name_kr }}
                    </p>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </section>

        <!-- 섹션 사이 구분선 -->
        <div
          v-if="index < shuffledPrograms.length - 1"
          class="divider-space"
          :data-divider-idx="index"
        >
          <svg class="line-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line
              x1="0"
              :y1="lineConfigs[index]?.line1.y1"
              x2="100"
              :y2="lineConfigs[index]?.line1.y2"
              :stroke="lineConfigs[index]?.line1.color"
              :stroke-width="lineConfigs[index]?.line1.weight"
              :style="getDividerLineStyle(lineConfigs[index]?.line1, index)"
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
      dividerProgress: [],
      isMobile: false,
      palette: ['#FF0000', '#FFA500', '#FFFF00', '#00FF00', '#FFC0CB'],
      performanceDays: [],
      showMenu: false, // 드롭다운 노출 여부
    }
  },
  mounted() {
    this.checkMobile()
    this.initPrograms()
    this.initPerformanceArtists()
    window.addEventListener('scroll', this.handleScroll, { passive: true })
    window.addEventListener('resize', this.onViewportChange)
    document.addEventListener('click', this.onDocumentClick)
    this.handleScroll()
    this.$nextTick(() => this.updateStickyOffsets())
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('resize', this.onViewportChange)
    document.removeEventListener('click', this.onDocumentClick)
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth < 768
    },
    onViewportChange() {
      this.checkMobile()
      this.updateStickyOffsets()
    },
    updateStickyOffsets() {
      const root = this.$el
      if (!root) return

      const stickyTop = this.isMobile ? 72 : 88
      root.style.setProperty('--program-sticky-top', `${stickyTop}px`)

      if (!this.isMobile) {
        root.style.removeProperty('--day-title-sticky-top')
        this.clearDayTitlePastState()
        return
      }

      const perfSection = root.querySelector('.performance-artists-wrapper')?.closest('.program-section')
      const perfMeta = perfSection?.querySelector('.program-meta')
      const metaHeight = perfMeta?.getBoundingClientRect().height ?? 0

      root.style.setProperty('--day-title-sticky-top', `${stickyTop + metaHeight}px`)
      this.updateDayTitleStickyState()
    },
    clearDayTitlePastState() {
      this.$el?.querySelectorAll('.day-title--past').forEach((el) => {
        el.classList.remove('day-title--past')
      })
    },
    updateDayTitleStickyState() {
      const root = this.$el
      if (!root || !this.isMobile) {
        this.clearDayTitlePastState()
        return
      }

      const stickyTop = parseFloat(
        getComputedStyle(root).getPropertyValue('--day-title-sticky-top'),
      )
      if (!Number.isFinite(stickyTop)) return

      root.querySelectorAll('.performance-day-group').forEach((group) => {
        const title = group.querySelector('.day-title')
        const lastImage = group.querySelector('.artist-card:last-child .glitch-wrapper')
        if (!title || !lastImage) return

        const lastImageBottom = lastImage.getBoundingClientRect().bottom
        title.classList.toggle('day-title--past', lastImageBottom <= stickyTop)
      })
    },
    toggleProgramMenu() {
      this.showMenu = !this.showMenu
    },
    onDropdownEnter() {
      if (!this.isMobile) this.showMenu = true
    },
    onDropdownLeave() {
      if (!this.isMobile) this.showMenu = false
    },
    onDocumentClick(e) {
      if (!this.showMenu) return
      const wrap = this.$refs.dropdownRef
      if (wrap && !wrap.contains(e.target)) {
        this.showMenu = false
      }
    },
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
      this.dividerProgress = Array.from({ length: this.lineConfigs.length }, () => 0)
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
              nameRotate: -15 + Math.random() * 30,
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

    getArtistNameStyle(g) {
      return {
        transform: `rotate(${g.nameRotate}deg)`,
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

      window.aboutScrollProgress = this.scrollProgress
      window.dispatchEvent(new Event('scroll-canvas'))

      this.updateDividerProgress()
      this.updateDayTitleStickyState()
    },

    updateDividerProgress() {
      const dividers = this.$el?.querySelectorAll('.divider-space') || []
      const vh = window.innerHeight

      dividers.forEach((el, idx) => {
        const rect = el.getBoundingClientRect()
        const visible = Math.min(rect.bottom, vh) - Math.max(rect.top, 0)
        const ratio = visible / Math.max(rect.height, 1)
        const clamped = Math.max(0, Math.min(1, ratio))
        const centerDist = Math.abs(rect.top + rect.height / 2 - vh * 0.5) / (vh * 0.5)
        const centerBoost = Math.max(0, 1 - centerDist)
        this.dividerProgress[idx] = clamped * centerBoost
      })
    },

    getDividerLineStyle(config, index) {
      if (!config) return {}
      const vis = this.dividerProgress[index] ?? 0
      const speedMult = this.isMobile ? 4.5 : 1.2
      const moveX = vis * config.speed * config.dir * speedMult
      const scaleX = 0.04 + vis * 0.96
      return {
        transform: `translateX(${moveX}px) scaleX(${scaleX})`,
        transformOrigin: 'center center',
        opacity: 0.15 + vis * 0.85,
        transition: 'transform 0.12s linear, opacity 0.12s linear',
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
  flex-shrink: 0;
}

.dropdown-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.nav-btn {
  background: #000;
  color: #fff;
  padding: 6px 12px;
  font-size: 0.9rem;
  border: 1px solid #000;
  text-decoration: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: auto;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: #fff;
  color: #000;
}

/* 드롭다운 스타일 */
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
  padding-top: 100px;
  overflow: visible;
}

.program-section {
  max-width: 900px;
  margin: 0 auto;
  padding: 80px 20px;
  scroll-margin-top: 100px;
  text-align: center;
  overflow: visible;
}

.program-list {
  overflow: visible;
}

.program-meta {
  width: fit-content;
  max-width: 100%;
  margin: 0 auto 1rem;
  background: #fff;
  padding: 6px 12px;
}

.program-meta .program-type {
  margin: 0 0 0.2rem;
}

.program-meta .program-date {
  margin: 0 0 0.35rem;
  line-height: 1.35;
}

.program-meta .info-group {
  margin-bottom: 0;
}

.program-meta .hours-container {
  gap: 4px;
}

.program-content {
  text-align: center;
}

/* ... 이하 기존 CSS 동일 ... */
.performance-artists-wrapper {
  margin-top: 40px;
  text-align: center;
}
.performance-day-group {
  margin-bottom: 10px;
  overflow: visible;
}
.day-title {
  font-size: 1.2rem;
  font-weight: 900;
  margin: 0 auto 10px;
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
  display: inline-block;
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
  text-align: center;
  transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}
.artist-card:hover .artist-name-main {
  transform: rotate(0deg) !important;
}
.program-type {
  font-size: 1.8rem;
  font-weight: 900;
  margin: 0 0 0.5rem;
}

.program-title {
  display: block;
}

.program-date {
  font-size: 1rem;
  font-weight: 400;
  margin: 0 0 0.75rem;
  line-height: 1.5;
}

.info-group {
  margin-bottom: 25px;
}

.hours-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.hours-box {
  border: 1px solid #000;
  padding: 4px 10px;
  border-radius: 2px;
}
.hours {
  font-size: 0.85rem;
  font-weight: 600;
}
.description {
  line-height: 1.8;
  white-space: pre-line;
  word-break: keep-all;
  text-align: center;
}
.divider-space {
  width: 100vw;
  height: 200px;
  margin: 20px 0;
  mix-blend-mode: difference;
}
@media (max-width: 768px) {
  .program-nav {
    top: 20px;
    padding: 0 20px;
  }

  .program-container {
    padding-top: 88px;
  }

  .program-section {
    padding-top: 48px;
    padding-bottom: 48px;
  }

  .program-meta {
    position: sticky;
    top: var(--program-sticky-top, 72px);
    z-index: 1500;
    margin-bottom: 0.75rem;
    padding: 5px 10px;
  }

  .program-section:has(.performance-artists-wrapper) .program-meta {
    margin-bottom: 0;
  }

  .day-title {
    position: sticky;
    top: var(--day-title-sticky-top, 13rem);
    z-index: 1400;
    width: fit-content;
    max-width: 100%;
    margin: 0 auto 8px;
    padding: 4px 10px;
    background: #fff;
  }

  .day-title--past {
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
  }
}

.line-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}
</style>
