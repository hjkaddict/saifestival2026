<template>
  <div class="menu-universe" ref="universe" :style="universeStyle">
    <figure class="entry-shard" :class="{ 'is-landed': shardLanded }" aria-hidden="true">
      <div class="entry-shard__inner">
        <div class="entry-shard__wing entry-shard__wing--left">
          <div class="entry-shard__face entry-shard__face--left"></div>
        </div>
        <div class="entry-shard__wing entry-shard__wing--right">
          <div class="entry-shard__face entry-shard__face--right"></div>
        </div>
      </div>
    </figure>

    <nav class="home-menu-wrapper" aria-label="Main menu">
      <div
        v-for="(item, index) in randomMenus"
        :key="index"
        class="paper-label"
        :class="{
          'is-visible': isLoaded,
          'is-active': activeMenuIndex === index,
          'paper-label--disabled': item.disabled,
        }"
        :aria-disabled="item.disabled ? 'true' : 'false'"
        :style="menuLabelStyle(item, index)"
        @click="onMenuClick(item, index, $event)"
        @mouseenter="onMenuLabelEnter(item)"
        @mouseleave="onMenuLabelLeave(item)"
      >
        <div class="folded-text-container">
          <div
            class="slice t-slice organic-highlight organic-highlight--inline"
            :style="item.styles.top"
          >
            <span class="text en">{{ item.name }}</span>
          </div>
          <div class="crease-line"></div>
          <div
            class="slice b-slice organic-highlight organic-highlight--inline"
            :style="item.styles.bot"
          >
            <span class="text ko">{{ item.koName }}</span>
          </div>
        </div>
      </div>
    </nav>
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
        { name: 'Archive', koName: '아카이브', path: '/archive', disabled: true },
        { name: 'About', koName: '사–이', path: '/about' },
      ],
      randomMenus: [],
      isLoaded: false,
      shardLanded: false,
      isMobile: false,
      universeMinHeight: null,
      centerPos: { x: 0, y: 0 },
      activeMenuIndex: null,
      pendingNav: null,
      _navFallbackTimer: null,
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
  },
  mounted() {
    this.checkMobile()
    this.updateCenterPos()
    this.generatePositions()

    requestAnimationFrame(() => {
      setTimeout(() => {
        this.shardLanded = true
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.isLoaded = true
          })
        })
      }, 60)
    })
    window.addEventListener('resize', this.handleResize)
    window.addEventListener('app-vh-change', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('app-vh-change', this.handleResize)
    this.clearPendingNav()
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth < 768
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
    onMenuLabelEnter(item) {
      this.onMenuHover(true)
    },
    onMenuLabelLeave() {
      this.onMenuHover(false)
    },
    updateCenterPos() {
      // 메뉴의 대략적인 크기(220x70)를 고려하여 정확히 중앙점 계산
      // window.innerWidth가 작아져도 음수값이 나오지 않도록 처리
      this.centerPos.x = Math.max(0, window.innerWidth / 2 - 110)
      this.centerPos.y = Math.max(0, getVisibleViewportHeight() / 2 - 35)
    },
    menuLabelStyle(item, index) {
      if (!this.isLoaded) {
        return {
          top: `${this.centerPos.y}px`,
          left: `${this.centerPos.x}px`,
          transform: 'translateZ(0) rotate(45deg) scale(0.035, 0.14)',
          transitionDelay: '0s',
          opacity: 1,
        }
      }
      return {
        top: `${item.top}px`,
        left: `${item.left}px`,
        transform: `rotate(${item.baseRot}deg) scale(1)`,
        transitionDelay: `${index * 0.045}s`,
        opacity: 1,
      }
    },
    handleResize() {
      this.checkMobile()
      this.updateCenterPos()
      this.generatePositions()
    },
    randomSliceStyles() {
      const d = () => (Math.random() > 0.5 ? 1 : -1)
      const f = () => (Math.random() * 12).toFixed(1)
      const hlOpts = { intensity: 1.0 }
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
    clearPendingNav() {
      if (this._navFallbackTimer != null) {
        clearTimeout(this._navFallbackTimer)
        this._navFallbackTimer = null
      }
      this.pendingNav = null
      this.activeMenuIndex = null
    },
    onMenuClick(item, index, event) {
      if (item.disabled) return
      if (!this.isMobile) {
        this.navigate(item.path)
        return
      }
      if (this.pendingNav) return

      this.pendingNav = item.path
      this.activeMenuIndex = index

      const path = item.path
      const el = event.currentTarget
      const finish = () => {
        if (this.pendingNav !== path) return
        this.clearPendingNav()
        this.$router.push(path)
      }

      const onTransitionEnd = (e) => {
        if (e.target !== el || e.propertyName !== 'transform') return
        el.removeEventListener('transitionend', onTransitionEnd)
        finish()
      }
      el.addEventListener('transitionend', onTransitionEnd)

      this._navFallbackTimer = setTimeout(() => {
        el.removeEventListener('transitionend', onTransitionEnd)
        finish()
      }, 320)
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
  cursor: auto;
}

.entry-shard {
  position: fixed;
  top: 50%;
  left: 50%;
  margin: 0;
  padding: 0;
  border: none;
  z-index: 1;
  pointer-events: none;
  transform: translate(-50%, -50%) rotate(45deg);
  transform-origin: center center;
  transition: none;
}

.entry-shard__inner {
  display: flex;
  height: calc(var(--app-vh, 1vh) * 100);
  aspect-ratio: 491 / 508;
  perspective: 2200px;
  transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;
  isolation: isolate;
}

.entry-shard__wing {
  position: relative;
  flex: 1;
  min-width: 0;
  height: 100%;
  transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;
}

.entry-shard__wing--left {
  transform-origin: right center;
  transform: rotateY(-82deg);
}

.entry-shard__wing--right {
  margin-left: -2px;
  transform-origin: left center;
  transform: rotateY(82deg);
}

.entry-shard__face {
  position: absolute;
  top: 0;
  bottom: 0;
  background-image: url(/images/home/sai-festival-shard.png);
  background-repeat: no-repeat;
  background-size: 200% 100%;
  filter: invert(1) brightness(1.06) drop-shadow(0 0 12px rgba(255, 255, 255, 0.35))
    drop-shadow(0 2px 6px rgba(0, 0, 0, 0.08));
  mix-blend-mode: multiply;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  user-select: none;
  transform: translateZ(0);
}

.entry-shard__face--left {
  left: 0;
  right: -3px;
  background-position: left center;
}

.entry-shard__face--right {
  left: -3px;
  right: 0;
  background-position: right center;
}

/* 접힘 펼침 (날개 애니 duration) */
.entry-shard.is-landed .entry-shard__wing--left {
  animation: shard-wing-left 2.35s cubic-bezier(0.28, 0.82, 0.34, 1) forwards;
}

.entry-shard.is-landed .entry-shard__wing--right {
  animation: shard-wing-right 2.35s cubic-bezier(0.28, 0.82, 0.34, 1) forwards;
}

@keyframes shard-wing-left {
  0% {
    transform: rotateY(-82deg);
  }
  55% {
    transform: rotateY(6deg);
  }
  76% {
    transform: rotateY(-3deg);
  }
  100% {
    transform: rotateY(0deg);
  }
}

@keyframes shard-wing-right {
  0% {
    transform: rotateY(82deg);
  }
  55% {
    transform: rotateY(-6deg);
  }
  76% {
    transform: rotateY(3deg);
  }
  100% {
    transform: rotateY(0deg);
  }
}

.home-menu-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 200;
  transform: translateZ(0);
  contain: layout;
}

.paper-label {
  position: absolute;
  border: none;
  cursor: pointer;
  pointer-events: auto;
  z-index: 10;
  transform-origin: center center;
  transition:
    top 0.95s cubic-bezier(0.18, 1.05, 0.32, 1),
    left 0.95s cubic-bezier(0.18, 1.05, 0.32, 1),
    transform 0.92s cubic-bezier(0.2, 1.12, 0.36, 1),
    opacity 0.35s ease;
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
  font-weight: 100;
  font-size: 1.2rem;
  white-space: nowrap;
  color: #fff;
  display: block;
  transition: opacity 0.15s ease;
  text-shadow: none;
}

.paper-label--disabled {
  cursor: not-allowed;
  opacity: 0.72;
}

.paper-label:hover {
  transform: scale(1.1) rotate(0deg) !important;
  z-index: 100;
  transition: transform 0.2s ease-out; /* 호버 시에는 즉각 반응 */
}

.paper-label:hover .slice {
  transform: translateX(0) rotate(0deg) !important;
}

.paper-label:hover .organic-highlight.organic-highlight--inline {
  background: #2a2a2a !important;
}

.paper-label:hover .crease-line {
  background: rgba(255, 255, 255, 0.25);
}

@media (max-width: 767px) {
  .entry-shard__inner {
    height: calc(var(--app-vh, 1vh) * 86);
  }

  .menu-universe {
    height: auto;
    min-height: calc(var(--app-vh, 1vh) * 100);
    overflow-x: hidden;
    overflow-y: auto;
    cursor: auto !important;
  }

  .paper-label:not(.paper-label--disabled) {
    cursor: pointer;
  }

  .paper-label--disabled {
    cursor: not-allowed;
  }

  .paper-label.is-active:not(.paper-label--disabled) {
    transform: scale(1.1) rotate(0deg) !important;
    z-index: 100;
    transition: transform 0.2s ease-out;
  }

  .paper-label.is-active .slice {
    transform: translateX(0) rotate(0deg) !important;
  }

  .paper-label.is-active .organic-highlight.organic-highlight--inline {
    background: #2a2a2a !important;
  }

  .paper-label.is-active .crease-line {
    background: rgba(255, 255, 255, 0.25);
  }

  .text {
    font-size: 1.2rem;
  }
}
</style>
