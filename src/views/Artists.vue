<template>
  <div
    v-if="currentArtist"
    class="artist-explore-container"
    :class="{ 'bio-open': showFullBio }"
    @click="handleGlobalClick"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <!-- 빨간 배경: 검은 선 / 사진 위: difference -->
    <InterventionCanvas
      v-if="currentArtist"
      :key="`lines-under-${currentArtist.id}`"
      :lines-key="currentArtist.id"
      blend-mode="normal"
      stroke-color="#000000"
      stack="under"
    />
    <div class="ui-top-center">
      <div class="ui-btn organic-highlight organic-highlight--btn" :style="lineupBtnOrganic" @click.stop="toggleLineup">
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
    <div
      v-if="!isMobile && !isHoveringButton"
      class="custom-cursor"
      :style="{ left: cursorX + 'px', top: cursorY + 'px' }"
    >
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
          <div class="image-canvas-wrap" aria-hidden="true">
            <InterventionCanvas
              :key="`lines-photo-${currentArtist.id}`"
              :lines-key="currentArtist.id"
              contained
              blend-mode="difference"
              stroke-color="#ffffff"
            />
          </div>
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
              <span class="name-inline organic-highlight organic-highlight--inline" :style="organicTextStyles.name">{{ displayName }}</span>
              <span
                v-for="(para, index) in bioParagraphs"
                :key="`bio-${index}`"
                class="bio-inline"
                :class="{ 'bio-inline--first': index === 0 }"
              >{{ para }}</span>
              <span
                v-if="!showFullBio && isLongBio"
                class="more-btn-inline"
                @click.stop="toggleBio"
              >
                {{ currentLang === 'kr' ? '더보기' : 'more' }}
              </span>
              <span v-if="artistWebsite" class="website-wrap">
                <a
                  class="website-inline organic-highlight organic-highlight--inline"
                  :style="organicTextStyles.website"
                  :href="artistWebsite"
                  target="_blank"
                  rel="noopener noreferrer"
                  @click.stop
                >
                  {{ displayWebsite }}
                </a>
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
import { randomOrganicHighlight, ARTISTS_LINEUP_BTN_ORGANIC } from '@/utils/organicHighlight.js'

