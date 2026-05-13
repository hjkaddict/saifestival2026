<template>
  <div
    v-if="currentArtist"
    class="artist-explore-container"
    :class="{ 'bio-open': showFullBio }"
    @click="handleGlobalClick"
  >
    <!-- 배경 잔상 레이어 -->
    <div class="bg-image-layer" v-if="previousArtist">
      <img :src="previousArtist.img" alt="background-trace" />
      <div class="bg-overlay"></div>
    </div>

    <!-- 캔버스 레이어 -->
    <div class="canvas-bg">
      <InterventionCanvas :key="currentArtist.id" ref="bgCanvas" :isPaused="true" />
    </div>

    <div class="ui-top-center">
      <div class="ui-btn" @click.stop="toggleLineup">
        {{ ui.lineupBtn }}
      </div>
    </div>

    <!-- 라인업 오버레이 -->
    <transition name="fade">
      <div v-if="showLineup" class="lineup-random-overlay" @click.stop="showLineup = false">
        <div
          v-for="(artist, index) in randomLineupItems"
          :key="artist.id"
          class="random-name-item"
          :class="{ active: currentArtist.id === artist.id }"
          :style="artist.style"
          @click.stop="jumpToArtist(artist.originalIndex)"
        >
          {{ currentLang === 'kr' ? artist.name_kr : artist.name_en }}
        </div>
      </div>
    </transition>

    <!-- 커스텀 커서 -->
    <div class="custom-cursor" :style="{ left: cursorX + 'px', top: cursorY + 'px' }">
      <div class="arrow-rotate-layer" :style="{ transform: `rotate(${currentAngle}deg)` }">
        <div class="arrow-center-wrapper">
          <div class="long-stroke"></div>
          <!-- 화살표 머리 -->
          <div class="arrow-tip"></div>
        </div>
      </div>
    </div>

    <!-- 아티스트 메인 스테이지 -->
    <transition :name="animMode">
      <div :key="currentArtist.id" class="artist-stage" :style="dynamicStyles">
        <div class="image-box">
          <img :src="currentArtist.img" :alt="currentArtist.name_en" />
        </div>

        <div
          class="info-layer-wide"
          :class="{ expanded: showFullBio }"
          :style="[
            randomInfoPos,
            { transform: showFullBio ? 'rotate(0deg)' : `rotate(${randomRotation}deg)` },
          ]"
          @click.stop
        >
          <div v-if="showFullBio" class="close-x-btn" @click.stop="toggleBio">
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              stroke-width="1.5"
              fill="none"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>

          <div class="text-content">
            <span class="highlight-wrapper">
              <span class="name-inline">{{ displayName }}</span
              ><br />
              <span class="bio-inline">{{ displayBio }}</span>
              <span
                v-if="!showFullBio && isLongBio"
                class="more-btn-inline"
                @click.stop="toggleBio"
              >
                {{ currentLang === 'kr' ? '더보기' : 'more' }}
              </span>
            </span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { artistsData } from '@/assets/data/artists.js'
import InterventionCanvas from '@/components/InterventionCanvas.vue'
import { localeStore } from '@/store/locale'

