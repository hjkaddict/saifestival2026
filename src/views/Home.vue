<template>
  <div class="menu-universe" ref="universe" :style="universeStyle">
    <figure
      class="entry-shard"
      :class="{ 'is-landed': shardLanded }"
      :style="shardFlightStyle"
      aria-hidden="true"
    >
      <img
        src="/images/home/sai-festival-shard.png"
        alt=""
        class="entry-shard__img"
        width="491"
        height="508"
        decoding="async"
      />
    </figure>

    <nav class="home-menu-wrapper" aria-label="Main menu">
      <div
        v-for="(item, index) in randomMenus"
        :key="index"
        class="paper-label"
        :class="{ 'is-visible': isLoaded }"
        :style="menuLabelStyle(item, index)"
        @click="navigate(item.path)"
        @mouseenter="onMenuHover(true)"
        @mouseleave="onMenuHover(false)"
      >
        <div class="folded-text-container">
          <div class="slice t-slice organic-highlight organic-highlight--inline" :style="item.styles.top">
            <span class="text en">{{ item.name }}</span>
          </div>
          <div class="crease-line"></div>
          <div class="slice b-slice organic-highlight organic-highlight--inline" :style="item.styles.bot">
            <span class="text ko">{{ item.koName }}</span>
          </div>
        </div>
      </div>
    </nav>
    <div
      v-if="!isMobile"
      class="custom-cursor"
      :style="{ left: cursorX + 'px', top: cursorY + 'px' }"
    >
      <div class="arrow-rotate-layer" :style="{ transform: `rotate(${currentAngle}deg)` }">
        <div class="arrow-center-wrapper">
          <div class="long-stroke"></div>
          <div class="arrow-tip"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getVisibleViewportHeight } from '@/utils/viewport.js'
import { randomOrganicHighlight } from '@/utils/organicHighlight.js'

