<template>
  <div
    v-if="currentArtist"
    class="artist-explore-container"
    :class="{ 'bio-open': showFullBio }"
    @click="handleGlobalClick"
  >
    <div class="bg-image-layer" v-if="previousArtist">
      <img :src="previousArtist.img" alt="background-trace" />
      <div class="bg-overlay"></div>
    </div>

    <div class="canvas-bg">
      <InterventionCanvas :key="currentArtist.id" ref="bgCanvas" :isPaused="true" />
    </div>

    <div class="ui-back-btn" @click.stop="$router.push('/')">
      <span class="arrow">←</span>
    </div>

    <div class="ui-top-center">
      <div class="ui-btn" @click.stop="toggleLineup">
        {{ ui.lineupBtn }}
      </div>
    </div>

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

    <div class="custom-cursor" :style="{ left: cursorX + 'px', top: cursorY + 'px' }">
      <div class="arrow-rotate-layer" :style="{ transform: `rotate(${currentAngle}deg)` }">
        <div class="arrow-center-wrapper">
          <div class="long-stroke"></div>
          <div class="arrow-tip"></div>
        </div>
      </div>
    </div>

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
      // 1. URL 파라미터(id)가 있는지 확인
      const found = this.artists.find((a) => {
        const slug = a.name_en.toLowerCase().trim().replace(/\s+/g, '-')
        return slug === this.id || String(a.id) === String(this.id)
      })

      // 2. 만약 id가 없다면(메인 메뉴에서 바로 온 경우)
      //    이미 선택된 값이 없다면 null을 반환하게 해서 watch에서 처리하거나,
      //    여기서 즉시 첫 화면용을 결정해야 합니다.
      return found || null
    },
    currentIndex() {
      return this.artists.findIndex((a) => a.id === this.currentArtist.id)
    },
    // 현재 언어에 맞는 바이오 원본 가져오기
    currentFullBio() {
      return this.currentLang === 'kr' ? this.currentArtist.bio_kr : this.currentArtist.bio_en
    },
    displayName() {
      return this.currentLang === 'kr' ? this.currentArtist.name_kr : this.currentArtist.name_en
    },
    displayBio() {
      if (this.showFullBio) return this.currentFullBio
      if (this.isLongBio) {
        return this.currentFullBio.substring(0, this.bioLimit) + '...'
      }
      return this.currentFullBio // 짧으면 그대로 반환
    },
    isLongBio() {
      return this.currentFullBio && this.currentFullBio.length > this.bioLimit
    },
    // UI 공통 텍스트 다국어 처리
    ui() {
      return {
        lineupBtn: this.currentLang === 'kr' ? '[ 라인업 ]' : '[ LINE-UP ]',
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
        // 1. 메뉴에서 'ARTISTS'를 처음 눌러서 들어온 경우 (id가 없음)
        if (!newId || newId === 'undefined') {
          this.goToRandomArtist()
          return
        }

        // 2. 이전 아티스트(배경 잔상) 설정 로직
        if (oldId && oldId !== 'undefined') {
          // 일반적인 이동 시 (A -> B)
          const prev = this.artists.find((a) => {
            const slug = a.name_en.toLowerCase().trim().replace(/\s+/g, '-')
            return slug === oldId || String(a.id) === String(oldId)
          })
          if (prev) this.previousArtist = prev
        } else {
          // 3. 🔥 최초 진입 시에도 배경에 뭐라도 띄우고 싶다면?
          // 현재 아티스트(newId)가 아닌 다른 무작위 아티스트를 배경으로 설정
          const currentIdx = this.artists.findIndex(
            (a) => a.name_en.toLowerCase().trim().replace(/\s+/g, '-') === newId,
          )
          const otherArtists = this.artists.filter((_, idx) => idx !== currentIdx)
          this.previousArtist = otherArtists[Math.floor(Math.random() * otherArtists.length)]
        }

        // 상태 초기화
        this.setRandomState()
        this.showFullBio = false
        this.isHoveringButton = false
      },
      immediate: true,
    },
  },
  mounted() {
    this.setRandomState()
    // 컨테이너가 아니라 window에 이벤트를 등록합니다.
    window.addEventListener('mousemove', this.updateCursor)
  },
  beforeUnmount() {
    // 컴포넌트를 나갈 때 반드시 제거해줍니다.
    window.removeEventListener('mousemove', this.updateCursor)
  },
  methods: {
    updateCursor(e) {
      // 직접 값을 넣지 않고 브라우저가 준비될 때 업데이트
      requestAnimationFrame(() => {
        this.cursorX = e.clientX
        this.cursorY = e.clientY
      })
    },
    goToRandomArtist() {
      const randomIndex = Math.floor(Math.random() * this.artists.length)
      const target = this.artists[randomIndex]
      const targetSlug = target.name_en.toLowerCase().trim().replace(/\s+/g, '-')

      // 주소를 랜덤 아티스트의 주소로 바꿉니다. (replace를 써서 뒤로가기 기록이 꼬이지 않게 함)
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
      if (!this.showLineup) {
        this.generateNonOverlappingLineup()
      }
      this.showLineup = !this.showLineup
    },
    // 안겹치게 그리드 기반으로 배치하는 로직
    generateNonOverlappingLineup() {
      const isMobile = window.innerWidth < 768
      const cols = isMobile ? 2 : 4 // 가로 칸 수
      const rows = Math.ceil(this.artists.length / cols)
      const cellW = 80 / cols
      const cellH = 70 / rows

      // 인덱스를 포함하여 랜덤하게 섞음
      const artistPool = this.artists.map((a, idx) => ({ ...a, originalIndex: idx }))
      const shuffled = artistPool.sort(() => Math.random() - 0.5)

      this.randomLineupItems = shuffled.map((artist, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)

        // 그리드 칸 안에서 무작위 오프셋 부여 (겹침 방지 핵심)
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
      // 버튼 위가 아닐 때만 다음 아티스트로 이동
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
        // 1. 라인업에서 특정 아티스트를 클릭한 경우
        nextIdx = targetIdx
      } else {
        // 2. 배경 클릭 시 랜덤 이동 (현재 아티스트 제외)
        const otherIndices = this.artists
          .map((_, idx) => idx)
          .filter((idx) => idx !== this.currentIndex)

        // 남은 인덱스 중 하나를 무작위 선택
        nextIdx = otherIndices[Math.floor(Math.random() * otherIndices.length)]
      }

      const target = this.artists[nextIdx]
      const targetSlug = target.name_en.toLowerCase().trim().replace(/\s+/g, '-')

      // 이동 애니메이션 거리 계산
      const distance = Math.max(window.innerWidth, window.innerHeight)
      const rad = (this.currentAngle * Math.PI) / 180
      this.moveX = Math.cos(rad) * distance
      this.moveY = Math.sin(rad) * distance

      // 경로 이동
      this.$router.push(`/artists/${targetSlug}`)

      // 다음 화면을 위한 랜덤 각도 재설정
      this.currentAngle = Math.random() * 360
    },
  },
}
</script>

