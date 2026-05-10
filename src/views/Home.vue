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
        { name: 'Timetable', koName: '스케줄', path: '/timetable' },
        { name: 'Ticket', koName: '티켓', path: '/ticket' },
        { name: 'Archive', koName: '아카이브', path: '/archive' },
        { name: 'About', koName: '사–이', path: '/about' },
      ],
      randomMenus: [],
      isLoaded: false,
      centerPos: { x: 0, y: 0 },
    }
  },
  mounted() {
    this.updateCenterPos()
    this.generatePositions()

    // DOM이 완전히 그려진 후 아주 짧은 딜레이 후 실행
    requestAnimationFrame(() => {
      setTimeout(() => {
        this.isLoaded = true
      }, 50)
    })

    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
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
  background: transparent;
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