export default {
  name: 'Home',
  data() {
    return {
      menus: [
        { name: 'Artists', koName: '아티스트', path: '/artists' },
        { name: 'Program', koName: '프로그램', path: '/program' },
        { name: 'Venue', koName: '장소', path: '/venue' },
        { name: 'Ticket', koName: '티켓', path: '/ticket' },
        { name: 'Archive', koName: '아카이브', path: '/archive' },
        { name: 'About', koName: '사–이', path: '/about' },
      ],
      randomMenus: [],
      isLoaded: false,
      shardLanded: false,
      shardFlight: null,
      isMobile: false,
      universeMinHeight: null,
      centerPos: { x: 0, y: 0 },
      cursorX: 0,
      cursorY: 0,
      // 처음 진입 시 랜덤한 각도 하나만 딱 정해둡니다.
      currentAngle: Math.random() * 360,
    }
  },
  computed: {
    universeStyle() {
      const style = {}
      if (this.isMobile && this.universeMinHeight) {
        style.minHeight = `${this.universeMinHeight}px`
      }
      return style
    },
    shardFlightStyle() {
      if (!this.shardFlight) return {}
      const { startX, startY, landRot } = this.shardFlight
      return {
        '--shard-start-x': startX,
        '--shard-start-y': startY,
        '--shard-land-rot': `${landRot}deg`,
        '--shard-land-rot-hit': `${landRot + 2.5}deg`,
        '--shard-land-rot-settle': `${landRot - 1.2}deg`,
      }
    },
  },
  mounted() {
    this.checkMobile()
    this.initShardFlight()
    this.updateCenterPos()
    this.generatePositions()

    if (!this.isMobile) {
      window.addEventListener('mousemove', this.updateCursor)
    }

    requestAnimationFrame(() => {
      setTimeout(() => {
        this.shardLanded = true
      }, 60)
      setTimeout(() => {
        this.isLoaded = true
      }, 820)
    })
    window.addEventListener('resize', this.handleResize)
    window.addEventListener('app-vh-change', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('app-vh-change', this.handleResize)
    window.removeEventListener('mousemove', this.updateCursor)
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth < 768
    },
    initShardFlight() {
      this.shardFlight = {
        startX: '0vw',
        startY: '-115vh',
        landRot: 20,
      }
    },
    onMenuHover(isHovering) {
      if (isHovering) {
        // InterventionCanvas에게 멈추라고 신호 보냄
        window.dispatchEvent(new CustomEvent('menu-hover-start'))
      } else {
        // 다시 시작하라고 신호 보냄
        window.dispatchEvent(new CustomEvent('menu-hover-end'))
      }
    },
    updateCursor(e) {
      requestAnimationFrame(() => {
        this.cursorX = e.clientX
        this.cursorY = e.clientY
      })
    },
    updateCenterPos() {
      // 메뉴의 대략적인 크기(220x70)를 고려하여 정확히 중앙점 계산
      // window.innerWidth가 작아져도 음수값이 나오지 않도록 처리
      this.centerPos.x = Math.max(0, window.innerWidth / 2 - 110)
      this.centerPos.y = Math.max(0, getVisibleViewportHeight() / 2 - 35)
    },
    menuLabelStyle(item, index) {
      return {
        top: this.isLoaded ? `${item.top}px` : `${this.centerPos.y}px`,
        left: this.isLoaded ? `${item.left}px` : `${this.centerPos.x}px`,
        transform: this.isLoaded ? `rotate(${item.baseRot}deg) scale(1)` : `rotate(0deg) scale(0.3)`,
        transitionDelay: this.isLoaded ? `${index * 0.03}s` : '0s',
        opacity: this.isLoaded ? 1 : 0,
      }
    },
    handleResize() {
      const wasMobile = this.isMobile
      this.checkMobile()
      if (wasMobile !== this.isMobile) {
        if (this.isMobile) {
          window.removeEventListener('mousemove', this.updateCursor)
        } else {
          window.addEventListener('mousemove', this.updateCursor)
        }
      }
      this.updateCenterPos()
      this.generatePositions()
    },
    randomSliceStyles() {
      const d = () => (Math.random() > 0.5 ? 1 : -1)
      const f = () => (Math.random() * 12).toFixed(1)
      const hlOpts = { intensity: 1.75 }
      return {
        top: {
          ...randomOrganicHighlight('#000000', hlOpts),
          transform: `translateX(${f() * d()}px) rotate(${Math.random() * 6 * d()}deg)`,
          zIndex: Math.random() > 0.5 ? 10 : 1,
        },
        bot: {
          ...randomOrganicHighlight('#000000', hlOpts),
          transform: `translateX(${f() * d()}px) rotate(${Math.random() * 20 * d()}deg)`,
          zIndex: 5,
        },
      }
    },
    generatePositions() {
      const w = window.innerWidth
      const h = getVisibleViewportHeight()

      if (this.isMobile) {
        const shuffled = [...this.menus].sort(() => Math.random() - 0.5)
        const itemH = 70
        const gap = 28
        const startY = Math.max(90, h * 0.14)
        const maxLeft = Math.max(16, w - 220)

        this.randomMenus = shuffled.map((menu, index) => ({
          ...menu,
          top: startY + index * (itemH + gap),
          left: 16 + Math.random() * maxLeft,
          baseRot: Math.random() * 20 - 10,
          styles: this.randomSliceStyles(),
        }))
        this.universeMinHeight = startY + shuffled.length * (itemH + gap) + 48
        return
      }

      this.universeMinHeight = null
      const placed = []

      this.randomMenus = this.menus.map((menu) => {
        let attempts = 0
        let x
        let y
        const iw = 200
        const ih = 60

        while (attempts < 150) {
          const rad = Math.min(w, h) * 0.4
          const ang = Math.random() * Math.PI * 2
          const dist = Math.random() * rad

          x = w / 2 + Math.cos(ang) * dist - iw / 2
          y = h / 2 + Math.sin(ang) * dist - ih / 2

          x = Math.max(20, Math.min(x, w - iw - 20))
          y = Math.max(20, Math.min(y, h - ih - 20))

          const overlaps = placed.some(
            (p) =>
              !(x + iw + 30 < p.x || x > p.x + iw + 30 || y + ih + 30 < p.y || y > p.y + ih + 30),
          )

          if (!overlaps || attempts === 149) {
            placed.push({ x, y })

            return {
              ...menu,
              top: y,
              left: x,
              baseRot: Math.random() * 10 - 5,
              styles: this.randomSliceStyles(),
            }
          }
          attempts++
        }
        return {
          ...menu,
          top: y,
          left: x,
          baseRot: Math.random() * 10 - 5,
          styles: this.randomSliceStyles(),
        }
      })
    },
    navigate(path) {
      this.$router.push(path)
    },
  },
}
</script>

<style scoped>
.menu-universe {
  position: relative;
  width: 100%;
  height: calc(var(--app-vh, 1vh) * 100);
  overflow: hidden;
  background: #fff;
  cursor: none !important;
}

.entry-shard {
  position: fixed;
  top: 50%;
  left: 50%;
  width: min(80vw, 680px);
  margin: 0;
  padding: 0;
  border: none;
  z-index: 12;
  pointer-events: none;
  transform: translate(-50%, -50%)
    translate(var(--shard-start-x, 0vw), var(--shard-start-y, -115vh)) rotate(0deg) scale(1.12);
  transform-origin: center center;
  transition: none;
  will-change: transform;
}

.entry-shard.is-landed {
  animation: shard-stick-in 1.05s cubic-bezier(0.11, 0.98, 0.14, 1) forwards;
}