<style scoped>
.artist-explore-container {
  width: 100vw;
  height: 100vh;
  background: #fff;
  overflow: hidden;
  cursor: none !important; /* 전체 컨테이너 커서 숨김 */
  position: relative;
}

/* UI 요소 */
.ui-back-btn {
  position: fixed;
  top: 30px;
  left: 30px;
  z-index: 1200;
  cursor: none !important;
}
.ui-back-btn .arrow {
  font-size: 2.5rem;
  font-weight: 300;
  color: #000;
  transition: transform 0.3s ease;
  display: block;
}
.ui-back-btn:hover .arrow {
  transform: translateX(-5px);
}

.ui-top-center {
  position: fixed;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1200;
}
.ui-btn {
  background: #000;
  color: #fff;
  padding: 6px 15px;
  font-family: monospace;
  font-size: 0.9rem;
  cursor: none !important;
  border: 1px solid #000;
  transition: all 0.2s ease;
}
.ui-btn:hover {
  background: #fff;
  color: #000;
}

/* 랜덤 라인업 오버레이 */
.lineup-random-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.97);
  z-index: 1100;
  cursor: none !important; /* 오버레이 위에서도 커서 숨김 */
}
/* Artists.vue 스타일 섹션 */

.random-name-item {
  position: absolute;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  text-transform: uppercase;
  cursor: none !important;
  white-space: nowrap;
  transition: all 0.3s ease;
  padding: 5px;
  /* 기본 상태: 약간 투명하게 해서 강조된 이름이 더 돋보이게 함 */
  opacity: 0.4;
  color: #000;
}

/* 🔥 현재 활성화된 아티스트 강조 스타일 */
.random-name-item.active {
  opacity: 1; /* 불투명도 100% */
  color: #ff3300; /* 강렬한 포인트 컬러 (오렌지-레드) */
  font-size: 1.25em; /* 다른 이름보다 약간 더 크게 */
  z-index: 100; /* 다른 이름 뒤에 가려지지 않게 최상단으로 */

  /* 밑줄 효과 */
  text-decoration: underline;
  text-underline-offset: 8px;
  text-decoration-thickness: 2px;
}

