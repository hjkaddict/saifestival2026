<template>
  <main
    class="exhibition-detail app-min-vh"
    :class="locale.lang === 'kr' ? 'exhibition-detail--ko' : 'exhibition-detail--en'"
  >
    <article v-if="work" class="exhibition-detail__inner" :key="`${locale.lang}-${id}`">
      <p class="exhibition-detail__type">{{ locale.lang === 'kr' ? '전시' : 'Exhibition' }}</p>
      <h1 class="exhibition-detail__artist rich-text" v-html="localized(work.artist)"></h1>
      <p
        v-if="localized(work.title)"
        class="exhibition-detail__title rich-text"
        v-html="localized(work.title)"
      ></p>
      <section
        v-if="localized(work.description)"
        class="exhibition-detail__description rich-text"
        v-html="localized(work.description)"
      ></section>
      <router-link class="exhibition-detail__back" to="/program#exhibition">
        <span class="exhibition-detail__back-arrow" aria-hidden="true">←</span>
        <template v-for="(labelPart, labelIdx) in backLabelParts" :key="labelIdx">
          <span
            class="exhibition-detail__split"
            :class="{ 'exhibition-detail__split--spaced': labelIdx > 0 }"
            :style="backSplitStyle(labelPart)"
          >
            <span class="exhibition-detail__split-ghost">{{ labelPart }}</span>
            <span
              class="exhibition-detail__split-half exhibition-detail__split-half--top"
              aria-hidden="true"
            >
              {{ labelPart }}
            </span>
            <span
              class="exhibition-detail__split-half exhibition-detail__split-half--bottom"
              aria-hidden="true"
            >
              {{ labelPart }}
            </span>
          </span>
        </template>
      </router-link>
    </article>
    <article v-else class="exhibition-detail__inner">
      <h1 class="exhibition-detail__artist">
        {{ locale.lang === 'kr' ? '전시 작업을 찾을 수 없습니다.' : 'Exhibition work not found.' }}
      </h1>
      <router-link class="exhibition-detail__back" to="/program#exhibition">
        <span class="exhibition-detail__back-arrow" aria-hidden="true">←</span>
        <template v-for="(labelPart, labelIdx) in backLabelParts" :key="labelIdx">
          <span
            class="exhibition-detail__split"
            :class="{ 'exhibition-detail__split--spaced': labelIdx > 0 }"
            :style="backSplitStyle(labelPart)"
          >
            <span class="exhibition-detail__split-ghost">{{ labelPart }}</span>
            <span
              class="exhibition-detail__split-half exhibition-detail__split-half--top"
              aria-hidden="true"
            >
              {{ labelPart }}
            </span>
            <span
              class="exhibition-detail__split-half exhibition-detail__split-half--bottom"
              aria-hidden="true"
            >
              {{ labelPart }}
            </span>
          </span>
        </template>
      </router-link>
    </article>
  </main>
</template>

<script>
import { getExhibitionWork } from '@/assets/data/program_exhibition.js'
import { localeStore } from '@/store/locale.js'
import { splitShiftPx } from '@/utils/splitShift.js'

const EXHIBITION_SPLIT_SCALE_LATIN = 0.56

function textSeedHash(s) {
  return s.split('').reduce((a, c) => ((Math.imul(a, 31) + c.charCodeAt(0)) | 0) >>> 0, 5381) >>> 0
}

export default {
  name: 'ExhibitionDetail',
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      locale: localeStore,
    }
  },
  computed: {
    work() {
      return getExhibitionWork(this.id)
    },
    backLabel() {
      return this.locale.lang === 'kr' ? '프로그램으로 돌아가기' : 'Back to program'
    },
    backLabelParts() {
      const label = this.backLabel
      if (this.locale.lang === 'kr') return [label]
      return label.trim().split(/\s+/).filter(Boolean)
    },
  },
  methods: {
    localized(field) {
      if (!field) return ''
      const value = field[this.locale.lang] || field.en || field.kr || ''
      return typeof value === 'string' ? value.trim() : value
    },
    backSplitStyle(labelPart) {
      const scale = this.locale.lang === 'kr' ? 0.56 : EXHIBITION_SPLIT_SCALE_LATIN
      const key = textSeedHash(`${this.locale.lang}\0back\0${labelPart}`)
      const u = (n) => {
        let h = Math.imul((key + n) ^ 0x9e3779b9, 0x9e3779b9) >>> 0
        h = (h ^ (h >>> 16)) >>> 0
        h = Math.imul(h, 2246822507) >>> 0
        return h / 4294967296
      }
      const invert = u(101) >= 0.5
      const base = (0.95 + u(7) * 1.15) * scale
      return {
        '--exhibition-split-shift-top': splitShiftPx((invert ? 1 : -1) * base * (0.88 + u(13) * 0.3)),
        '--exhibition-split-shift-bottom': splitShiftPx(
          (invert ? -1 : 1) * base * (0.88 + u(29) * 0.3),
        ),
      }
    },
  },
}
</script>

