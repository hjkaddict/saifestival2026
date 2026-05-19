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
        {{ locale.lang === 'kr' ? '프로그램으로 돌아가기' : 'Back to program' }}
      </router-link>
    </article>
    <article v-else class="exhibition-detail__inner">
      <h1 class="exhibition-detail__artist">
        {{ locale.lang === 'kr' ? '전시 작업을 찾을 수 없습니다.' : 'Exhibition work not found.' }}
      </h1>
      <router-link class="exhibition-detail__back" to="/program#exhibition">
        {{ locale.lang === 'kr' ? '프로그램으로 돌아가기' : 'Back to program' }}
      </router-link>
    </article>
  </main>
</template>

<script>
import { getExhibitionWork } from '@/assets/data/program_exhibition.js'
import { localeStore } from '@/store/locale.js'

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
  },
  methods: {
    localized(field) {
      if (!field) return ''
      const value = field[this.locale.lang] || field.en || field.kr || ''
      return typeof value === 'string' ? value.trim() : value
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
}

.exhibition-detail__artist {
  margin-top: 0.2rem;
  font-weight: inherit;
}

.exhibition-detail__description {
  margin-top: 1.2rem;
  color: rgba(10, 10, 10, 0.62);
  font-weight: 20;
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

.exhibition-detail__back::before {
  content: '←';
  position: relative;
  z-index: 5;
  display: inline-block;
  margin-right: 0.26em;
  color: #0a0a0a;
  font-family: Arial, Helvetica, sans-serif;
  font-style: normal;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1;
  opacity: 1;
  text-shadow: 0.025em 0 0 currentColor;
  vertical-align: -0.06em;
}

.exhibition-detail__back:hover,
.exhibition-detail__back:focus-visible {
  opacity: 0.55;
  outline: none;
}

@media (max-width: 768px) {
  .exhibition-detail {
    padding: 72px 20px 48px;
  }
}
</style>
