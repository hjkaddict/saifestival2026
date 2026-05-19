<template>
  <main
    class="workshop-detail app-min-vh"
    :class="locale.lang === 'kr' ? 'workshop-detail--ko' : 'workshop-detail--en'"
  >
    <article v-if="detail" class="workshop-detail__inner" :key="`${locale.lang}-${id}`">
      <p class="workshop-detail__type rich-text" v-html="localized(detail.type)"></p>
      <h1 class="workshop-detail__title rich-text" v-html="localized(detail.title)"></h1>
      <p
        v-if="localized(detail.artist)"
        class="workshop-detail__artist rich-text"
        v-html="localized(detail.artist)"
      ></p>
      <div v-if="scheduleLines.length" class="workshop-detail__schedule">
        <p
          v-for="line in scheduleLines"
          :key="line"
          class="workshop-detail__schedule-line rich-text"
          v-html="line"
        ></p>
      </div>
      <section
        class="workshop-detail__description rich-text"
        v-html="localized(detail.description)"
      ></section>
      <div v-if="detailImages.length" class="workshop-detail__images">
        <figure
          v-for="image in detailImages"
          :key="image.src"
          class="workshop-detail__figure"
        >
          <img
            class="workshop-detail__image"
            :src="image.src"
            :alt="localized(image.alt)"
            loading="lazy"
            decoding="async"
          />
        </figure>
      </div>
      <router-link class="workshop-detail__back" to="/program#workshop">
        {{ locale.lang === 'kr' ? '프로그램으로 돌아가기' : 'Back to program' }}
      </router-link>
    </article>
    <article v-else class="workshop-detail__inner">
      <h1 class="workshop-detail__title">
        {{ locale.lang === 'kr' ? '프로그램을 찾을 수 없습니다.' : 'Program not found.' }}
      </h1>
      <router-link class="workshop-detail__back" to="/program#workshop">
        {{ locale.lang === 'kr' ? '프로그램으로 돌아가기' : 'Back to program' }}
      </router-link>
    </article>
  </main>
</template>

<script>
import { getWorkshopDetail, workshopSchedule } from '@/assets/data/program_workshop_schedule.js'
import { localeStore } from '@/store/locale.js'

export default {
  name: 'WorkshopDetail',
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
    detail() {
      return getWorkshopDetail(this.id)
    },
    scheduleLines() {
      if (!this.detail) return []
      return workshopSchedule.flatMap((day) =>
        day.entries
          .filter((entry) => entry.detailId === this.detail.id)
          .map((entry) => [this.localized(day.dateLabel), this.localized(entry.time)].filter(Boolean).join(' · ')),
      )
    },
    detailImages() {
      return Array.isArray(this.detail?.images) ? this.detail.images : []
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
.workshop-detail {
  box-sizing: border-box;
  width: 100%;
  padding: clamp(72px, 12vw, 132px) clamp(20px, 8vw, 112px);
  background: #fff;
  color: rgba(10, 10, 10, 0.82);
}

.workshop-detail__inner {
  width: min(100%, 42rem);
  margin: 0 auto;
  filter: blur(0.22px) contrast(1.08);
  -webkit-font-smoothing: subpixel-antialiased;
  text-shadow:
    0 0 0.7px rgba(10, 10, 10, 0.42),
    0.42px 0.24px 0 rgba(10, 10, 10, 0.2),
    -0.28px -0.12px 0 rgba(10, 10, 10, 0.12);
}

.workshop-detail--en .workshop-detail__inner {
  font-family: var(--font-home-en);
  font-weight: 100;
}

.workshop-detail--ko .workshop-detail__inner {
  font-family: var(--font-home-ko);
  font-weight: 100;
}

.workshop-detail__type,
.workshop-detail__title,
.workshop-detail__artist,
.workshop-detail__schedule,
.workshop-detail__description,
.workshop-detail__back {
  font-size: 1rem;
  line-height: 1.42;
  letter-spacing: 0.006em;
}

.workshop-detail__type,
.workshop-detail__title,
.workshop-detail__artist,
.workshop-detail__schedule-line {
  margin: 0;
}

.workshop-detail__type,
.workshop-detail__artist,
.workshop-detail__schedule {
  color: rgba(10, 10, 10, 0.52);
}

.workshop-detail__title {
  margin-top: 0.2rem;
  font-weight: inherit;
}

.workshop-detail__schedule {
  margin-top: 0.35rem;
}

.workshop-detail__description {
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

.workshop-detail__images {
  display: grid;
  gap: 1rem;
  margin-top: 1.6rem;
}

.workshop-detail__figure {
  margin: 0;
}

.workshop-detail__image {
  display: block;
  width: 100%;
  height: auto;
  filter: contrast(1.04) saturate(0.92) blur(0.08px);
}

.workshop-detail__back {
  display: block;
  width: fit-content;
  margin-top: 2rem;
  margin-left: auto;
  color: inherit;
  text-align: right;
  text-decoration: none;
}

.workshop-detail__back::before {
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

.workshop-detail__back:hover,
.workshop-detail__back:focus-visible {
  opacity: 0.55;
  outline: none;
}

@media (max-width: 768px) {
  .workshop-detail {
    padding: 72px 20px 48px;
  }
}
</style>