export default {
  components: { InterventionCanvas },
  props: ['id'],
  data() {
    return {
      artists: artistsData || [],
      previousArtist: null,
      cursorX: 0,
      cursorY: 0,
      currentAngle: Math.random() * 360,
      moveX: 0,
      moveY: 0,
      animMode: 'artist-move',
      showFullBio: false,
      showLineup: false,
      randomLineupItems: [],
      isHoveringButton: false,
      randomInfoPos: {},
      randomRotation: 0,
      bioLimit: 250,
    }
  },
  computed: {
    currentLang() {
      return localeStore.lang
    },
    currentArtist() {
      const found = this.artists.find((a) => {
        const slug = a.name_en.toLowerCase().trim().replace(/\s+/g, '-')
        return slug === this.id || String(a.id) === String(this.id)
      })
      return found || null
    },
    currentIndex() {
      return this.artists.findIndex((a) => a.id === this.currentArtist.id)
    },
    currentFullBio() {
      return this.currentLang === 'kr' ? this.currentArtist.bio_kr : this.currentArtist.bio_en
    },
    displayName() {
      return this.currentLang === 'kr' ? this.currentArtist.name_kr : this.currentArtist.name_en
    },
    displayBio() {
      if (this.showFullBio) return this.currentFullBio
      if (this.isLongBio) return this.currentFullBio.substring(0, this.bioLimit) + '...'
      return this.currentFullBio
    },
    isLongBio() {
      return this.currentFullBio && this.currentFullBio.length > this.bioLimit
    },
    // 🔥 UI 다국어 텍스트: MAIN 추가
    ui() {
      return {
        mainBtn: this.currentLang === 'kr' ? '메인' : 'MAIN',
        lineupBtn: this.currentLang === 'kr' ? '라인업' : 'LINE-UP',
        moreBtn: this.currentLang === 'kr' ? '[ 더보기 ]' : '[ MORE ]',
        closeBtn: this.currentLang === 'kr' ? '[ 닫기 ]' : '[ CLOSE ]',
      }
    },
    dynamicStyles() {
      return {
        '--move-x': `${this.moveX}px`,
        '--move-y': `${this.moveY}px`,
        '--enter-x': `${-this.moveX}px`,
        '--enter-y': `${-this.moveY}px`,
      }
    },
  },
  watch: {
    id: {
      handler(newId, oldId) {
        if (!newId || newId === 'undefined') {
          this.goToRandomArtist()
          return
        }
        if (oldId && oldId !== 'undefined') {
          const prev = this.artists.find((a) => {
            const slug = a.name_en.toLowerCase().trim().replace(/\s+/g, '-')
            return slug === oldId || String(a.id) === String(oldId)
          })
          if (prev) this.previousArtist = prev
        } else {
          const currentIdx = this.artists.findIndex(
            (a) => a.name_en.toLowerCase().trim().replace(/\s+/g, '-') === newId,
          )
          const otherArtists = this.artists.filter((_, idx) => idx !== currentIdx)
          this.previousArtist = otherArtists[Math.floor(Math.random() * otherArtists.length)]
        }
        this.setRandomState()
        this.showFullBio = false
        this.isHoveringButton = false
      },
      immediate: true,
    },
  },
  mounted() {
    this.setRandomState()
    window.addEventListener('mousemove', this.updateCursor)
  },
  beforeUnmount() {
    window.removeEventListener('mousemove', this.updateCursor)
  },
  methods: {
    updateCursor(e) {
      requestAnimationFrame(() => {
        this.cursorX = e.clientX
        this.cursorY = e.clientY
      })
    },
    goToRandomArtist() {
      const randomIndex = Math.floor(Math.random() * this.artists.length)
      const target = this.artists[randomIndex]
      const targetSlug = target.name_en.toLowerCase().trim().replace(/\s+/g, '-')
      this.$router.replace(`/artists/${targetSlug}`)
    },
    setRandomState() {
      const positions = [
        { top: '15%', left: '5%' },
        { top: '60%', left: '5%' },
        { bottom: '25%', left: '5%' },
      ]
      this.randomInfoPos = positions[Math.floor(Math.random() * positions.length)]
      this.randomRotation = (Math.random() * 8 - 4).toFixed(1)
    },
    toggleLineup() {
      if (!this.showLineup) this.generateNonOverlappingLineup()
      this.showLineup = !this.showLineup
    },
    generateNonOverlappingLineup() {
      const isMobile = window.innerWidth < 768
      const cols = isMobile ? 2 : 4
      const rows = Math.ceil(this.artists.length / cols)
      const cellW = 80 / cols
      const cellH = 70 / rows
      const artistPool = this.artists.map((a, idx) => ({ ...a, originalIndex: idx }))
      const shuffled = artistPool.sort(() => Math.random() - 0.5)

      this.randomLineupItems = shuffled.map((artist, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        const top = 15 + row * cellH + Math.random() * (cellH * 0.4)
        const left = 10 + col * cellW + Math.random() * (cellW * 0.4)
        const rot = Math.random() * 20 - 10
        return {
          ...artist,
          style: {
            top: `${top}%`,
            left: `${left}%`,
            transform: `rotate(${rot}deg)`,
            fontSize: isMobile ? '1.1rem' : '1.6rem',
          },
        }
      })
    },
    toggleBio() {
      this.showFullBio = !this.showFullBio
    },
    handleGlobalClick() {
      if (this.showLineup) {
        this.showLineup = false
        return
      }
      if (!this.isHoveringButton) {
        if (this.showFullBio) {
          this.showFullBio = false
          return
        }
        this.nextArtist()
      }
    },
    jumpToArtist(index) {
      this.showLineup = false
      this.nextArtist(index)
    },
    nextArtist(targetIdx = null) {
      let nextIdx
      if (targetIdx !== null) {
        nextIdx = targetIdx
      } else {
        const otherIndices = this.artists
          .map((_, idx) => idx)
          .filter((idx) => idx !== this.currentIndex)
        nextIdx = otherIndices[Math.floor(Math.random() * otherIndices.length)]
      }
      const target = this.artists[nextIdx]
      const targetSlug = target.name_en.toLowerCase().trim().replace(/\s+/g, '-')
      const distance = Math.max(window.innerWidth, window.innerHeight)
      const rad = (this.currentAngle * Math.PI) / 180
      this.moveX = Math.cos(rad) * distance
      this.moveY = Math.sin(rad) * distance
      this.$router.push(`/artists/${targetSlug}`)
      this.currentAngle = Math.random() * 360
    },
  },
}
</script>

<style scoped>
/* 기존 스타일 유지 및 신규 UI 스타일 추가 */
.artist-explore-container {
  width: 100vw;
  height: 100vh;
  background: #fff;
  overflow: hidden;
  cursor: none !important;
  position: relative;
}

