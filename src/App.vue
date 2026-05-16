<template>
  <div id="app-root">
    <nav v-if="$route.path !== '/'" class="global-nav">
      <router-link to="/" class="nav-btn global-nav__btn">
        <span class="global-nav__split" :style="navSplitStyle('main')">
          <span class="global-nav__split-ghost">
            <span :class="navTextClass('main')">{{ navLabel('main') }}</span>
          </span>
          <span class="global-nav__split-half global-nav__split-half--top" aria-hidden="true">
            <span :class="navTextClass('main')">{{ navLabel('main') }}</span>
          </span>
          <span class="global-nav__split-half global-nav__split-half--bottom" aria-hidden="true">
            <span :class="navTextClass('main')">{{ navLabel('main') }}</span>
          </span>
        </span>
      </router-link>

      <button
        v-if="$route.name === 'ArtistDetail'"
        type="button"
        class="nav-btn global-nav__btn global-nav__center-btn"
        :class="{ 'global-nav__btn--active': artistLineupOpen }"
        @click="toggleArtistLineup"
      >
        <span v-if="artistLineupOpen" class="global-nav__active-text">
          <span :class="navTextClass('lineup')">{{ navLabel('lineup') }}</span>
        </span>
        <span v-else class="global-nav__split" :style="navSplitStyle('lineup')">
          <span class="global-nav__split-ghost">
            <span :class="navTextClass('lineup')">{{ navLabel('lineup') }}</span>
          </span>
          <span class="global-nav__split-half global-nav__split-half--top" aria-hidden="true">
            <span :class="navTextClass('lineup')">{{ navLabel('lineup') }}</span>
          </span>
          <span class="global-nav__split-half global-nav__split-half--bottom" aria-hidden="true">
            <span :class="navTextClass('lineup')">{{ navLabel('lineup') }}</span>
          </span>
        </span>
      </button>

      <button type="button" class="nav-btn global-nav__btn" @click="toggleLang">
        <span class="global-nav__split" :style="navSplitStyle('language')">
          <span class="global-nav__split-ghost">
            <span :class="navTextClass('language')">{{ navLabel('language') }}</span>
          </span>
          <span class="global-nav__split-half global-nav__split-half--top" aria-hidden="true">
            <span :class="navTextClass('language')">{{ navLabel('language') }}</span>
          </span>
          <span class="global-nav__split-half global-nav__split-half--bottom" aria-hidden="true">
            <span :class="navTextClass('language')">{{ navLabel('language') }}</span>
          </span>
        </span>
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

const NAV_SPLIT_SCALE_LATIN = 0.56
const MOBILE_LINK_DELAY_MS = 360

function navSeedHash(s) {
  return s.split('').reduce((a, c) => ((Math.imul(a, 31) + c.charCodeAt(0)) | 0) >>> 0, 5381) >>> 0
}

