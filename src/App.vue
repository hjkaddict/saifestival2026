<template>
  <div id="app-root">
    <!-- 메인 페이지('/')가 아닐 때만 노출되는 상단 네비게이션 -->
    <nav v-if="$route.path !== '/'" class="global-nav">
      <!-- 왼쪽: 메인 이동 버튼 -->
      <router-link to="/" class="nav-btn left-btn organic-highlight organic-highlight--btn" :style="navOrganicMain">
        {{ locale.lang === 'kr' ? '메인' : 'MAIN' }}
      </router-link>

      <!-- 오른쪽: 언어 전환 버튼 -->
      <button class="nav-btn right-btn organic-highlight organic-highlight--btn" :style="navOrganicLang" @click="toggleLang">
        {{ locale.lang === 'kr' ? 'EN' : '한글' }}
      </button>
    </nav>

    <main class="router-stage">
      <router-view />
    </main>

    <footer
      v-if="$route.path === '/'"
      class="global-footer-links"
      aria-label="Social and contact"
    >
      <a
        class="global-footer-links__ig-wrap"
        href="https://www.instagram.com/saifestival/"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="locale.lang === 'kr' ? '인스타그램 @saifestival' : 'Instagram @saifestival'"
      >
        <svg
          class="global-footer-links__ig-svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="64"
          height="64"
          aria-hidden="true"
        >
          <g
            fill="none"
            stroke="currentColor"
            stroke-width="1.35"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <!-- 구불한 카메라 프레임 -->
            <path
              d="M 9.8 7.4
                 C 8.6 7.6 7.5 8.5 7.2 9.8
                 C 6.9 11.8 7.05 20.35 7.2 22.1
                 C 7.35 23.7 8.8 24.65 10.4 24.85
                 C 14.25 25.35 18.3 25.2 22.05 24.9
                 C 23.75 24.75 24.95 23.55 25.1 21.95
                 C 25.4 17.9 25.35 13.85 25.05 9.85
                 C 24.85 8.15 23.5 7.05 21.8 6.95
                 C 17.8 6.65 13.55 6.7 9.8 7.4 Z"
            />
            <!-- 구불한 렌즈 링 -->
            <path
              d="M 16.15 11.35
                 C 19.55 11 22.05 13.45 22.35 16.7
                 C 22.65 20.15 20.05 22.85 16.6 23.05
                 C 12.95 23.25 10.15 20.75 9.9 17.2
                 C 9.65 13.45 12.25 11.55 16.15 11.35 Z"
            />
            <!-- 뷰파인더 점 -->
            <path
              d="M 23.35 9.05
                 C 24.55 8.75 25.55 9.85 25.35 11.05
                 C 25.15 12.1 24.05 12.75 23 12.45
                 C 21.95 12.15 21.45 11.05 21.85 10.05
                 C 22.1 9.4 22.75 9.05 23.35 9.05 Z"
            />
          </g>
        </svg>
      </a>
      <a class="global-footer-links__a" href="mailto:oolongradio@gmail.com">
        {{ locale.lang === 'kr' ? '문의' : 'Contact' }}
      </a>
    </footer>

    <!-- Artists 구간에서는 숨기고(v-show) 인스턴스는 유지해 전역 선 상태·애니메이션이 끊기지 않게 함 -->
    <InterventionCanvas v-show="!isArtistsRoute" />
  </div>
</template>

<script>
import { localeStore } from '@/store/locale.js'
import InterventionCanvas from '@/components/InterventionCanvas.vue'
import { randomOrganicHighlight } from '@/utils/organicHighlight.js'
export default {
  name: 'App',
  components: { InterventionCanvas },
  data() {
    return {
      locale: localeStore,
      navOrganicMain: randomOrganicHighlight('#000'),
      navOrganicLang: randomOrganicHighlight('#000'),
    }
  },
  mounted() {
    this.syncDocumentLang()
  },
  watch: {
    'locale.lang'() {
      this.syncDocumentLang()
    },
  },
  computed: {
    isArtistsRoute() {
      return this.$route.path.startsWith('/artists')
    },
  },
  methods: {
    syncDocumentLang() {
      document.documentElement.lang = this.locale.lang === 'kr' ? 'ko' : 'en'
    },
    toggleLang() {
      const newLang = this.locale.lang === 'kr' ? 'en' : 'kr'
      this.locale.setLang(newLang)
    },
  },
}
</script>

<style>
/* ... 전역 스타일 (스크롤바 등) 유지 ... */

::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: #ffffff;
}

::-webkit-scrollbar-thumb {
  background: #000000;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden;
  overflow-x: clip;
  background-color: #fff;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

#app-root {
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  background-color: #fff;
}
/* 네비게이션 컨테이너 수정 (화면 밖으로 나가는 문제 해결) */
.global-nav {
  position: fixed;
  top: 30px;
  left: 0;
  /* width: 100% 대신 오른쪽 끝까지 채우도록 설정 */
  right: 0;
  /* 5. padding이 width에 포함되도록 설정 (이미 * { box-sizing: border-box }가 있다면 괜찮음) */
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10000;
  pointer-events: none;
}

/* 두 버튼 공통 스타일 */
.nav-btn {
  pointer-events: auto;
  /* 글자색·배경은 organic-highlight.css */
  /* 1. 패딩 조절: 위아래 6px, 양옆 12px (필요에 따라 더 줄이세요) */
  padding: 6px 12px;
  font-size: 0.9rem;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;

  /* 2. 문제의 원인: 최소 폭을 제거하거나 아주 작게 설정 */
  min-width: auto;

  /* 3. 텍스트 크기에 딱 맞게 조절 */
  display: inline-flex;
  align-items: center;
  justify-content: center;

  /* 4. 글자가 한 줄로 나오게 고정 */
  white-space: nowrap;
}

.global-footer-links {
  position: fixed;
  z-index: 10000;
  right: 30px;
  bottom: calc(20px + env(safe-area-inset-bottom, 0px));
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.35rem;
  pointer-events: none;
}

.global-footer-links__ig-wrap {
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: #0a0a0a;
  line-height: 0;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  padding-bottom: 2px;
  transition:
    color 0.15s ease,
    border-color 0.15s ease,
    opacity 0.15s ease;
}

.global-footer-links__ig-wrap:hover {
  border-bottom-color: currentColor;
  opacity: 0.75;
}

.global-footer-links__ig-svg {
  display: block;
  width: min(18vw, 72px);
  height: min(18vw, 72px);
}

.global-footer-links__a {
  pointer-events: auto;
  font-size: 0.82rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: #0a0a0a;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition:
    color 0.15s ease,
    border-color 0.15s ease;
}

.global-footer-links__a:hover {
  border-bottom-color: currentColor;
  opacity: 0.75;
}

@media (max-width: 768px) {
  html,
  body {
    overscroll-behavior: none;
    overscroll-behavior-y: none;
    -webkit-tap-highlight-color: transparent;
  }

  button,
  a,
  input,
  select,
  textarea,
  label,
  summary,
  .nav-btn,
  .organic-highlight--btn,
  .paper-label,
  .ui-btn,
  .more-btn-inline,
  .close-x-btn,
  .random-name-item,
  .global-footer-links__a,
  .global-footer-links__ig-wrap {
    touch-action: manipulation;
  }

  .global-nav {
    top: 20px;
    padding: 0 20px;
  }

  .global-footer-links {
    right: 20px;
    bottom: calc(16px + env(safe-area-inset-bottom, 0px));
  }
}
</style>
