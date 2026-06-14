<!--
  텍스트 전용 메인.
-->
<template>
  <div class="home-text">
    <p class="home-text__menu" aria-label="Main menu">
      <template v-for="(item, idx) in menus" :key="item.path">
        <router-link v-if="!item.disabled" :to="item.path" class="home-text__link">
          <span class="home-text__split" :style="splitRandomStyleLatin(item)">
            <span class="home-text__split-ghost">
              <span class="home-text__en">{{ item.name }}</span>
            </span>
            <span class="home-text__split-half home-text__split-half--top" aria-hidden="true">
              <span class="home-text__en">{{ item.name }}</span>
            </span>
            <span class="home-text__split-half home-text__split-half--bottom" aria-hidden="true">
              <span class="home-text__en">{{ item.name }}</span>
            </span>
          </span>
          <span class="home-text__gap"> </span>
          <span class="home-text__split" :style="splitRandomStyleHangul(item)">
            <span class="home-text__split-ghost">
              <span class="home-text__ko">{{ item.koName }}</span>
            </span>
            <span class="home-text__split-half home-text__split-half--top" aria-hidden="true">
              <span class="home-text__ko">{{ item.koName }}</span>
            </span>
            <span class="home-text__split-half home-text__split-half--bottom" aria-hidden="true">
              <span class="home-text__ko">{{ item.koName }}</span>
            </span>
          </span>
        </router-link>
        <span v-else class="home-text__muted">
          <span class="home-text__split" :style="splitRandomStyleLatin(item)">
            <span class="home-text__split-ghost">
              <span class="home-text__en">{{ item.name }}</span>
            </span>
            <span class="home-text__split-half home-text__split-half--top" aria-hidden="true">
              <span class="home-text__en">{{ item.name }}</span>
            </span>
            <span class="home-text__split-half home-text__split-half--bottom" aria-hidden="true">
              <span class="home-text__en">{{ item.name }}</span>
            </span>
          </span>
          <span class="home-text__gap"> </span>
          <span class="home-text__split" :style="splitRandomStyleHangul(item)">
            <span class="home-text__split-ghost">
              <span class="home-text__ko">{{ item.koName }}</span>
            </span>
            <span class="home-text__split-half home-text__split-half--top" aria-hidden="true">
              <span class="home-text__ko">{{ item.koName }}</span>
            </span>
            <span class="home-text__split-half home-text__split-half--bottom" aria-hidden="true">
              <span class="home-text__ko">{{ item.koName }}</span>
            </span>
          </span>
        </span>
        <span v-if="idx < menus.length - 1" class="home-text__sep" aria-hidden="true">·</span>
      </template>
    </p>
    <div class="home-text__contact" aria-label="Social and contact links">
      <a
        class="home-text__contact-link"
        href="https://www.instagram.com/saifestival"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="home-text__split" :style="splitRandomStyleLatin(contactLinks[0])">
          <span class="home-text__split-ghost">
            <span class="home-text__en">Instagram</span>
          </span>
          <span class="home-text__split-half home-text__split-half--top" aria-hidden="true">
            <span class="home-text__en">Instagram</span>
          </span>
          <span class="home-text__split-half home-text__split-half--bottom" aria-hidden="true">
            <span class="home-text__en">Instagram</span>
          </span>
        </span>
        <span class="home-text__gap"> </span>
        <span class="home-text__split" :style="splitRandomStyleHangul(contactLinks[0])">
          <span class="home-text__split-ghost">
            <span class="home-text__ko">인스타그램</span>
          </span>
          <span class="home-text__split-half home-text__split-half--top" aria-hidden="true">
            <span class="home-text__ko">인스타그램</span>
          </span>
          <span class="home-text__split-half home-text__split-half--bottom" aria-hidden="true">
            <span class="home-text__ko">인스타그램</span>
          </span>
        </span>
      </a>
      <a class="home-text__contact-link" href="mailto:oolongradio@gmail.com">
        <span class="home-text__split" :style="splitRandomStyleLatin(contactLinks[1])">
          <span class="home-text__split-ghost">
            <span class="home-text__en">Contact</span>
          </span>
          <span class="home-text__split-half home-text__split-half--top" aria-hidden="true">
            <span class="home-text__en">Contact</span>
          </span>
          <span class="home-text__split-half home-text__split-half--bottom" aria-hidden="true">
            <span class="home-text__en">Contact</span>
          </span>
        </span>
        <span class="home-text__gap"> </span>
        <span class="home-text__split" :style="splitRandomStyleHangul(contactLinks[1])">
          <span class="home-text__split-ghost">
            <span class="home-text__ko">문의</span>
          </span>
          <span class="home-text__split-half home-text__split-half--top" aria-hidden="true">
            <span class="home-text__ko">문의</span>
          </span>
          <span class="home-text__split-half home-text__split-half--bottom" aria-hidden="true">
            <span class="home-text__ko">문의</span>
          </span>
        </span>
      </a>
    </div>
  </div>
