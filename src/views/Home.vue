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

    <div
      v-for="(item, index) in randomMenus"
      :key="index"
      class="paper-label"
      :class="{ 'is-visible': isLoaded }"
      :style="{
        top: isLoaded ? item.top + 'px' : centerPos.y + 'px',
        left: isLoaded ? item.left + 'px' : centerPos.x + 'px',
        transform: isLoaded ? `rotate(${item.baseRot}deg) scale(1)` : `rotate(0deg) scale(0.3)`,
        transitionDelay: isLoaded ? `${index * 0.03}s` : '0s',
        opacity: isLoaded ? 1 : 0,
      }"
      @click="navigate(item.path)"
      @mouseenter="onMenuHover(true)"
      @mouseleave="onMenuHover(false)"
    >
      <div class="folded-text-container">
        <div class="slice t-slice" :style="item.styles.top">
          <span class="text en">// {{ item.name }}</span>
        </div>
        <div class="crease-line"></div>
        <div class="slice b-slice" :style="item.styles.bot">
          <span class="text ko">{{ item.koName }}</span>
        </div>
      </div>
    </div>
    <div v-if="!isMobile" class="custom-cursor" :style="{ left: cursorX + 'px', top: cursorY + 'px' }">
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
      return {
        top: {
          transform: `translateX(${f() * d()}px) rotate(${Math.random() * 6 * d()}deg)`,
          zIndex: Math.random() > 0.5 ? 10 : 1,
        },
        bot: {
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
        let attempts = 0,
          x,
          y
        const iw = 200,
          ih = 60 // 배치용 가상 박스 크기

        while (attempts < 150) {
          // 화면 크기에 비례하여 퍼지는 반경 조절
          const rad = Math.min(w, h) * 0.4
          const ang = Math.random() * Math.PI * 2
          const dist = Math.random() * rad

          x = w / 2 + Math.cos(ang) * dist - iw / 2
          y = h / 2 + Math.sin(ang) * dist - ih / 2

          // 화면 밖으로 완전히 나가는 것 방지
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
  top: 12vh;
  right: 4vw;
  width: min(80vw, 680px);
  margin: 0;
  padding: 0;
  border: none;
  z-index: 12;
  pointer-events: none;
  transform: translate(var(--shard-start-x, 0vw), var(--shard-start-y, -115vh)) rotate(0deg)
    scale(1.12);
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
  filter: invert(1);
  mix-blend-mode: multiply;
  user-select: none;
  -webkit-user-drag: none;
}

@keyframes shard-stick-in {
  0% {
    transform: translate(var(--shard-start-x), var(--shard-start-y)) rotate(0deg) scale(1.12);
  }
  72% {
    transform: translate(0, 2vh) rotate(var(--shard-land-rot-hit)) scale(0.97);
  }
  86% {
    transform: translate(0, -0.5vh) rotate(var(--shard-land-rot-settle)) scale(1.02);
  }
  100% {
    transform: translate(0, 0) rotate(var(--shard-land-rot)) scale(1);
  }
}

@media (max-width: 767px) {
  .entry-shard {
    top: 8vh;
    right: 2vw;
    width: min(95vw, 520px);
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
}

.arrow-tip {
  width: 14px;
  height: 14px;
  background: #fff;
  margin-left: 199px;
  position: absolute;
  clip-path: polygon(0% 25%, 100% 50%, 0% 75%);
}

.paper-label {
  position: absolute;
  border: none;
  cursor: pointer;
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
  height: 11px;
  display: flex;
  align-items: center;
  background: white;
  overflow: visible;
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.crease-line {
  width: 100%;
  height: 1px;
  background: rgba(0, 0, 0, 0.15);
  z-index: 3;
  position: relative;
  margin: 1px 0;
}

.text {
  font-weight: 500;
  font-size: 1.3rem;
  white-space: nowrap;
  color: #000;
  display: block;
}

.paper-label:hover {
  transform: scale(1.1) rotate(0deg) !important;
  z-index: 100;
  transition: transform 0.2s ease-out; /* 호버 시에는 즉각 반응 */
}

.paper-label:hover .slice {
  transform: translateX(0) rotate(0deg) !important;
  background: #000;
}

.paper-label:hover .text {
  color: #fff;
}

.paper-label:hover .crease-line {
  background: white;
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

  .slice {
    background: transparent;
    isolation: isolate;
  }

  .slice::before {
    content: '';
    position: absolute;
    left: -6px;
    right: -8px;
    top: -4px;
    bottom: -4px;
    background: #ffff00;
    z-index: -1;
    clip-path: polygon(
      0% 30%,
      4% 12%,
      9% 26%,
      15% 8%,
      21% 24%,
      28% 6%,
      35% 22%,
      42% 10%,
      50% 28%,
      58% 7%,
      65% 23%,
      72% 9%,
      79% 25%,
      86% 6%,
      93% 20%,
      98% 12%,
      100% 28%,
      100% 70%,
      96% 88%,
      91% 74%,
      85% 92%,
      79% 76%,
      72% 94%,
      65% 78%,
      58% 93%,
      50% 72%,
      42% 90%,
      35% 76%,
      28% 94%,
      21% 80%,
      14% 92%,
      7% 78%,
      0% 68%
    );
  }

  .slice.t-slice::before {
    transform: rotate(-0.45deg) scale(1.02, 1.08);
    clip-path: polygon(
      0% 34%,
      5% 14%,
      11% 30%,
      18% 9%,
      25% 26%,
      32% 7%,
      40% 24%,
      47% 11%,
      55% 29%,
      63% 8%,
      71% 22%,
      78% 10%,
      86% 27%,
      93% 6%,
      100% 24%,
      100% 66%,
      94% 86%,
      87% 70%,
      80% 90%,
      73% 74%,
      65% 92%,
      57% 76%,
      49% 94%,
      41% 78%,
      33% 96%,
      25% 80%,
      17% 93%,
      9% 76%,
      0% 70%
    );
  }

  .slice.b-slice::before {
    transform: rotate(0.4deg) scale(1.01, 1.06);
    clip-path: polygon(
      0% 26%,
      6% 9%,
      13% 22%,
      20% 6%,
      27% 20%,
      34% 8%,
      41% 25%,
      49% 5%,
      57% 19%,
      64% 7%,
      72% 23%,
      80% 9%,
      88% 24%,
      95% 11%,
      100% 26%,
      100% 74%,
      94% 91%,
      87% 77%,
      80% 95%,
      73% 79%,
      65% 93%,
      57% 75%,
      49% 91%,
      41% 77%,
      33% 93%,
      25% 78%,
      17% 94%,
      9% 80%,
      0% 74%
    );
  }

  .text {
    color: #000;
  }

  .crease-line {
    background: rgba(0, 0, 0, 0.15);
  }

  .paper-label:hover .slice {
    background: transparent;
  }

  .paper-label:hover .text {
    color: #000;
  }

  .paper-label:hover .crease-line {
    background: rgba(0, 0, 0, 0.15);
  }
}
</style>