export default {
  components: { InterventionCanvas },
  props: ['id'],
  data() {
    return {
      artists: artistsData || [],
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
      isMobile: false,
      touchStartX: 0,
      touchStartY: 0,
      lineupBtnOrganic: ARTISTS_LINEUP_BTN_ORGANIC,
      organicTextStyles: {
        name: randomOrganicHighlight('#000'),
        website: randomOrganicHighlight('#000'),
      },
    }
  },
  computed: {
    bioLimit() {
      return this.isMobile ? 100 : 250
    },
    currentLang() {
      return localeStore.lang
    },
    currentArtist() {
      const routeId = this.id ?? this.$route?.params?.id
      if (!routeId) return null
      const found = this.artists.find((a) => {
        const slug = a.name_en.toLowerCase().trim().replace(/\s+/g, '-')
        return slug === routeId || String(a.id) === String(routeId)
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
    bioParagraphs() {
      const text = this.showFullBio
        ? this.currentFullBio
        : this.isLongBio
          ? `${this.currentFullBio.substring(0, this.bioLimit)}...`
          : this.currentFullBio
      if (!text) return []
      return text
        .split(/\n\s*\n+/)
        .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
        .filter(Boolean)
    },
    isLongBio() {
      return this.currentFullBio && this.currentFullBio.length > this.bioLimit
    },
    artistWebsite() {
      const raw = this.currentArtist?.website?.trim()
      if (!raw) return ''
      if (/^https?:\/\//i.test(raw)) return raw
      return `https://${raw}`
    },
    displayWebsite() {
      const raw = this.currentArtist?.website?.trim()
      if (!raw) return ''
      return raw.replace(/^https?:\/\//i, '')
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
      handler(newId) {
        const routeId = newId ?? this.$route?.params?.id
        if (!routeId || routeId === 'undefined') {
          this.goToRandomArtist()
          return
        }
        this.setRandomState()
        this.showFullBio = false
        this.isHoveringButton = false
        this.refreshOrganicStyles()
      },
      immediate: true,
    },
  },
  mounted() {
    this.checkMobile()
    this.setRandomState()
    this.refreshOrganicStyles()
    if (!this.isMobile) {
      window.addEventListener('mousemove', this.updateCursor)
    }
    window.addEventListener('resize', this.checkMobile)
  },
  beforeUnmount() {
    window.removeEventListener('mousemove', this.updateCursor)
    window.removeEventListener('resize', this.checkMobile)
  },
  methods: {
    checkMobile() {
      const next = window.innerWidth < 768
      if (next !== this.isMobile) {
        if (next) {
          window.removeEventListener('mousemove', this.updateCursor)
        } else {
          window.addEventListener('mousemove', this.updateCursor)
        }
      }
      this.isMobile = next
    },
    updateCursor(e) {
      requestAnimationFrame(() => {
        this.cursorX = e.clientX
        this.cursorY = e.clientY
        if (!this.isMobile) {
          this.isHoveringButton = !!e.target.closest(
            '.ui-btn, .more-btn-inline, .close-x-btn, .random-name-item, .nav-btn, .website-inline, .website-wrap',
          )
        }
      })
    },
    goToRandomArtist() {
      const randomIndex = Math.floor(Math.random() * this.artists.length)
      const target = this.artists[randomIndex]
      const targetSlug = target.name_en.toLowerCase().trim().replace(/\s+/g, '-')
      this.$router.replace(`/artists/${targetSlug}`)
    },
    refreshOrganicStyles() {
      this.organicTextStyles = {
        name: randomOrganicHighlight('#000'),
        website: randomOrganicHighlight('#000'),
      }
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
    onTouchStart(e) {
      if (!this.isMobile) return
      const touch = e.touches?.[0]
      if (!touch) return
      this.touchStartX = touch.clientX
      this.touchStartY = touch.clientY
    },
    onTouchEnd(e) {
      if (!this.isMobile || this.showLineup || this.showFullBio) return
      if (e.target.closest('.ui-btn, .more-btn-inline, .close-x-btn, .random-name-item, .website-inline, .nav-btn, a')) {
        return
      }
      const touch = e.changedTouches?.[0]
      if (!touch) return
      const dx = touch.clientX - this.touchStartX
      const dy = touch.clientY - this.touchStartY
      const minSwipe = 48
      if (Math.abs(dx) < minSwipe || Math.abs(dx) < Math.abs(dy) * 1.2) return
      const direction = dx < 0 ? 1 : -1
      this.goToAdjacentArtist(direction)
    },
    goToAdjacentArtist(direction) {
      if (!this.artists.length) return
      const nextIdx =
        (this.currentIndex + direction + this.artists.length) % this.artists.length
      this.nextArtist(nextIdx)
    },
    handleGlobalClick() {
      if (this.showLineup) {
        this.showLineup = false
        return
      }
      if (this.showFullBio) {
        this.showFullBio = false
        return
      }
      if (this.isMobile) return
      if (!this.isHoveringButton) {
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
  height: calc(var(--app-vh, 1vh) * 100);
  background: #ffff00;
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
  color: #fff;
  padding: 6px 15px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.ui-btn:hover {
  color: #000;
}
.ui-btn.organic-highlight:hover::before {
  background: #fff;
}

/* 이하 기존 스타일과 동일 */
.lineup-random-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: calc(var(--app-vh, 1vh) * 100);
  background: rgba(255, 255, 255, 0.97);
  z-index: 1100;
  cursor: none !important;
}

.random-name-item {
  position: absolute;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
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
  background: transparent;
  box-shadow: none;
}

.text-content {
  font-size: 1rem;
  line-height: 1.5rem;
  color: #fff;
  pointer-events: auto;
}
.highlight-wrapper {
  display: inline;
}
.name-inline,
.website-inline {
  color: #fff;
  padding: 0.12em 0.28em;
}
.bio-inline,
.more-btn-inline {
  background: #000;
  color: #fff;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
  padding: 0.12em 0.28em;
}
.website-wrap {
  display: block;
  margin-top: 1.5rem;
}
.website-inline {
  display: inline;
  font-size: 0.85rem;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}
.more-btn-inline {
  position: relative;
  display: inline-block;
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-decoration: underline;
  margin-left: 8px;
  cursor: pointer;
  color: inherit;
  transition: color 0.2s;
  padding: 0 2px;
}
.more-btn-inline::before {
  content: '';
  position: absolute;
  top: -0.65em;
  right: -0.75em;
  bottom: -0.65em;
  left: -0.75em;
}
.name-inline {
  font-weight: bold;
  text-transform: uppercase;
  font-size: 1.2rem;
}
.bio-inline {
  display: inline;
  margin-left: 0;
}
.bio-inline--first {
  margin-left: 0.45em;
}
.bio-inline + .bio-inline::before {
  content: '\A';
  white-space: pre;
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
.image-box {
  position: relative;
  display: inline-block;
  line-height: 0;
  isolation: isolate;
}
.image-canvas-wrap {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.image-box img {
  max-width: 90vw;
  max-height: 90vh;
  min-width: 50vw;
  object-fit: contain;
}

.close-x-btn {
  position: sticky;
  top: 0;
  float: right;
  padding: 10px;
  cursor: pointer;
  z-index: 30;
  background: #000;
  color: #fff;
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
  width: 0;
  height: 0;
  pointer-events: none;
  z-index: 100000;
  mix-blend-mode: difference;
  backface-visibility: hidden;
}
.arrow-rotate-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  transform-origin: 0 0;
}
.arrow-center-wrapper {
  position: relative;
  width: 0;
  height: 0;
}
.long-stroke {
  width: 400px;
  height: 1.2px;
  background: #fff;
  position: absolute;
  left: 0;
  top: 0;
  transform: translate(-400px, -50%);
}
.arrow-tip {
  width: 24px;
  height: 10px;
  background: #fff;
  position: absolute;
  left: 0;
  top: 0;
  transform: translate(-100%, -50%);
  clip-path: polygon(0% 15%, 100% 50%, 0% 85%);
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
  .artist-explore-container {
    cursor: auto !important;
  }

  .ui-btn,
  .lineup-random-overlay,
  .random-name-item,
  .more-btn-inline,
  .close-x-btn,
  .website-inline {
    cursor: pointer !important;
  }

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

  .name-inline {
    display: inline;
    margin-bottom: 0;
  }

  .name-inline::after {
    content: '\A';
    white-space: pre;
  }

  .bio-inline {
    display: inline;
    margin-left: 0;
  }

  .bio-inline--first {
    margin-left: 0;
  }

  .bio-inline + .bio-inline::before {
    content: '\A';
    white-space: pre;
  }

  .info-layer-wide.expanded {
    background: transparent;
    padding: 20px 0;
  }
}
</style>
