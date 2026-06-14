<template>
  <main
    class="exhibition-detail app-min-vh"
    :class="locale.lang === 'kr' ? 'exhibition-detail--ko' : 'exhibition-detail--en'"
  >
    <article v-if="work" class="exhibition-detail__inner" :key="`${locale.lang}-${id}`">
      <p class="exhibition-detail__type">{{ locale.lang === 'kr' ? '전시' : 'Exhibition' }}</p>
      <h1 class="exhibition-detail__artist rich-text" v-html="localized(work.artist)"></h1>
      <template v-if="workPieces.length">
        <section
          v-for="(piece, pieceIdx) in workPieces"
          :key="piece.id"
          class="exhibition-detail__piece"
          :class="{ 'exhibition-detail__piece--spaced': pieceIdx > 0 }"
        >
          <p
            v-if="localized(piece.title)"
            class="exhibition-detail__piece-title rich-text"
            v-html="localized(piece.title)"
          ></p>
          <div v-if="contentBlocks(piece).length" class="exhibition-detail__content">
            <template v-for="(block, blockIdx) in contentBlocks(piece)" :key="`${piece.id}-block-${blockIdx}`">
              <section
                v-if="block.type === 'html' && localized(block.content)"
                class="exhibition-detail__description rich-text"
                v-html="expandedHtml(block.content, piece)"
              ></section>
              <figure v-else-if="block.type === 'image' && block.src" class="exhibition-detail__figure">
                <img
                  class="exhibition-detail__image"
                  :src="block.src"
                  :alt="localized(block.alt)"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <pre
                v-else-if="block.type === 'code' && localized(block.content)"
                class="exhibition-detail__code"
              ><code>{{ localized(block.content) }}</code></pre>
            </template>
          </div>
          <section
            v-else-if="localized(piece.description)"
            class="exhibition-detail__description rich-text"
            v-html="expandedHtml(piece.description, piece)"
          ></section>
        </section>
      </template>
      <template v-else>
        <p
          v-if="localized(work.title)"
          class="exhibition-detail__title rich-text"
          v-html="localized(work.title)"
        ></p>
        <div v-if="contentBlocks(work).length" class="exhibition-detail__content">
          <template v-for="(block, blockIdx) in contentBlocks(work)" :key="`work-block-${blockIdx}`">
            <section
              v-if="block.type === 'html' && localized(block.content)"
              class="exhibition-detail__description rich-text"
              v-html="expandedHtml(block.content, work)"
            ></section>
            <figure v-else-if="block.type === 'image' && block.src" class="exhibition-detail__figure">
              <img
                class="exhibition-detail__image"
                :src="block.src"
                :alt="localized(block.alt)"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <pre
              v-else-if="block.type === 'code' && localized(block.content)"
              class="exhibition-detail__code"
            ><code>{{ localized(block.content) }}</code></pre>
          </template>
        </div>
        <template v-else>
          <section
            v-if="localized(work.description)"
            class="exhibition-detail__description rich-text"
            v-html="expandedHtml(work.description, work)"
          ></section>
          <div v-if="detailImages.length" class="exhibition-detail__images">
            <figure
              v-for="image in detailImages"
              :key="image.src"
              class="exhibition-detail__figure"
            >
              <img
                class="exhibition-detail__image"
                :src="image.src"
                :alt="localized(image.alt)"
                loading="lazy"
                decoding="async"
              />
            </figure>
          </div>
        </template>
      </template>
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
import { splitScaleForText, splitShiftPx } from '@/utils/splitShift.js'

function textSeedHash(s) {
  return s.split('').reduce((a, c) => ((Math.imul(a, 31) + c.charCodeAt(0)) | 0) >>> 0, 5381) >>> 0
}

function escapeHtmlAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

const exhibitionImgPlaceholder = /\[\[img:([\w-]+)\]\]/g

function wrapExhibitionTextSegment(text) {
  const trimmed = text.trim()
  if (!trimmed) return ''
  return trimmed
}

function exhibitionMediaFigure(mediaItem, altText) {
  if (!mediaItem?.src) return ''
  const alt = escapeHtmlAttr(altText)
  const isFull = mediaItem.layout === 'full'
  const isWideSpacing = mediaItem.spacing === 'wide'
  const isMediumSpacing = mediaItem.spacing === 'medium'
  const figureClass = [
    'exhibition-detail__figure',
    isFull && 'exhibition-detail__figure--full',
    isWideSpacing && 'exhibition-detail__figure--wide-spacing',
    isMediumSpacing && 'exhibition-detail__figure--medium-spacing',
  ]
    .filter(Boolean)
    .join(' ')
  const imageClass = isFull
    ? 'exhibition-detail__image exhibition-detail__image--full'
    : 'exhibition-detail__image'
  return `<figure class="${figureClass}"><img class="${imageClass}" src="${mediaItem.src}" alt="${alt}" loading="lazy" decoding="async" /></figure>`
}