export default {
  name: 'App',
  data() {
    return {
      locale: localeStore,
      artistLineupOpen: false,
    }
  },
  mounted() {
    this.syncDocumentLang()
    window.addEventListener('artists-lineup-state', this.onArtistLineupState)
    window.addEventListener('click', this.handleMobileLinkClick, true)
  },
  beforeUnmount() {
    window.removeEventListener('artists-lineup-state', this.onArtistLineupState)
    window.removeEventListener('click', this.handleMobileLinkClick, true)
  },
  watch: {
    'locale.lang'() {
      this.syncDocumentLang()
    },
    '$route.name'() {
      this.artistLineupOpen = false
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
    toggleArtistLineup() {
      window.dispatchEvent(new Event('artists-lineup-toggle'))
    },
    onArtistLineupState(event) {
      this.artistLineupOpen = Boolean(event.detail?.open)
    },
    shouldDelayMobileLinks() {
      if (typeof window === 'undefined') return false
      return window.matchMedia('(hover: none), (pointer: coarse), (max-width: 768px)').matches
    },
    handleMobileLinkClick(event) {
      if (!this.shouldDelayMobileLinks()) return
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return
      }

      const link = event.target?.closest?.('a[href]')
      if (!link || link.dataset.mobileDelay === 'skip' || link.dataset.mobileActivating === 'true') return
      if (link.hasAttribute('download') || link.getAttribute('aria-disabled') === 'true') return

      const href = link.getAttribute('href')
      if (!href || href.startsWith('#')) return

      event.preventDefault()
      event.stopPropagation()

      link.dataset.mobileActivating = 'true'
      link.classList.add('is-mobile-activating')

      window.setTimeout(() => {
        link.classList.remove('is-mobile-activating')
        link.dataset.mobileActivating = 'false'

        if (href.startsWith('mailto:') || href.startsWith('tel:')) {
          window.location.href = href
          return
        }

        const url = new URL(href, window.location.href)
        if (url.origin === window.location.origin) {
          this.$router.push(`${url.pathname}${url.search}${url.hash}`)
          return
        }

        window.location.href = url.href
      }, MOBILE_LINK_DELAY_MS)
    },
    navLabel(kind) {
      if (kind === 'main') return this.locale.lang === 'kr' ? '메인' : 'MAIN'
      if (kind === 'lineup') return this.locale.lang === 'kr' ? '라인업' : 'LINE-UP'
      return this.locale.lang === 'kr' ? 'EN' : '한글'
    },
    navTextClass(kind) {
      const isKo =
        (kind === 'main' && this.locale.lang === 'kr') ||
        (kind === 'lineup' && this.locale.lang === 'kr') ||
        (kind === 'language' && this.locale.lang !== 'kr')
      return isKo ? 'global-nav__ko' : 'global-nav__en'
    },
    navSplitStyle(kind) {
      const isKo = this.navTextClass(kind) === 'global-nav__ko'
      const scale = isKo ? 1 : NAV_SPLIT_SCALE_LATIN
      const key = navSeedHash(`${kind}:${this.navLabel(kind)}`)
      const u = (n) => {
        let h = Math.imul((key + n) ^ 0x9e3779b9, 0x9e3779b9) >>> 0
        h = (h ^ (h >>> 16)) >>> 0
        h = Math.imul(h, 2246822507) >>> 0
        return h / 4294967296
      }
      const invert = u(101) >= 0.5
      const base = 0.95 + u(7) * 1.15
      const topJitter = 0.88 + u(13) * 0.3
      const botJitter = 0.88 + u(29) * 0.3
      const signTop = invert ? 1 : -1
      const signBot = invert ? -1 : 1
      return {
        '--nav-split-shift-top': `${(signTop * base * topJitter * scale).toFixed(2)}px`,
        '--nav-split-shift-bottom': `${(signBot * base * botJitter * scale).toFixed(2)}px`,
      }
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
  min-height: 100%;
  overflow-x: hidden;
  overflow-x: clip;
  background-color: #fff;
  color: rgba(10, 10, 10, 0.82);
  -webkit-font-smoothing: subpixel-antialiased;
  text-shadow:
    0 0 0.7px rgba(10, 10, 10, 0.42),
    0.42px 0.24px 0 rgba(10, 10, 10, 0.2),
    -0.28px -0.12px 0 rgba(10, 10, 10, 0.12);
}

html::before {
  content: '';
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2147483647;
  pointer-events: none;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.2), transparent 34%, rgba(0, 0, 0, 0.018)),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='320' viewBox='0 0 320 320'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.94' numOctaves='5' seed='31'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='table' tableValues='0.12 0.88'/%3E%3CfeFuncG type='table' tableValues='0.12 0.88'/%3E%3CfeFuncB type='table' tableValues='0.12 0.88'/%3E%3CfeFuncA type='table' tableValues='0.14 0.54'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='320' height='320' filter='url(%23noise)' opacity='0.8'/%3E%3C/svg%3E");
  background-size:
    100% 100%,
    320px 320px;
  opacity: 0.52;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* 전역 텍스트 질감: 프린트 후 스캔한 듯한 아주 약한 번짐 */
:where(
  a,
  button,
  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  span,
  li,
  dt,
  dd,
  label,
  small,
  strong,
  em,
  figcaption,
  blockquote
) {
  text-shadow:
    0 0 0.7px rgba(10, 10, 10, 0.42),
    0.42px 0.24px 0 rgba(10, 10, 10, 0.2),
    -0.28px -0.12px 0 rgba(10, 10, 10, 0.12);
}

:where(img, svg, canvas, video, picture, iframe) {
  filter: none;
  text-shadow: none;
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.34s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .page-fade-enter-active,
  .page-fade-leave-active {
    transition-duration: 0.01ms;
  }
}

@media (max-width: 768px), (hover: none), (pointer: coarse) {
  html::before {
    display: none;
  }

  html,
  body {
    text-shadow:
      0 0 0.35px rgba(10, 10, 10, 0.28),
      0.2px 0.12px 0 rgba(10, 10, 10, 0.12);
  }

  :where(
    a,
    button,
    p,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    span,
    li,
    dt,
    dd,
    label,
    small,
    strong,
    em,
    figcaption,
    blockquote
  ) {
    filter: blur(0.13px) contrast(1.05);
  }
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

.global-nav__center-btn {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
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
}

.global-nav .nav-btn.global-nav__btn:hover,
.global-nav .nav-btn.global-nav__btn:focus-visible {
  background: transparent;
  color: #0a0a0a;
  outline: none;
}

.global-nav__active-text {
  display: inline-block;
  text-decoration: line-through;
  text-decoration-thickness: 0.08em;
  text-decoration-color: currentColor;
}

.global-nav__split {
  --home-split-merge-duration: 0.35s;
  --home-split-merge-easing: cubic-bezier(0.45, 0, 0.2, 1);
  position: relative;
  display: inline-block;
  vertical-align: baseline;
}

.global-nav__split::after {
  content: '';
  position: absolute;
  left: -0.03em;
  right: -0.03em;
  top: 50%;
  z-index: 3;
  border-top: 0.08em solid currentColor;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-50%);
  transition: opacity var(--home-split-merge-duration) var(--home-split-merge-easing);
}

.global-nav__split-ghost {
  opacity: 0;
  pointer-events: none;
  user-select: none;
  transition: opacity var(--home-split-merge-duration) var(--home-split-merge-easing);
}

.global-nav__split-half {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  user-select: none;
  transition: opacity var(--home-split-merge-duration) var(--home-split-merge-easing);
}

.global-nav__split-half--top {
  clip-path: inset(0 0 50% 0);
  transform: translateX(var(--nav-split-shift-top, -1.5px));
}

.global-nav__split-half--bottom {
  clip-path: inset(50% 0 0 0);
  transform: translateX(var(--nav-split-shift-bottom, 1.5px));
}

.global-nav__btn:hover .global-nav__split-ghost,
.global-nav__btn:focus-visible .global-nav__split-ghost {
  opacity: 1;
}

.global-nav__btn:hover .global-nav__split-half,
.global-nav__btn:focus-visible .global-nav__split-half {
  opacity: 0;
}

.global-nav__btn:hover .global-nav__split::after,
.global-nav__btn:focus-visible .global-nav__split::after {
  opacity: 1;
}

.is-mobile-activating .home-text__split-ghost,
.is-mobile-activating .global-nav__split-ghost,
.is-mobile-activating .program-day__split-ghost,
.is-mobile-activating .venue-page__split-ghost {
  opacity: 1;
}

.is-mobile-activating .home-text__split-half,
.is-mobile-activating .global-nav__split-half,
.is-mobile-activating .program-day__split-half,
.is-mobile-activating .venue-page__split-half {
  opacity: 0;
}

.is-mobile-activating .home-text__split::after,
.is-mobile-activating .global-nav__split::after,
.is-mobile-activating .program-day__split::after,
.is-mobile-activating .venue-page__split::after {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .global-nav__split-ghost,
  .global-nav__split-half {
    transition: none;
  }

  .global-nav__split-ghost {
    opacity: 1;
  }

  .global-nav__split-half {
    display: none;
  }
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
  .paper-label {
    touch-action: manipulation;
  }

  .global-nav {
    top: 20px;
    padding: 0 20px;
  }
}
</style>