.entry-shard__img {
  display: block;
  width: 100%;
  height: auto;
  filter: invert(1) brightness(1.06)
    drop-shadow(0 0 14px rgba(255, 255, 255, 0.5)) drop-shadow(0 0 32px rgba(255, 255, 255, 0.28))
    drop-shadow(0 2px 12px rgba(0, 0, 0, 0.06));
  mix-blend-mode: multiply;
  user-select: none;
  -webkit-user-drag: none;
}

@keyframes shard-stick-in {
  0% {
    transform: translate(-50%, -50%) translate(var(--shard-start-x), var(--shard-start-y))
      rotate(0deg) scale(1.12);
  }
  72% {
    transform: translate(-50%, calc(-50% + 2vh)) rotate(var(--shard-land-rot-hit)) scale(0.97);
  }
  86% {
    transform: translate(-50%, calc(-50% - 0.5vh)) rotate(var(--shard-land-rot-settle)) scale(1.02);
  }
  100% {
    transform: translate(-50%, -50%) rotate(var(--shard-land-rot)) scale(1);
  }
}

@media (max-width: 767px) {
  .entry-shard {
    width: min(128vw, 760px);
  }
}

/* 🔥 커스텀 커서 스타일 (Artists.vue와 동일) */
.custom-cursor {
  position: fixed;
  pointer-events: none;
  z-index: 100000;
  /* 핵심: 배경 및 글자와 색상 반전 */
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
  /* 각도 변경 시 너무 툭툭 끊기지 않게 약간의 트랜지션 추가 가능 */
}

.arrow-center-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}

.long-stroke {
  /* 선의 길이를 메뉴 너비에 맞춰 조절 가능 (예: 300px ~ 500px) */
  width: 400px;
  height: 1.5px;
  background: #fff;
  transform: translateX(-200px);
  box-shadow:
    0 0 6px rgba(255, 255, 255, 0.55),
    0 0 16px rgba(255, 240, 200, 0.35);
}

.arrow-tip {
  width: 14px;
  height: 14px;
  background: #fff;
  margin-left: 199px;
  position: absolute;
  clip-path: polygon(0% 25%, 100% 50%, 0% 75%);
  filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.5)) drop-shadow(0 0 14px rgba(255, 220, 180, 0.3));
}

.home-menu-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.paper-label {
  position: absolute;
  border: none;
  cursor: pointer;
  pointer-events: auto;
  z-index: 20;
  /* 속도 상향: 시간을 0.6s 정도로 단축하고 큐빅 베지어를 더 공격적으로 수정 */
  transition:
    top 0.6s cubic-bezier(0.23, 1, 0.32, 1),
    left 0.6s cubic-bezier(0.23, 1, 0.32, 1),
    transform 0.5s cubic-bezier(0.23, 1, 0.32, 1),
    opacity 0.4s ease;
  will-change: top, left, transform; /* 성능 최적화 */
}

.folded-text-container {
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
}

.slice {
  position: relative;
  min-height: 1.2em;
  height: auto;
  display: flex;
  align-items: center;
  overflow: visible;
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.crease-line {
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.22);
  z-index: 3;
  position: relative;
  margin: 1px 0;
}

.text {
  font-weight: 500;
  font-size: 1.2rem;
  white-space: nowrap;
  color: #fafafa;
  display: block;
  transition: color 0.22s ease;
  text-shadow:
    0 0 2px #fff,
    0 0 6px rgba(255, 255, 255, 1),
    0 0 14px rgba(255, 255, 255, 0.95),
    0 0 26px rgba(255, 255, 255, 0.85),
    0 0 42px rgba(255, 255, 255, 0.7),
    0 0 64px rgba(255, 255, 255, 0.55),
    0 0 92px rgba(255, 255, 255, 0.4),
    0 0 120px rgba(255, 255, 255, 0.28),
    0 0 1px rgba(0, 0, 0, 0.35);
}

.paper-label:hover {
  transform: scale(1.1) rotate(0deg) !important;
  z-index: 100;
  transition: transform 0.2s ease-out; /* 호버 시에는 즉각 반응 */
}

.paper-label:hover .slice {
  transform: translateX(0) rotate(0deg) !important;
}

.paper-label:hover .text {
  color: #ff1a1a;
}

.paper-label:hover .crease-line {
  background: rgba(255, 255, 255, 0.32);
}

@media (max-width: 767px) {
  .menu-universe {
    height: auto;
    min-height: calc(var(--app-vh, 1vh) * 100);
    overflow-x: hidden;
    overflow-y: auto;
    cursor: auto !important;
  }

  .paper-label {
    cursor: pointer;
  }

  .text {
    font-size: 1.5rem;
  }
}
</style>
