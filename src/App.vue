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

    <!-- Artists 구간에서도 인스턴스 유지(v-show)해야 홈에서 온 선 상태가 보존됨 -->
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
  /* 글자색·글로우는 organic-highlight.css (--btn) */
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
  .random-name-item {
    touch-action: manipulation;
  }

  .global-nav {
    top: 20px;
    padding: 0 20px;
  }
}
</style>
