<template>
  <div id="app-root">
    <nav
      v-if="displayedRoutePath !== '/'"
      class="global-nav"
      :class="{ 'global-nav--text-faded': navTextFaded }"
    >
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
        v-if="displayedRouteName === 'ArtistDetail'"
        type="button"
        class="nav-btn global-nav__btn global-nav__center-btn"
        :class="{
          'global-nav__btn--active': artistLineupOpen,
        }"
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

      <button
        v-if="displayedRouteName === 'Program'"
        type="button"
        class="nav-btn global-nav__btn global-nav__center-btn global-nav__program-toggle"
        :class="{ 'global-nav__btn--active': programMenuOpen }"
        @click.stop="toggleProgramMenu"
      >
        <span v-if="programMenuOpen" class="global-nav__active-text">
          <span :class="navTextClass('program')">{{ navLabel('program') }}</span>
        </span>
        <span v-else class="global-nav__split" :style="navSplitStyle('program')">
          <span class="global-nav__split-ghost">
            <span :class="navTextClass('program')">{{ navLabel('program') }}</span>
          </span>
          <span class="global-nav__split-half global-nav__split-half--top" aria-hidden="true">
            <span :class="navTextClass('program')">{{ navLabel('program') }}</span>
          </span>
          <span class="global-nav__split-half global-nav__split-half--bottom" aria-hidden="true">
            <span :class="navTextClass('program')">{{ navLabel('program') }}</span>
          </span>
        </span>
      </button>

      <div
        v-if="displayedRouteName === 'Program' && programMenuOpen"
        class="global-nav__program-menu"
        @click.stop
      >
        <button
          v-for="item in programNavItems"
          :key="item.id"
          type="button"
          class="global-nav__program-item"
          @click="scrollToProgramSection(item.id)"
        >
          <span :class="navTextClass('program')">{{ item.label }}</span>
        </button>
      </div>

      <button type="button" class="nav-btn global-nav__btn" @click="toggleLang($event)">
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
        <transition
          name="page-fade"
          mode="out-in"
          @before-leave="onPageBeforeLeave"
          @after-enter="onPageAfterEnter"
        >
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
const SCROLLBAR_REVEAL_MS = 520

function navSeedHash(s) {
  return s.split('').reduce((a, c) => ((Math.imul(a, 31) + c.charCodeAt(0)) | 0) >>> 0, 5381) >>> 0
}

