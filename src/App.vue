<template>
  <div id="app-root">
    <nav v-if="$route.path !== '/'" class="global-nav">
      <router-link to="/" class="nav-btn global-nav__btn">
        <span v-if="locale.lang === 'kr'" class="global-nav__ko">메인</span>
        <span v-else class="global-nav__en">MAIN</span>
      </router-link>

      <button type="button" class="nav-btn global-nav__btn" @click="toggleLang">
        <span v-if="locale.lang === 'kr'" class="global-nav__en">EN</span>
        <span v-else class="global-nav__ko">한글</span>
      </button>
    </nav>

    <main class="router-stage">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script>
import { localeStore } from '@/store/locale.js'

export default {
  name: 'App',
  data() {
    return {
      locale: localeStore,
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
  min-height: 100vh;
  min-height: 100dvh;
}

.router-stage {
  flex: 1 0 auto;
  width: 100%;
  position: relative;
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

/* 두 버튼: 홈 메뉴와 같은 산세리프/명조, 검정 글자·배경 없음 */
.global-nav__en {
  font-family: var(--font-home-en);
  font-weight: var(--font-home-en-weight);
  letter-spacing: 0.055em;
  color: inherit;
}

.global-nav__ko {
  font-family: var(--font-home-ko);
  font-weight: var(--font-home-ko-weight);
  color: inherit;
}

.global-nav .nav-btn.global-nav__btn {
  background: transparent;
  color: #0a0a0a;
  border: none;
  box-shadow: none;
  text-shadow: none;
}

.global-nav .nav-btn.global-nav__btn:hover,
.global-nav .nav-btn.global-nav__btn:focus-visible {
  background: transparent;
  color: #0a0a0a;
  opacity: 0.55;
  outline: none;
}

/* 두 버튼 공통 스타일 */
.nav-btn {
  pointer-events: auto;
  /* 1. 패딩 조절: 위아래 6px, 양옆 12px (필요에 따라 더 줄이세요) */
  padding: 6px 12px;
  font-size: 0.9rem;
  text-decoration: none;
  cursor: pointer;
  transition:
    opacity 0.15s ease,
    color 0.15s ease;

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
  .lineup-name-link,
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