</template>

<script>
import { SPLIT_SCALE_KO, SPLIT_SCALE_LATIN, splitShiftPx } from '@/utils/splitShift.js'

const HOME_MENU_ITEMS = [
  { name: 'About', koName: '사–이', path: '/about' },
  { name: 'Program', koName: '프로그램', path: '/program' },
  { name: 'Artists', koName: '아티스트', path: '/artists' },
  { name: 'Venue', koName: '장소', path: '/venue' },
  { name: 'Archive', koName: '아카이브', path: '/archive' },
  { name: 'Ticket', koName: '티켓', path: '/ticket' },
]

function homePathHash(s) {
  return s.split('').reduce((a, c) => ((Math.imul(a, 31) + c.charCodeAt(0)) | 0) >>> 0, 5381) >>> 0
}

export default {
  name: 'Home',
  data() {
    return {
      menus: HOME_MENU_ITEMS,
      contactLinks: [
        { name: 'Instagram', koName: '인스타그램', path: 'https://www.instagram.com/saifestival' },
        { name: 'Contact', koName: '문의', path: 'mailto:oolongradio@gmail.com' },
      ],
    }
  },
  methods: {
    splitShiftVars(seedStr, scale) {
      const key = homePathHash(seedStr)
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
      const topPx = signTop * base * topJitter * scale
      const botPx = signBot * base * botJitter * scale
      return {
        '--home-split-shift-top': splitShiftPx(topPx),
        '--home-split-shift-bottom': splitShiftPx(botPx),
      }
    },
    splitRandomStyleLatin(item) {
      return this.splitShiftVars(`${item.path}\0lat`, SPLIT_SCALE_LATIN)
    },
    splitRandomStyleHangul(item) {
      return this.splitShiftVars(`${item.path}\0ko`, SPLIT_SCALE_KO)
    },
  },
}
</script>