<style scoped>
.exhibition-detail {
  box-sizing: border-box;
  width: 100%;
  padding: clamp(72px, 12vw, 132px) clamp(20px, 8vw, 112px);
  background: #fff;
  color: rgba(10, 10, 10, 0.82);
}

.exhibition-detail__inner {
  width: min(100%, 42rem);
  margin: 0 auto;
  filter: blur(0.22px) contrast(1.08);
  -webkit-font-smoothing: subpixel-antialiased;
  text-shadow:
    0 0 0.7px rgba(10, 10, 10, 0.42),
    0.42px 0.24px 0 rgba(10, 10, 10, 0.2),
    -0.28px -0.12px 0 rgba(10, 10, 10, 0.12);
}

.exhibition-detail--en .exhibition-detail__inner {
  font-family: var(--font-home-en);
  font-weight: 100;
}

.exhibition-detail--ko .exhibition-detail__inner {
  font-family: var(--font-home-ko);
  font-weight: 100;
}

.exhibition-detail__type,
.exhibition-detail__artist,
.exhibition-detail__title,
.exhibition-detail__description,
.exhibition-detail__back {
  font-size: 1rem;
  line-height: 1.42;
  letter-spacing: 0.006em;
}

.exhibition-detail__type,
.exhibition-detail__artist,
.exhibition-detail__title {
  margin: 0;
}

.exhibition-detail__type,
.exhibition-detail__title {
  color: rgba(10, 10, 10, 0.34);
}

.exhibition-detail__title {
  font-style: italic;
  font-weight: 500;
}

.exhibition-detail__artist {
  margin-top: 0.2rem;
  font-weight: 500;
}

.exhibition-detail__description {
  margin-top: 1.2rem;
  color: rgba(10, 10, 10, 0.62);
  font-weight: 400;
  white-space: pre-wrap;
  word-break: keep-all;
  overflow-wrap: break-word;
  text-shadow:
    0 0 0.34px rgba(10, 10, 10, 0.2),
    0.18px 0.1px 0 rgba(10, 10, 10, 0.08),
    -0.12px -0.06px 0 rgba(10, 10, 10, 0.05);
}

.exhibition-detail__description :deep(i) {
  font-style: italic;
}

.exhibition-detail__back {
  display: block;
  width: fit-content;
  margin-top: 2rem;
  margin-left: auto;
  color: inherit;
  text-align: right;
  text-decoration: none;
}

.exhibition-detail__back-arrow {
  position: relative;
  z-index: 5;
  display: inline-block;
  margin-right: 0.26em;
  color: #0a0a0a;
  font-family: var(--font-home-en);
  font-style: normal;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1;
  text-shadow: 0.025em 0 0 currentColor;
  vertical-align: -0.06em;
}

.exhibition-detail__split--spaced {
  margin-left: 0.25em;
}

.exhibition-detail__split {
  position: relative;
  display: inline-block;
  vertical-align: baseline;
}

.exhibition-detail__split::after {
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

.exhibition-detail__split-ghost {
  opacity: 0;
  pointer-events: none;
  user-select: none;
  transition: opacity 0.35s cubic-bezier(0.45, 0, 0.2, 1);
}

.exhibition-detail__split-half {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  user-select: none;
  transition: opacity 0.35s cubic-bezier(0.45, 0, 0.2, 1);
}

.exhibition-detail__split-half--top {
  clip-path: inset(0 0 50% 0);
  transform: translateX(var(--exhibition-split-shift-top, -1.5px));
}

.exhibition-detail__split-half--bottom {
  clip-path: inset(50% 0 0 0);
  transform: translateX(var(--exhibition-split-shift-bottom, 1.5px));
}

.exhibition-detail__back:hover .exhibition-detail__split-ghost,
.exhibition-detail__back:focus-visible .exhibition-detail__split-ghost,
.is-mobile-activating .exhibition-detail__split-ghost {
  opacity: 1;
}

.exhibition-detail__back:hover .exhibition-detail__split-half,
.exhibition-detail__back:focus-visible .exhibition-detail__split-half,
.is-mobile-activating .exhibition-detail__split-half {
  opacity: 0;
}

.exhibition-detail__back:hover .exhibition-detail__split::after,
.exhibition-detail__back:focus-visible .exhibition-detail__split::after,
.is-mobile-activating .exhibition-detail__split::after {
  opacity: 1;
}

.exhibition-detail__back:hover,
.exhibition-detail__back:focus-visible {
  outline: none;
}

@media (max-width: 768px) {
  .exhibition-detail {
    padding: 72px 20px 48px;
  }
}
</style>
