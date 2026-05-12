<template>
  <div class="program-container">
    <div class="program-list">
      <template v-for="(pgm, index) in shuffledPrograms" :key="index">
        <section class="program-section">
          <!-- 기존 메타 정보 -->
          <div class="program-meta">
            <h2 class="program-type">
              <span v-html="pgm.data.title[locale.lang]"></span>
              <span
                class="date-time"
                v-html="pgm.data.period ? pgm.data.period[locale.lang] : pgm.data.date[locale.lang]"
              ></span>
            </h2>
            <div class="info-group">
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

          <!-- 기존 설명 -->
          <div class="program-content">
            <p
              class="description"
              v-html="pgm.data.description[locale.lang] || pgm.data.description['kr']"
            ></p>
          </div>

          <!-- 🔥 추가: 퍼포먼스 프로그램일 경우 아티스트 리스트 출력 -->
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
                    <!-- 🔥 원본 사진(base) 제거됨 -->

                    <!-- 깨진 조각 1: 위쪽 -->
                    <div class="slice top" :style="getSliceStyle(artist.glitch, 'top')">
                      <img :src="artist.img" class="artist-img" />
                    </div>

                    <!-- 깨진 조각 2: 아래쪽 -->
                    <div class="slice bottom" :style="getSliceStyle(artist.glitch, 'bottom')">
                      <img :src="artist.img" class="artist-img" />
                    </div>

                    <!-- 이미지를 가르는 날카로운 랜덤 선 -->
                    <div class="glitch-line" :style="getLineStyle(artist.glitch)"></div>
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

        <!-- 구분선 -->
        <div v-if="index < shuffledPrograms.length - 1" class="divider-space">
          <svg class="line-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line
              x1="0"
              :y1="lineConfigs[index]?.line1.y1"
              x2="100"
              :y2="lineConfigs[index]?.line1.y2"
              :stroke="lineConfigs[index]?.line1.color"
              :stroke-width="lineConfigs[index]?.line1.weight"
              :style="getLineStyle(lineConfigs[index]?.line1)"
            />
            <line
              x1="0"
              :y1="lineConfigs[index]?.line2.y1"
              x2="100"
              :y2="lineConfigs[index]?.line2.y2"
              :stroke="lineConfigs[index]?.line2.color"
              :stroke-width="lineConfigs[index]?.line2.weight"
              :style="getLineStyle(lineConfigs[index]?.line2)"
            />
          </svg>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { localeStore } from '@/store/locale.js'
import { programExhibition } from '@/assets/data/program_exhibition.js'
import { programPerformance } from '@/assets/data/program_performance.js'
import { programWorkshop } from '@/assets/data/program_workshop.js'
import { artistsData } from '@/assets/data/artists.js' // 아티스트 데이터 임포트

export default {
  name: 'Program',
  data() {
    return {
      locale: localeStore,
      shuffledPrograms: [],
      lineConfigs: [],
      scrollProgress: 0,
      palette: ['#FF0000', '#FFA500', '#FFFF00', '#00FF00', '#FFC0CB'],
      performanceDays: [], // 날짜별 셔플된 아티스트 저장
    }
  },
  mounted() {
    this.initPrograms()
    this.initPerformanceArtists() // 아티스트 초기화
    window.addEventListener('scroll', this.handleScroll)
    this.handleScroll()
  },
  methods: {
    initPrograms() {
      const baseData = [
        { data: programExhibition, isPerformance: false },
        { data: programPerformance, isPerformance: true }, // 퍼포먼스 체크
        { data: programWorkshop, isPerformance: false },
      ]
      this.shuffledPrograms = baseData.sort(() => Math.random() - 0.5)

      this.lineConfigs = Array.from({ length: this.shuffledPrograms.length - 1 }, () => ({
        line1: this.generateRandomLineParams(),
        line2: this.generateRandomLineParams(),
      }))
    },
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
              angle: (Math.random() - 0.5) * 25,
              skewX: (Math.random() - 0.5) * 30,
              // 🔥 간격 범위를 -10px에서 +20px 사이 랜덤으로 설정
              dist: -10 + Math.random() * 30,
              lineColor: this.palette[Math.floor(Math.random() * this.palette.length)],
            },
          }))

        return { date: day.date, shuffledArtists: shuffled }
      })
    },

    getSliceStyle(g, type) {
      const isTop = type === 'top'
      const clip = isTop
        ? `polygon(0 0, 100% 0, 100% ${g.split}%, 0 ${g.split + g.angle}%)`
        : `polygon(0 ${g.split + g.angle}%, 100% ${g.split}%, 100% 100%, 0 100%)`

      return {
        clipPath: clip,
        // 벌어지는 간격을 적용
        transform: `translate(${isTop ? -g.dist : g.dist}px, ${isTop ? -g.dist / 2 : g.dist / 2}px) skewX(${isTop ? g.skewX : -g.skewX}deg)`,
        filter: isTop ? 'none' : 'brightness(90%)',
      }
    },

    getLineStyle(g) {
      return {
        top: `${g.split}%`,
        transform: `rotate(${g.angle}deg)`,
        backgroundColor: g.lineColor,
      }
    },

    formatSlug(name) {
      return name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '')
    },
    // ... (기존 generateRandomLineParams, handleScroll, getLineStyle 로직 유지)
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
    },
    getLineStyle(config) {
      if (!config) return {}
      const moveX = this.scrollProgress * config.speed * config.dir
      return {
        transform: `translateX(${moveX}px)`,
        transition: 'transform 0.1s linear',
        willChange: 'transform',
      }
    },
  },
}
</script>

<style scoped>
/* 기존 스타일 유지 */
.glitch-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: visible;
  margin-bottom: 25px;
  background-color: transparent; /* 배경 사진 제거됨 */
}

.slice {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.program-container {
  width: 100%;
  background-color: #fff;
  overflow-x: hidden;
}
.program-section {
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 20px;
}
.divider-space {
  width: 100vw;
  height: 200px;
  margin: 20px 0;
  mix-blend-mode: difference;
  pointer-events: none;
  display: flex;
  align-items: center;
}
.line-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* 🔥 추가: 아티스트 리스트 스타일 */
.performance-artists-wrapper {
  margin-top: 10px;
  padding-top: 10px;
}
.performance-day-group {
  margin-bottom: 10px;
}
.day-title {
  font-family: monospace;
  font-size: 1.2rem;
  font-weight: 900;
  margin-bottom: 25px;
  border-bottom: 2px solid #000;
  display: inline-block;
}
.artist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0px;
}
.artist-card {
  text-decoration: none;
  color: inherit;
  transition: opacity 0.3s ease;
}
.artist-card:hover {
  opacity: 0.7;
}

.artist-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
/* 호버 시 파편이 완벽하게 결합됨 */
.artist-card:hover .slice {
  transform: translate(0, 0) skewX(0) !important;
  filter: none !important;
  z-index: 20;
}
.artist-name-main {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}

/* 박스/타이틀 스타일 등 기존 유지... */
.hours-box {
  border: 1px solid #000;
  padding: 4px 10px;
  border-radius: 2px;
  display: inline-flex;
  align-items: center;
}
.hours-container {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.hours {
  font-family: monospace;
  font-size: 0.85rem;
  font-weight: 600;
  color: #000;
  white-space: nowrap;
}
.glitch-line {
  position: absolute;
  left: -5%;
  width: 110%;
  height: 1.5px;
  z-index: 10;
  mix-blend-mode: difference;
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
.description {
  font-family: 'Pretendard', sans-serif;
  line-height: 1.8;
  white-space: pre-line;
  word-break: keep-all;
}
</style>
