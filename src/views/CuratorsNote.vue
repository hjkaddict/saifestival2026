<template>
  <main
    class="curators-note-page app-min-vh"
    :class="locale.lang === 'kr' ? 'curators-note-page--ko' : 'curators-note-page--en'"
  >
    <article class="curators-note-page__inner" :key="locale.lang">
      <section class="curators-note-page__body rich-text" v-html="noteContent"></section>
      <p class="curators-note-page__byline">
        <span class="curators-note-page__byline-role" v-html="byline.role"></span><br />
        {{ byline.name }}
      </p>
    </article>
  </main>
</template>

<script>
import { localeStore } from '@/store/locale.js'
import { curatorsNoteData, curatorsNoteByline } from '@/assets/data/curatorsNote.js'

export default {
  name: 'CuratorsNote',
  data() {
    return {
      locale: localeStore,
    }
  },
  computed: {
    noteContent() {
      return curatorsNoteData[this.locale.lang] || curatorsNoteData.en
    },
    byline() {
      return curatorsNoteByline[this.locale.lang] || curatorsNoteByline.en
    },
  },
}
</script>

<style scoped>
.curators-note-page {
  box-sizing: border-box;
  width: 100%;
  padding: clamp(72px, 12vw, 132px) clamp(20px, 8vw, 112px);
  background: rgba(255, 255, 255, 0.86);
  color: rgba(10, 10, 10, 0.82);
}

.curators-note-page__inner {
  width: min(100%, 42rem);
  margin: 0 auto;
  filter: blur(0.22px) contrast(1.08);
  -webkit-font-smoothing: subpixel-antialiased;
  text-shadow:
    0 0 0.7px rgba(10, 10, 10, 0.42),
    0.42px 0.24px 0 rgba(10, 10, 10, 0.2),
    -0.28px -0.12px 0 rgba(10, 10, 10, 0.12);
}

.curators-note-page--en .curators-note-page__inner {
  font-family: var(--font-home-en);
  font-weight: 400;
}

.curators-note-page--ko .curators-note-page__inner {
  font-family: var(--font-home-ko);
  font-weight: 100;
}

.curators-note-page__body {
  font-size: 1rem;
  line-height: 1.42;
  letter-spacing: normal;
  white-space: pre-wrap;
  word-break: keep-all;
  overflow-wrap: break-word;
  text-align: left;
}

.curators-note-page__body :deep(i) {
  font-style: italic;
}

.curators-note-page__byline {
  margin: 2.85rem 0 0;
  font-size: 1rem;
  line-height: 1.42;
  letter-spacing: normal;
  text-align: right;
  white-space: pre-wrap;
}

.curators-note-page__byline :deep(i) {
  font-style: italic;
}
</style>