function expandExhibitionHtml(raw, media = {}, localizedAlt) {
  if (!raw) return ''
  exhibitionImgPlaceholder.lastIndex = 0
  if (!exhibitionImgPlaceholder.test(raw)) {
    return wrapExhibitionTextSegment(raw)
  }

  exhibitionImgPlaceholder.lastIndex = 0
  const parts = raw.split(exhibitionImgPlaceholder)
  let html = ''

  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 1) {
      const mediaItem = media[parts[i]]
      html += exhibitionMediaFigure(mediaItem, localizedAlt(mediaItem?.alt))
      continue
    }
    html += wrapExhibitionTextSegment(parts[i])
  }

  return html
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
    workPieces() {
      return Array.isArray(this.work?.pieces) ? this.work.pieces : []
    },
    detailImages() {
      return Array.isArray(this.work?.images) ? this.work.images : []
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
    contentBlocks(item) {
      return Array.isArray(item?.blocks) ? item.blocks : []
    },
    itemMedia(item) {
      if (item?.media && typeof item.media === 'object') return item.media
      return this.work?.media || {}
    },
    expandedHtml(field, item) {
      return expandExhibitionHtml(this.localized(field), this.itemMedia(item), (altField) =>
        this.localized(altField),
      )
    },
    backSplitStyle(labelPart) {
      const scale = splitScaleForText(labelPart)
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
  letter-spacing: normal;
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

.exhibition-detail__piece-title {
  margin: 0;
  color: rgba(10, 10, 10, 0.34);
  font-style: italic;
  font-weight: 500;
}

.exhibition-detail__piece:first-child .exhibition-detail__piece-title {
  margin-top: 0.35rem;
}

.exhibition-detail__piece--spaced .exhibition-detail__piece-title {
  margin-top: 1.4rem;
}

.exhibition-detail__piece .exhibition-detail__content,
.exhibition-detail__piece .exhibition-detail__description {
  margin-top: 0.55rem;
}

.exhibition-detail__content {
  display: grid;
  gap: 1rem;
  margin-top: 1.2rem;
}

.exhibition-detail__content .exhibition-detail__description {
  margin-top: 0;
}

.exhibition-detail__code {
  margin: 0;
  padding: 0.85rem 1rem;
  overflow-x: auto;
  border: 1px solid rgba(10, 10, 10, 0.1);
  background: rgba(10, 10, 10, 0.03);
  color: rgba(10, 10, 10, 0.72);
  font-family: var(--font-mono);
  font-size: 0.88rem;
  line-height: 1.5;
  white-space: pre;
  word-break: normal;
  overflow-wrap: normal;
}

.exhibition-detail__code code {
  font-family: inherit;
  font-size: inherit;
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
  text-shadow: none;
}

.exhibition-detail__description :deep(p) {
  margin: 0 0 0.85rem;
  font-weight: 400;
}

.exhibition-detail__description :deep(b),
.exhibition-detail__description :deep(strong) {
  font-weight: 500;
}

.exhibition-detail--ko .exhibition-detail__description :deep(b),
.exhibition-detail--ko .exhibition-detail__description :deep(strong) {
  font-weight: 700;
  -webkit-font-smoothing: auto;
}

.exhibition-detail__description :deep(a) {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 0.12em;
}

.exhibition-detail__description :deep(.exhibition-detail__edition-link) {
  font-weight: 500;
  text-shadow: none;
}

.exhibition-detail--ko .exhibition-detail__description :deep(.exhibition-detail__edition-link) {
  font-weight: 600;
  -webkit-font-smoothing: antialiased;
}

.exhibition-detail__description :deep(.mp-timetable) {
  width: 90%;
  margin: 0 auto 0.35rem;
  color: #0000ff;
  font-family: 'Times New Roman', Times, Batang, 'Nanum Myeongjo', serif;
  font-size: 0.94rem;
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: normal;
  text-shadow: none;
  white-space: normal;
  word-break: normal;
  overflow-wrap: normal;
  -webkit-font-smoothing: antialiased;
}

.exhibition-detail__description :deep(.mp-timetable + br) {
  display: none;
}

.exhibition-detail__description :deep(.mp-timetable__dates) {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  gap: 0.35rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
  font-size: 0.94rem;
  letter-spacing: normal;
}

.exhibition-detail__description :deep(.mp-timetable__dates-left),
.exhibition-detail__description :deep(.mp-timetable__dates-right) {
  flex: 0 0 auto;
  text-align: center;
}

.exhibition-detail__description :deep(.mp-timetable__table) {
  width: 100%;
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 2px;
  border-top: 0.5px solid #000;
  border-left: 0.5px solid #000;
  border-right: 1px solid #000;
  border-bottom: 1px solid #000;
  background: #fff;
}

.exhibition-detail__description :deep(.mp-timetable__col-index) {
  width: 5.5%;
}

.exhibition-detail__description :deep(.mp-timetable__col-gap) {
  width: 4.5%;
}

.exhibition-detail__description :deep(.mp-timetable__col-data) {
  width: 22.5%;
}

.exhibition-detail__description :deep(.mp-timetable__cell) {
  box-sizing: border-box;
  padding: 0.28rem 0.12rem;
  border-top: 1px solid #000;
  border-left: 1px solid #000;
  border-right: 0.5px solid #000;
  border-bottom: 0.5px solid #000;
  text-align: center;
  vertical-align: middle;
  color: #0000ff;
  font-weight: 700;
}

.exhibition-detail__description :deep(.mp-timetable__cell--grey) {
  background-color: #d8d8d8;
}

.exhibition-detail__description :deep(.mp-timetable__cell--yellow) {
  background-color: #ffff80;
}

.exhibition-detail__description :deep(.mp-timetable__cell--gap) {
  background-color: #fff;
  padding: 0;
}

.exhibition-detail__description :deep(.mp-timetable__dates-left),
.exhibition-detail__description :deep(.mp-timetable__dates-right) {
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  white-space: nowrap;
  word-break: normal;
  overflow-wrap: normal;
}

.exhibition-detail__description :deep(.mp-timetable__cell--kr) {
  font-weight: 900;
  -webkit-font-smoothing: auto;
  -webkit-text-stroke: 0.35px currentColor;
  paint-order: stroke fill;
}

.exhibition-detail__description :deep(.mp-timetable__cell--en b) {
  font-weight: 700;
}

.exhibition-detail__description :deep(.mp-timetable__cell--time) {
  letter-spacing: normal;
}

.exhibition-detail__description :deep(p:last-child) {
  margin-bottom: 0;
}

.exhibition-detail__description :deep(pre) {
  margin: 1rem 0;
  padding: 0.85rem 1rem;
  overflow-x: auto;
  border: 1px solid rgba(10, 10, 10, 0.1);
  background: rgba(10, 10, 10, 0.03);
  color: rgba(10, 10, 10, 0.72);
  font-family: var(--font-mono);
  font-size: 0.88rem;
  line-height: 1.5;
  white-space: pre;
  word-break: normal;
  overflow-wrap: normal;
}

.exhibition-detail__description :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.92em;
}

.exhibition-detail__description :deep(pre code) {
  font-size: inherit;
}

.exhibition-detail__description :deep(img) {
  display: block;
  width: 200px;
  max-width: 100%;
  height: auto;
  margin: 1rem auto;
  filter: contrast(1.04) saturate(0.92) blur(0.08px);
}

.exhibition-detail__description :deep(.exhibition-detail__figure) {
  margin: 0;
}

.exhibition-detail__description :deep(.exhibition-detail__figure--wide-spacing img) {
  margin: 4rem auto;
}

.exhibition-detail__description :deep(.exhibition-detail__figure--medium-spacing img) {
  margin: 2.5rem 0;
}

.exhibition-detail__images {
  display: grid;
  gap: 1rem;
  margin-top: 1.6rem;
}

.exhibition-detail__figure {
  margin: 0;
  display: flex;
  justify-content: center;
}

.exhibition-detail__image {
  display: block;
  width: 200px;
  max-width: 100%;
  height: auto;
  filter: contrast(1.04) saturate(0.92) blur(0.08px);
}

.exhibition-detail__figure--full {
  width: 100%;
}

.exhibition-detail__image--full,
.exhibition-detail__description :deep(.exhibition-detail__image--full) {
  width: 100%;
  max-width: 100%;
  margin: 1rem 0;
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
  letter-spacing: normal;
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

  .exhibition-detail__description :deep(.mp-timetable) {
    width: 100%;
    font-size: clamp(0.62rem, 2.65vw, 0.78rem);
  }

  .exhibition-detail__description :deep(.mp-timetable__table-wrap) {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .exhibition-detail__description :deep(.mp-timetable__dates) {
    flex-direction: column;
    gap: 0.15rem;
    margin-top: 1.25rem;
    margin-bottom: 1.25rem;
    letter-spacing: normal;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    white-space: nowrap;
    word-break: normal;
    overflow-wrap: normal;
  }

  .exhibition-detail__description :deep(.mp-timetable__dates-left),
  .exhibition-detail__description :deep(.mp-timetable__dates-right) {
    display: block;
    width: max-content;
    max-width: none;
    letter-spacing: normal;
    line-height: 1.35;
  }

  .exhibition-detail__description :deep(.mp-timetable__table) {
    min-width: 19.5rem;
    border-spacing: 1px;
  }

  .exhibition-detail__description :deep(.mp-timetable__col-index) {
    width: 6%;
  }

  .exhibition-detail__description :deep(.mp-timetable__col-gap) {
    width: 3%;
  }

  .exhibition-detail__description :deep(.mp-timetable__col-data) {
    width: 23.25%;
  }

  .exhibition-detail__description :deep(.mp-timetable__cell) {
    padding: 0.2rem 0.05rem;
    line-height: 1.15;
  }

  .exhibition-detail__description :deep(.mp-timetable__cell--en b) {
    display: inline-block;
    font-size: 0.92em;
    line-height: 1.12;
    word-break: break-word;
  }

  .exhibition-detail__description :deep(.mp-timetable__cell--kr) {
    font-size: 0.94em;
    line-height: 1.12;
    -webkit-text-stroke: 0.25px currentColor;
  }

  .exhibition-detail__description :deep(.mp-timetable__cell--time) {
    letter-spacing: normal;
    font-size: 0.92em;
  }
}
</style>
