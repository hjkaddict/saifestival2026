<template>
  <main
    class="about-page app-min-vh"
    :class="[
      locale.lang === 'kr' ? 'about-page--ko' : 'about-page--en',
      { 'about-page--scrolling': isScrolling },
    ]"
  >
    <article class="about-page__inner" :key="locale.lang">
      <section class="about-page__body" v-html="aboutContent"></section>

      <section class="about-page__team" aria-labelledby="festival-team-heading">
        <h1 id="festival-team-heading" class="about-page__team-heading">{{ teamHeading }}</h1>
        <dl class="about-page__team-list">
          <div v-for="(section, idx) in teamSections" :key="idx" class="about-page__team-row">
            <dt class="about-page__team-role">{{ section.role }}</dt>
            <dd class="about-page__team-members">
              <template v-for="(member, mi) in section.members" :key="mi">
                <span v-if="mi > 0" class="about-page__team-sep">, </span>
                <a
                  v-if="member.url"
                  class="about-page__team-link"
                  :href="member.url"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span class="about-page__split" :style="memberSplitStyle(member.name, idx, mi)">
                    <span class="about-page__split-ghost">{{ member.name }}</span>
                    <span
                      class="about-page__split-half about-page__split-half--top"
                      aria-hidden="true"
                    >
                      {{ member.name }}
                    </span>
                    <span
                      class="about-page__split-half about-page__split-half--bottom"
                      aria-hidden="true"
                    >
                      {{ member.name }}
                    </span>
                  </span>
                </a>
                <span v-else class="about-page__team-name">
                  <span class="about-page__split" :style="memberSplitStyle(member.name, idx, mi)">
                    <span class="about-page__split-ghost">{{ member.name }}</span>
                    <span
                      class="about-page__split-half about-page__split-half--top"
                      aria-hidden="true"
                    >
                      {{ member.name }}
                    </span>
                    <span
                      class="about-page__split-half about-page__split-half--bottom"
                      aria-hidden="true"
                    >
                      {{ member.name }}
                    </span>
                  </span>
                </span>
              </template>
            </dd>
          </div>
        </dl>
      </section>
    </article>

    <aside class="about-page__scroll-poem" aria-hidden="true">
      <div class="about-page__scroll-poem-inner">
        <p
          v-for="(line, idx) in scrollPoemLines"
          :key="idx"
          class="about-page__scroll-poem-line"
          :class="{ 'about-page__scroll-poem-line--spacer': line === '' }"
        >
          <span
            v-for="(part, partIdx) in splitScrollPoemLine(line)"
            :key="`${idx}-${partIdx}`"
            class="about-page__scroll-poem-part"
            :class="`about-page__scroll-poem-part--${part.type}`"
          >
            {{ part.text }}
          </span>
        </p>
      </div>
    </aside>
  </main>
</template>

<script>
import { localeStore } from '@/store/locale.js'
import { aboutData } from '@/assets/data/about.js'
import { festivalTeamHeading, getFestivalTeam } from '@/assets/data/festivalTeam.js'

const ABOUT_SPLIT_SCALE_LATIN = 0.56

function textSeedHash(s) {
  return s.split('').reduce((a, c) => ((Math.imul(a, 31) + c.charCodeAt(0)) | 0) >>> 0, 5381) >>> 0
}

