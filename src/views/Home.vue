<template>
  <div class="menu-universe" ref="universe">
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
    <div class="custom-cursor" :style="{ left: cursorX + 'px', top: cursorY + 'px' }">
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
      centerPos: { x: 0, y: 0 },
      cursorX: 0,
      cursorY: 0,
      // 처음 진입 시 랜덤한 각도 하나만 딱 정해둡니다.
      currentAngle: Math.random() * 360,
    }
  },
  mounted() {
    this.updateCenterPos()
    this.generatePositions()

    // 🔥 마우스 이동 이벤트 리스너 추가
    window.addEventListener('mousemove', this.updateCursor)

    requestAnimationFrame(() => {
      setTimeout(() => {
        this.isLoaded = true
      }, 50)
    })
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
    // 🔥 이벤트 제거
    window.removeEventListener('mousemove', this.updateCursor)
  },
  methods: {
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
      this.centerPos.y = Math.max(0, window.innerHeight / 2 - 35)
    },
    handleResize() {
      this.updateCenterPos()
      // 리사이즈 시 퍼진 위치를 재계산하되, 애니메이션 없이 즉시 반영되도록 처리하고 싶다면 별도 로직 필요
      // 현재는 재계산하여 부드럽게 재배치됩니다.
      this.generatePositions()
    },
    generatePositions() {
      const w = window.innerWidth
      const h = window.innerHeight
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
            const d = () => (Math.random() > 0.5 ? 1 : -1)
            const f = () => (Math.random() * 12).toFixed(1)

            return {
              ...menu,
              top: y,
              left: x,
              baseRot: Math.random() * 10 - 5,
              styles: {
                top: {
                  transform: `translateX(${f() * d()}px) rotate(${Math.random() * 6 * d()}deg)`,
                  zIndex: Math.random() > 0.5 ? 10 : 1,
                },
                bot: {
                  transform: `translateX(${f() * d()}px) rotate(${Math.random() * 20 * d()}deg)`,
                  zIndex: 5,
                },
              },
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
  height: 100vh;
  overflow: hidden;
  background: #fff;
  /* 커서가 메뉴 위에서 기본 화살표로 보이지 않게 처리 */
  cursor: none !important;
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
  font-family: 'Courier New', 'Pretendard', sans-serif;
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
</style>