/* 호버했을 때의 피드백 (active가 아닐 때도 작동) */
.random-name-item:hover {
  opacity: 1;
  color: #ff3300;
  transform: scale(1.1) rotate(0deg) !important;
}

/* 배경 및 캔버스 */
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

  /* 1. 사진(10)과 정보창(25)보다 높은 z-index 부여 */
  /* 하지만 UI 버튼(1200)이나 커서(100000)보다는 낮게 설정 */
  z-index: 50;

  /* 2. 마우스 클릭이 아래 레이어(사진, 버튼 등)에 전달되도록 필수 설정 */
  pointer-events: none;

  /* 3. 선이 사진 위를 지나갈 때 '반전'되거나 '곱해지도록' 설정 */
  /* 배경이 흰색이고 선이 검은색이라면 'multiply'나 'difference'가 효과적입니다 */
  mix-blend-mode: multiply;
  opacity: 0.5; /* 선이 너무 진해 사진을 방해한다면 투명도 조절 */
}

/* 정보 레이어 */
.info-layer-wide {
  position: absolute;
  z-index: 25;
  width: 90vw;
  max-height: 180px;
  overflow: hidden;
  /* 위치와 크기 변화를 부드럽게 */
  transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1);
  pointer-events: none;
}
/* 확장 상태일 때 내부 텍스트 레이아웃 */
.info-layer-wide.expanded {
  top: 80px !important;
  left: 5vw !important;
  width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
  pointer-events: auto;
  padding: 20px; /* 내부 여백 추가로 X 버튼 공간 확보 */
  background: #fff; /* 전체 배경을 흰색으로 채워 가독성 높임 */
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
}
/* 스크롤바 */
.info-layer-wide::-webkit-scrollbar {
  width: 4px;
}
.info-layer-wide::-webkit-scrollbar-track {
  background: transparent;
}
.info-layer-wide::-webkit-scrollbar-thumb {
  background: #000;
}

.text-content {
  font-size: 1rem;
  line-height: 1.5rem; /* 가독성을 위해 줄 간격 확보 */
  color: #000;
  pointer-events: auto;
}
.highlight-wrapper {
  display: inline;
}
.name-inline,
.bio-inline,
.more-btn-inline,
.close-btn-inline {
  background: #fff;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
  padding: 3px 0;
}
/* 더보기 버튼: 괄호 제거, 폰트 크기 축소 */
.more-btn-inline {
  font-size: 0.75rem; /* 기존보다 작게 */
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-decoration: underline;
  margin-left: 8px;
  cursor: none !important;
  color: #666; /* 살짝 흐리게 하여 본문과 차별화 */
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

.more-btn-inline,
.close-btn-inline {
  font-weight: bold;
  text-decoration: underline;
  margin-left: 10px;
  padding: 0 4px;
  transition: all 0.2s ease;
  display: inline-block;
  cursor: none !important;
}
.more-btn-inline:hover,
.close-btn-inline:hover {
  background-color: #000 !important;
  color: #fff !important;
  text-decoration: none;
  transform: translateY(-1px);
}
.more-btn-inline:hover {
  color: #000;
  background-color: transparent !important; /* 배경색 반전 제거 (요청 반영) */
}

/* 이미지 스테이지 */
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
  /* 기존 80에서 90으로 상향 */
  max-width: 90vw;
  max-height: 90vh;

  /* 사진이 너무 작아지는 것을 방지 (가로 기준) */
  min-width: 50vw;

  object-fit: contain;
  /* 선(Canvas)이 위로 올라왔으므로 그림자가 너무 진하면 이질감이 들 수 있어 조절 */
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
}

.close-x-btn {
  position: sticky; /* 스크롤 내려가도 상단에 고정 */
  top: 0;
  float: right;
  padding: 10px;
  cursor: none !important;
  z-index: 30;
  background: #fff; /* 글자와 겹칠 때 대비 */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  margin-top: -5px;
  margin-right: -5px;
}

.close-x-btn:hover {
  transform: rotate(90deg); /* 호버 시 회전 애니메이션 */
}

.close-x-btn svg {
  width: 20px;
  height: 20px;
  color: #000;
}

/* 커스텀 커서 */
.custom-cursor {
  position: fixed;
  pointer-events: none;
  z-index: 100000;
  mix-blend-mode: difference;
  display: flex;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
  pointer-events: none !important; /* 커서 자체가 이벤트를 먹지 않도록 */
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

/* 트랜지션 */
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
  .ui-back-btn {
    top: 20px;
    left: 20px;
  }
  .ui-back-btn .arrow {
    font-size: 2rem;
  }
  .ui-top-center {
    top: 25px;
  }
  .image-box img {
    max-width: 90vw;
    max-height: 60vh;
  }
}
</style>