export default {
  name: 'About',
  data() {
    return {
      locale: localeStore,
      isScrolling: false,
      scrollRevealTimer: null,
    }
  },
  mounted() {
    window.addEventListener('scroll', this.revealTextDuringScroll, { passive: true })
    document.addEventListener('scroll', this.revealTextDuringScroll, true)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.revealTextDuringScroll)
    document.removeEventListener('scroll', this.revealTextDuringScroll, true)
    window.clearTimeout(this.scrollRevealTimer)
  },
  computed: {
    aboutContent() {
      return this.revealScrollOnlyText(aboutData[this.locale.lang] || aboutData.en)
    },
    teamHeading() {
      return festivalTeamHeading[this.locale.lang] || festivalTeamHeading.en
    },
    teamSections() {
      return getFestivalTeam(this.locale.lang)
    },
    scrollPoemLines() {
      const isKo = this.locale.lang === 'kr'

      if (!isKo) {
        return [
          'The unfamiliar',
          'somehow, with one another',
          '',
          'mingle',
          'intervene',
          'linger',
          '',
          'to intrude or not;',
          'to allow others in or not;',
          '… to step in or not…',
          '',
          'whether this is all for fun',
          '… or for work…',
          '',
          ,
        ]
      }

      return [
        '낯선 것들이',
        '어이없게',
        '',
        '뒤섞이고',
        '개입하고',
        '머무르고',
        '',
        '끼어들까 말까',
        '내어줄까 말까,',
        '들어갈까 말까',
        '',
        '이게 노는건지',
        '작업인건지…',
        '',
        ,
      ]
    },
  },
  methods: {
    revealScrollOnlyText(content) {
      const paragraphs = String(content || '').split(/\n\s*\n/)
      if (paragraphs.length < 2) return content

      paragraphs[0] = `<span class="about-page__scroll-only">${paragraphs[0]}</span>`
      if (this.locale.lang === 'kr') {
        paragraphs[1] = paragraphs[1].replace(
          /^(\s*)(하지만)/,
          '$1<span class="about-page__scroll-only">$2</span>',
        )
      } else {
        paragraphs[1] = paragraphs[1].replace(
          /^(\s*)(However,)\s+(do)\b/,
          '$1<span class="about-page__scroll-only">$2</span> <span class="about-page__case-swap"><span class="about-page__case-swap-before">$3</span><span class="about-page__case-swap-during">Do</span></span>',
        )
      }

      return paragraphs.join('\n\n')
    },
    revealTextDuringScroll() {
      this.isScrolling = true
      window.clearTimeout(this.scrollRevealTimer)
      this.scrollRevealTimer = window.setTimeout(() => {
        this.isScrolling = false
      }, 120)
    },
    splitScrollPoemLine(line) {
      const text = String(line || '')
      if (!text) return [{ type: 'ko', text: '' }]
      return text
        .split(/([A-Za-z][A-Za-z\s'’.-]*[A-Za-z.?!…]?)/g)
        .filter((part) => part.length)
        .map((part) => ({
          text: part,
          type: /[A-Za-z]/.test(part) ? 'en' : 'ko',
        }))
    },
    memberSplitStyle(name, sectionIdx, memberIdx) {
      const scale = this.locale.lang === 'kr' ? 1 : ABOUT_SPLIT_SCALE_LATIN
      const key = textSeedHash(`${this.locale.lang}\0${sectionIdx}\0${memberIdx}\0${name}`)
      const u = (n) => {
        let h = Math.imul((key + n) ^ 0x9e3779b9, 0x9e3779b9) >>> 0
        h = (h ^ (h >>> 16)) >>> 0
        h = Math.imul(h, 2246822507) >>> 0
        return h / 4294967296
      }
      const invert = u(101) >= 0.5
      const base = (0.95 + u(7) * 1.15) * scale
      return {
        '--about-split-shift-top': `${((invert ? 1 : -1) * base * (0.88 + u(13) * 0.3)).toFixed(2)}px`,
        '--about-split-shift-bottom': `${((invert ? -1 : 1) * base * (0.88 + u(29) * 0.3)).toFixed(2)}px`,
      }
    },
  },
}
</script>

<style scoped>
.about-page {
  box-sizing: border-box;
  width: 100%;
  padding: clamp(72px, 12vw, 132px) clamp(20px, 8vw, 112px);
  background: rgba(255, 255, 255, 0.86);
  color: rgba(10, 10, 10, 0.82);
}

.about-page__inner {
  width: min(100%, 42rem);
  margin: 0 auto;
  filter: blur(0.22px) contrast(1.08);
  -webkit-font-smoothing: subpixel-antialiased;
  transition: opacity 0.48s cubic-bezier(0.45, 0, 0.2, 1);
  text-shadow:
    0 0 0.7px rgba(10, 10, 10, 0.42),
    0.42px 0.24px 0 rgba(10, 10, 10, 0.2),
    -0.28px -0.12px 0 rgba(10, 10, 10, 0.12);
}

.about-page--scrolling .about-page__inner {
  opacity: 0.42;
  transition-duration: 0.08s;
}

.about-page--en .about-page__inner {
  font-family: var(--font-home-en);
  font-weight: 100;
}

.about-page--en .about-page__scroll-poem-inner {
  font-family: var(--font-home-en);
  font-weight: 100;
}

.about-page--ko .about-page__inner {
  font-family: var(--font-home-ko);
  font-weight: 100;
}

.about-page--ko .about-page__scroll-poem-inner {
  font-family: var(--font-home-ko);
  font-weight: 100;
}

.about-page__body {
  font-size: 1rem;
  line-height: 1.42;
  letter-spacing: 0.006em;
  white-space: pre-wrap;
  word-break: keep-all;
  overflow-wrap: break-word;
  text-align: left;
}

.about-page__body :deep(i) {
  font-style: italic;
}

.about-page__body :deep(.about-page__scroll-only) {
  text-decoration: line-through;
  transition: opacity 0.48s cubic-bezier(0.45, 0, 0.2, 1);
}

.about-page--scrolling .about-page__body :deep(.about-page__scroll-only) {
  opacity: 0;
  transition-duration: 0.08s;
}

.about-page__body :deep(.about-page__case-swap-during) {
  display: none;
}

.about-page--scrolling .about-page__body :deep(.about-page__case-swap-before) {
  display: none;
}

.about-page--scrolling .about-page__body :deep(.about-page__case-swap-during) {
  display: inline;
}

.about-page__scroll-poem {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: grid;
  place-items: center;
  padding: clamp(72px, 12vw, 132px) clamp(20px, 8vw, 112px);
  background: rgba(255, 255, 255, 0.38);
  opacity: 0;
  pointer-events: none;
  transition: opacity 1.8s cubic-bezier(0.45, 0, 0.2, 1);
}

.about-page--scrolling .about-page__scroll-poem {
  opacity: 1;
  transition-duration: 0.08s;
}

.about-page__scroll-poem-inner {
  width: min(100%, 42rem);
  color: rgba(10, 10, 10, 0.88);
  font-size: 1rem;
  line-height: 1.42;
  letter-spacing: 0.006em;
  text-align: left;
  filter: blur(0.12px) contrast(1.08);
  -webkit-font-smoothing: subpixel-antialiased;
  text-shadow:
    0 0 0.7px rgba(10, 10, 10, 0.42),
    0.42px 0.24px 0 rgba(10, 10, 10, 0.2),
    -0.28px -0.12px 0 rgba(10, 10, 10, 0.12);
  white-space: pre-wrap;
  word-break: keep-all;
  overflow-wrap: break-word;
}

.about-page__scroll-poem-line {
  margin: 0;
}

.about-page__scroll-poem-part--ko {
  font-family: var(--font-home-ko);
  font-weight: 100;
}

.about-page__scroll-poem-part--en {
  font-family: var(--font-home-en);
  font-weight: 100;
}

.about-page__scroll-poem-line--spacer {
  height: 1.42em;
}

.about-page__team {
  margin-top: 4rem;
  text-align: left;
}

.about-page__team-heading {
  margin: 0 0 2rem;
  font-family: var(--font-home-en);
  font-size: 0.85rem;
  font-weight: var(--font-home-en-weight);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.about-page__team-list {
  margin: 0;
  padding: 0;
}

.about-page__team-row {
  margin: 0 0 0.85rem;
}

.about-page__team-row:last-child {
  margin-bottom: 0;
}

.about-page__team-role,
.about-page__team-members {
  margin: 0;
}

.about-page__team-role {
  font-family: var(--font-home-en);
  font-size: 0.72rem;
  font-weight: var(--font-home-en-weight);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.55;
  margin-bottom: 0.1rem;
}

.about-page__team-members {
  font-size: 1rem;
  line-height: 1.42;
  letter-spacing: 0.006em;
}

.about-page__team-link {
  color: inherit;
  text-decoration: none;
}

.about-page__team-link:hover,
.about-page__team-link:focus-visible {
  outline: none;
}

.about-page__team-name,
.about-page__split {
  display: inline-block;
}

.about-page__split {
  position: relative;
  vertical-align: baseline;
}

.about-page__split::after {
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
  transition: opacity 0.35s cubic-bezier(0.45, 0, 0.2, 1);
}

.about-page__split-ghost {
  opacity: 0;
  pointer-events: none;
  user-select: none;
  transition: opacity 0.35s cubic-bezier(0.45, 0, 0.2, 1);
}

.about-page__split-half {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  user-select: none;
  transition: opacity 0.35s cubic-bezier(0.45, 0, 0.2, 1);
}

.about-page__split-half--top {
  clip-path: inset(0 0 50% 0);
  transform: translateX(var(--about-split-shift-top, -1.5px));
}

.about-page__split-half--bottom {
  clip-path: inset(50% 0 0 0);
  transform: translateX(var(--about-split-shift-bottom, 1.5px));
}

.about-page__team-link:hover .about-page__split-ghost,
.about-page__team-link:focus-visible .about-page__split-ghost,
.is-mobile-activating .about-page__split-ghost {
  opacity: 1;
}

.about-page__team-link:hover .about-page__split-half,
.about-page__team-link:focus-visible .about-page__split-half,
.is-mobile-activating .about-page__split-half {
  opacity: 0;
}

.about-page__team-link:hover .about-page__split::after,
.about-page__team-link:focus-visible .about-page__split::after,
.is-mobile-activating .about-page__split::after {
  opacity: 1;
}

@media (max-width: 768px) {
  .about-page {
    padding: 72px 20px 48px;
  }

  .about-page__scroll-poem {
    padding: 72px 20px 48px;
  }
}
</style>