export default {
  name: 'App',
  data() {
    return {
      locale: localeStore,
      artistLineupOpen: false,
      programMenuOpen: false,
      activeScrollbarElements: new Set(),
      scrollbarRevealTimers: new WeakMap(),
      scrollSaveFrame: null,
      navTextFaded: false,
      displayedRouteName: null,
      displayedRoutePath: null,
    }
  },
  mounted() {
    this.syncDocumentLang()
    this.syncDisplayedRoute()
    window.addEventListener('artists-lineup-state', this.onArtistLineupState)
    window.addEventListener('click', this.handleMobileLinkClick, true)
    document.addEventListener('scroll', this.revealScrollbarDuringScroll, true)
  },
  beforeUnmount() {
    window.removeEventListener('artists-lineup-state', this.onArtistLineupState)
    window.removeEventListener('click', this.handleMobileLinkClick, true)
    document.removeEventListener('scroll', this.revealScrollbarDuringScroll, true)
    if (this.scrollSaveFrame) {
      window.cancelAnimationFrame(this.scrollSaveFrame)
    }
    this.activeScrollbarElements.forEach((element) => {
      window.clearTimeout(this.scrollbarRevealTimers.get(element))
      element.classList.remove('is-scrolling')
    })
    this.activeScrollbarElements.clear()
  },
  watch: {
    'locale.lang'() {
      this.syncDocumentLang()
      this.programMenuOpen = false
    },
    '$route.name'() {
      this.artistLineupOpen = false
      this.programMenuOpen = false
    },
  },
  computed: {
    programNavItems() {
      const isKo = this.locale.lang === 'kr'
      return [
        { id: 'exhibition', label: isKo ? '전시' : 'Exhibition' },
        { id: 'performance', label: isKo ? '퍼포먼스' : 'Performance' },
        { id: 'workshop', label: isKo ? '워크숍/렉쳐' : 'Workshop/Lecture' },
      ]
    },
  },
  methods: {
    syncDocumentLang() {
      document.documentElement.lang = this.locale.lang === 'kr' ? 'ko' : 'en'
    },
    syncDisplayedRoute() {
      this.displayedRouteName = this.$route.name
      this.displayedRoutePath = this.$route.path
    },
    onPageBeforeLeave() {
      this.navTextFaded = true
    },
    onPageAfterEnter() {
      this.navTextFaded = false
      this.syncDisplayedRoute()
    },
    toggleLang(event) {
      const newLang = this.locale.lang === 'kr' ? 'en' : 'kr'
      if (this.shouldDelayMobileLinks()) {
        const button = event?.currentTarget
        button?.classList.add('is-mobile-activating')
        window.setTimeout(() => {
          button?.classList.remove('is-mobile-activating')
          this.locale.setLang(newLang)
          button?.blur?.()
        }, MOBILE_LINK_DELAY_MS)
        return
      }

      this.locale.setLang(newLang)
      event?.currentTarget?.blur?.()
    },
    toggleArtistLineup() {
      window.dispatchEvent(new Event('artists-lineup-toggle'))
    },
    toggleProgramMenu() {
      this.programMenuOpen = !this.programMenuOpen
    },
    scrollToProgramSection(id) {
      this.programMenuOpen = false
      const section = document.getElementById(id)
      if (!section) return

      const navHeight = document.querySelector('.global-nav')?.getBoundingClientRect().height || 0
      const top = section.getBoundingClientRect().top + window.scrollY - navHeight - 8
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
      window.history.replaceState(null, '', `${this.$route.path}#${id}`)
    },
    onArtistLineupState(event) {
      this.artistLineupOpen = Boolean(event.detail?.open)
    },
    revealScrollbarDuringScroll(event) {
      const target =
        event.target === document
          ? document.scrollingElement || document.documentElement
          : event.target

      if (!(target instanceof Element)) return

      target.classList.add('is-scrolling')
      this.activeScrollbarElements.add(target)

      window.clearTimeout(this.scrollbarRevealTimers.get(target))
      this.scrollbarRevealTimers.set(
        target,
        window.setTimeout(() => {
          target.classList.remove('is-scrolling')
          this.activeScrollbarElements.delete(target)
        }, SCROLLBAR_REVEAL_MS),
      )
    },
    shouldDelayMobileLinks() {
      if (typeof window === 'undefined') return false
      return window.matchMedia('(hover: none), (pointer: coarse), (max-width: 768px)').matches
    },
    handleMobileLinkClick(event) {
      if (!this.shouldDelayMobileLinks()) return
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }

      const link = event.target?.closest?.('a[href]')
      if (!link || link.dataset.mobileDelay === 'skip' || link.dataset.mobileActivating === 'true')
        return
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
      if (kind === 'lineup') return this.locale.lang === 'kr' ? '아티스트' : 'Artists'
      if (kind === 'program') return this.locale.lang === 'kr' ? '프로그램' : 'PROGRAM'
      return this.locale.lang === 'kr' ? 'EN' : '한글'
    },
    navTextClass(kind) {
      const isKo =
        (kind === 'main' && this.locale.lang === 'kr') ||
        (kind === 'lineup' && this.locale.lang === 'kr') ||
        (kind === 'program' && this.locale.lang === 'kr') ||
        (kind === 'language' && this.locale.lang !== 'kr')
      return isKo ? 'global-nav__ko' : 'global-nav__en'
    },
    navSplitStyle(kind) {
      const isKo = this.navTextClass(kind) === 'global-nav__ko'
      const scale = isKo ? 0.56 : NAV_SPLIT_SCALE_LATIN
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
html::-webkit-scrollbar,
body::-webkit-scrollbar,
*::-webkit-scrollbar {
  width: 1px;
  height: 1px;
}

html::-webkit-scrollbar-button,
body::-webkit-scrollbar-button,
*::-webkit-scrollbar-button {
  display: none;
  width: 0;
  height: 0;
}

html::-webkit-scrollbar-track,
body::-webkit-scrollbar-track,
*::-webkit-scrollbar-track,
html::-webkit-scrollbar-track-piece,
body::-webkit-scrollbar-track-piece,
*::-webkit-scrollbar-track-piece {
  background: transparent;
}

html::-webkit-scrollbar-thumb,
body::-webkit-scrollbar-thumb,
*::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 0;
}

.is-scrolling::-webkit-scrollbar-thumb {
  background: #000;
}

html,
body,
* {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}

.is-scrolling {
  scrollbar-color: #000 transparent;
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
    background-color: #fff;
    background-image:
      linear-gradient(180deg, rgba(0, 0, 0, 0.012), transparent 38%, rgba(0, 0, 0, 0.01)),
      radial-gradient(circle at 18% 24%, rgba(0, 0, 0, 0.028) 0 0.55px, transparent 0.65px),
      radial-gradient(circle at 72% 64%, rgba(0, 0, 0, 0.022) 0 0.45px, transparent 0.55px);
    background-size:
      100% 100%,
      9px 9px,
      13px 13px;
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

.global-nav__program-toggle,
.global-nav__program-menu {
  display: none;
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

.global-nav__btn,
.global-nav__program-menu {
  transition: opacity 0.18s ease;
}

.global-nav--text-faded .global-nav__btn,
.global-nav--text-faded .global-nav__program-menu {
  opacity: 0;
}

.global-nav__active-text {
  position: relative;
  display: inline-block;
  background: #fff;
}

.global-nav__active-text::after {
  content: '';
  position: absolute;
  left: -0.03em;
  right: -0.03em;
  top: 50%;
  z-index: 3;
  border-top: 0.08em solid currentColor;
  pointer-events: none;
  transform: translateY(-50%);
}

.global-nav__split-ghost > span,
.global-nav__split-half > span,
.global-nav__active-text > span {
  background: #fff;
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
.is-mobile-activating .venue-page__split-ghost,
.is-mobile-activating .about-page__split-ghost {
  opacity: 1;
}

.is-mobile-activating .home-text__split-half,
.is-mobile-activating .global-nav__split-half,
.is-mobile-activating .program-day__split-half,
.is-mobile-activating .venue-page__split-half,
.is-mobile-activating .about-page__split-half {
  opacity: 0;
}

.is-mobile-activating .home-text__split::after,
.is-mobile-activating .global-nav__split::after,
.is-mobile-activating .program-day__split::after,
.is-mobile-activating .venue-page__split::after,
.is-mobile-activating .about-page__split::after {
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

.global-nav .global-nav__program-toggle,
.global-nav .global-nav__program-menu {
  display: none;
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
    top: 0;
    padding: calc(20px + env(safe-area-inset-top, 0px)) 20px 14px;
    background: #fff;
  }

  .global-nav__btn:hover .global-nav__split-ghost,
  .global-nav__btn:focus-visible .global-nav__split-ghost,
  .global-nav__btn:hover .global-nav__split::after,
  .global-nav__btn:focus-visible .global-nav__split::after {
    opacity: 0;
  }

  .global-nav__btn:hover .global-nav__split-half,
  .global-nav__btn:focus-visible .global-nav__split-half {
    opacity: 1;
  }

  .global-nav__active-text,
  .global-nav__split-ghost > span,
  .global-nav__split-half > span,
  .global-nav__active-text > span {
    background: transparent;
  }

  .global-nav .global-nav__program-toggle {
    display: inline-flex;
  }

  .global-nav .global-nav__program-menu {
    position: absolute;
    top: calc(100% - 0.15rem);
    left: 50%;
    z-index: 1;
    display: grid;
    gap: 0.08rem;
    padding: 0.3rem 0.65rem 0.45rem;
    background: #fff;
    pointer-events: auto;
    transform: translateX(-50%);
  }

  .global-nav__program-item {
    display: block;
    padding: 0.12rem 0;
    border: 0;
    background: transparent;
    color: #0a0a0a;
    font: inherit;
    font-size: 0.9rem;
    line-height: 1.42;
    text-align: center;
    white-space: nowrap;
    cursor: pointer;
  }
}
</style>