<style scoped>
.home-text {
  --home-split-merge-duration: 0.35s;
  --home-split-merge-easing: cubic-bezier(0.45, 0, 0.2, 1);
  position: relative;
  min-height: calc(var(--app-vh, 1vh) * 100);
  box-sizing: border-box;
  padding: clamp(24px, 6vw, 48px);
  background: transparent;
  color: #0a0a0a;
  font-size: 1rem;
  line-height: 1.65;
  word-break: keep-all;
  overflow-wrap: break-word;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.home-text__menu {
  position: relative;
  z-index: 1;
  margin: 0;
  text-align: center;
  font-family: var(--font-home-en);
  font-weight: var(--font-home-en-weight);
}

.home-text__contact {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.08rem;
  margin-top: 2rem;
  font-family: var(--font-home-en);
  font-size: 1rem;
  font-weight: var(--font-home-en-weight);
  line-height: 1.65;
}

.home-text__contact-link {
  display: block;
  background: transparent;
  color: #0a0a0a;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
}

.home-text__contact-link:visited,
.home-text__contact-link:active,
.home-text__contact-link:hover,
.home-text__contact-link:focus-visible {
  background: transparent;
  color: #0a0a0a;
  outline: none;
}

.home-text__contact-link:hover .home-text__en,
.home-text__contact-link:focus-visible .home-text__en,
.home-text__contact-link:hover .home-text__gap,
.home-text__contact-link:focus-visible .home-text__gap {
  text-shadow:
    0.016em 0 0 currentColor,
    -0.016em 0 0 currentColor;
}

.home-text__contact-link:hover .home-text__ko,
.home-text__contact-link:focus-visible .home-text__ko {
  text-shadow:
    0.012em 0 0 currentColor,
    -0.012em 0 0 currentColor;
}

.home-text__contact-link:hover .home-text__split-ghost,
.home-text__contact-link:focus-visible .home-text__split-ghost {
  opacity: 1;
}

.home-text__contact-link:hover .home-text__split-half,
.home-text__contact-link:focus-visible .home-text__split-half {
  opacity: 0;
}

.home-text__contact-link:hover .home-text__split::after,
.home-text__contact-link:focus-visible .home-text__split::after {
  opacity: 1;
}

/* 보이는 박스·접근성용 자리; 실제 그림은 .split-half */
.home-text__split {
  position: relative;
  display: inline-block;
  vertical-align: baseline;
}

.home-text__split::after {
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

.home-text__split-ghost {
  opacity: 0;
  pointer-events: none;
  user-select: none;
  transition: opacity var(--home-split-merge-duration) var(--home-split-merge-easing);
}

/* 전체 글자를 두 번 그린 뒤, 위/아래 반만 잘라 각각 좌·우로 밀기 */
.home-text__split-half {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  user-select: none;
  transition: opacity var(--home-split-merge-duration) var(--home-split-merge-easing);
}

/* 위·아래 이동량(px)은 splitRandomStyle(item)가 --home-split-shift-top/bottom 로 주입 */
.home-text__split-half--top {
  clip-path: inset(0 0 50% 0);
  transform: translateX(var(--home-split-shift-top, -1.5px));
}

.home-text__split-half--bottom {
  clip-path: inset(50% 0 0 0);
  transform: translateX(var(--home-split-shift-bottom, 1.5px));
}

@media (prefers-reduced-motion: reduce) {
  .home-text__split-ghost,
  .home-text__split-half {
    transition: none;
  }

  .home-text__en,
  .home-text__ko,
  .home-text__gap {
    transition: none;
  }

  .home-text__split-ghost {
    opacity: 1;
  }

  .home-text__split-half {
    display: none;
  }
}

.home-text__en {
  font-family: var(--font-home-en);
  font-weight: var(--font-home-en-weight);
  letter-spacing: normal;
  transition: text-shadow var(--home-split-merge-duration) var(--home-split-merge-easing);
}

.home-text__ko {
  font-family: var(--font-home-ko);
  font-weight: var(--font-home-ko-weight);
  transition: text-shadow var(--home-split-merge-duration) var(--home-split-merge-easing);
}

/* 영·한 사이: 글자(스페이스) + 좌우 여백 */
.home-text__gap {
  display: inline-block;
  font-family: var(--font-home-en);
  margin: 0 0.2em;
  white-space: pre;
  transition: text-shadow var(--home-split-merge-duration) var(--home-split-merge-easing);
}

.home-text__link {
  display: inline-block;
  background: transparent;
  color: #0a0a0a;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
}

.home-text__link:visited,
.home-text__link:active,
.home-text__link:hover,
.home-text__link:focus-visible {
  background: transparent;
  color: #0a0a0a;
}

.home-text__link:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 0.2em;
  border-radius: 2px;
}

/* 호버·포커스: 살짝 굵게(얇은 복제 실루엣) + 갈라짐 해제 */
.home-text__link:hover .home-text__en,
.home-text__link:focus-visible .home-text__en,
.home-text__link:hover .home-text__gap,
.home-text__link:focus-visible .home-text__gap {
  text-shadow:
    0.016em 0 0 currentColor,
    -0.016em 0 0 currentColor;
}

.home-text__link:hover .home-text__ko,
.home-text__link:focus-visible .home-text__ko {
  text-shadow:
    0.012em 0 0 currentColor,
    -0.012em 0 0 currentColor;
}

.home-text__link:hover .home-text__split-ghost,
.home-text__link:focus-visible .home-text__split-ghost {
  opacity: 1;
}

.home-text__link:hover .home-text__split-half,
.home-text__link:focus-visible .home-text__split-half {
  opacity: 0;
}

.home-text__link:hover .home-text__split::after,
.home-text__link:focus-visible .home-text__split::after {
  opacity: 1;
}

.home-text__muted {
  display: inline-block;
  opacity: 0.55;
}

.home-text__en,
.home-text__ko,
.home-text__gap,
.home-text__split,
.home-text__split-ghost,
.home-text__split-half {
  background: transparent;
}

.home-text__sep {
  user-select: none;
  font-family: var(--font-home-ko);
  font-size: 1.14em;
  vertical-align: 0.02em;
  margin: 0 0.18em;
}
</style>