/* 상단 버튼 공통 레이아웃 */
.ui-top-left {
  position: fixed;
  top: 30px;
  left: 30px;
  z-index: 1200;
}

.ui-top-center {
  position: fixed;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1200;
}

/* 버튼 스타일 (LINE-UP과 동일) */
.ui-btn {
  background: #000;
  color: #fff;
  padding: 6px 15px;
  font-family: monospace;
  font-size: 0.9rem;
  cursor: none !important;
  border: 1px solid #000;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.ui-btn:hover {
  background: #fff;
  color: #000;
}

/* 이하 기존 스타일과 동일 */
.lineup-random-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.97);
  z-index: 1100;
  cursor: none !important;
}

.random-name-item {
  position: absolute;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  text-transform: uppercase;
  cursor: none !important;
  white-space: nowrap;
  transition: all 0.3s ease;
  padding: 5px;
  opacity: 0.4;
  color: #000;
}

.random-name-item.active {
  opacity: 1;
  color: #ff3300;
  font-size: 1.25em;
  z-index: 100;
  text-decoration: underline;
  text-underline-offset: 8px;
  text-decoration-thickness: 2px;
}

.random-name-item:hover {
  opacity: 1;
  color: #ff3300;
  transform: scale(1.1) rotate(0deg) !important;
}

.bg-image-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}
.bg-image-layer img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(1.1);
  opacity: 0.9;
}
.bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
}
.canvas-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 50;
  pointer-events: none;
  mix-blend-mode: multiply;
  opacity: 0.5;
}

.info-layer-wide {
  position: absolute;
  z-index: 25;
  width: 90vw;
  max-height: 180px;
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1);
  pointer-events: none;
}
.info-layer-wide.expanded {
  top: 80px !important;
  left: 5vw !important;
  width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
  pointer-events: auto;
  padding: 20px;
  background: #fff;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
}

.text-content {
  font-size: 1rem;
  line-height: 1.5rem;
  color: #000;
  pointer-events: auto;
}
.highlight-wrapper {
  display: inline;
}
.name-inline,
.bio-inline,
.more-btn-inline {
  background: #fff;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
  padding: 3px 0;
}
.more-btn-inline {
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-decoration: underline;
  margin-left: 8px;
  cursor: none !important;
  color: #666;
  transition: color 0.2s;
  background: #fff;
  padding: 0 2px;
}
.name-inline {
  font-weight: bold;
  text-transform: uppercase;
  font-size: 1.2rem;
}
.bio-inline {
  opacity: 0.9;
  white-space: pre-line;
}

.artist-stage {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}
.image-box img {
  max-width: 90vw;
  max-height: 90vh;
  min-width: 50vw;
  object-fit: contain;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
}

.close-x-btn {
  position: sticky;
  top: 0;
  float: right;
  padding: 10px;
  cursor: none !important;
  z-index: 30;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}
.close-x-btn:hover {
  transform: rotate(90deg);
}

.custom-cursor {
  position: fixed;
  pointer-events: none;
  z-index: 100000;
  mix-blend-mode: difference;
  display: flex;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
}
.arrow-rotate-layer {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 0;
  height: 0;
}
.arrow-center-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}
.long-stroke {
  /* 선의 길이는 유지하되 두께를 살짝 조절 가능 (1px~1.5px) */
  width: 400px;
  height: 1.2px;
  background: #fff;
  /* 선의 중심을 맞추기 위해 왼쪽으로 절반 이동 */
  transform: translateX(-200px);
}
.arrow-tip {
  /* 삼각형 크기 조정: 가로(width)를 늘려 더 뾰족하게, 세로(height)를 줄여 얇게 */
  width: 24px; /* 삼각형의 길이 (더 크게) */
  height: 10px; /* 삼각형의 폭 (더 얇게) */
  background: #fff;

  /* 선의 끝점(200px)에 정확히 맞물리도록 배치 */
  position: absolute;
  left: 200px;

  /* 날카로운 삼각형을 위한 새로운 좌표 */
  /* 0% 0%(위), 100% 50%(끝점), 0% 100%(아래) */
  clip-path: polygon(0% 15%, 100% 50%, 0% 85%);

  /* 미세하게 선과 어긋난다면 상단 마진으로 보정 */
  margin-top: 0px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.artist-move-enter-active,
.artist-move-leave-active {
  transition: all 1s cubic-bezier(0.19, 1, 0.22, 1);
}
.artist-move-leave-to {
  opacity: 0;
  transform: translate(var(--move-x), var(--move-y));
}
.artist-move-enter-from {
  opacity: 0;
  transform: translate(var(--enter-x), var(--enter-y));
}

@media (max-width: 768px) {
  .ui-top-left {
    top: 20px;
    left: 20px;
  }
  .ui-top-center {
    top: 20px;
  }
  .image-box img {
    max-width: 90vw;
    max-height: 60vh;
  }
}
</style>
