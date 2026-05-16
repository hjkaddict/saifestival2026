<template>
  <main class="program-page app-min-vh" :class="locale.lang === 'kr' ? 'program-page--ko' : 'program-page--en'">
    <article class="program-page__inner" :key="locale.lang">
      <section
        v-for="program in programs"
        :id="program.id"
        :key="program.id"
        class="program-section"
      >
        <header class="program-section__header">
          <h1 class="program-section__title" v-html="localized(program.data.title)"></h1>
          <p
            v-if="localized(program.data.period || program.data.date)"
            class="program-section__date"
            v-html="localized(program.data.period || program.data.date)"
          ></p>
          <div v-if="localized(program.data.openingHours)" class="program-section__hours">
            <p
              v-for="(time, idx) in localized(program.data.openingHours).split('/')"
              :key="idx"
              class="program-section__hour"
              v-html="time.trim()"
            ></p>
          </div>
        </header>

        <div
          class="program-section__description"
          v-html="localized(program.data.description)"
        ></div>

        <div v-if="program.id === 'performance'" class="program-section__schedule">
          <section
            v-for="show in performanceDays"
            :id="show.id"
            :key="show.id"
            class="program-day"
          >
            <h2 class="program-day__date">{{ show.dateLabel[locale.lang] || show.dateLabel.en }}</h2>
            <p class="program-day__lineup">
              <template v-for="(act, idx) in show.acts" :key="`${show.id}-${idx}`">
                <span v-if="idx > 0" class="program-day__sep"> · </span>
                <template v-if="act.parts">
                  <template
                    v-for="(part, partIdx) in act.parts"
                    :key="`${show.id}-${idx}-${part.path}`"
                  >
                    <span v-if="partIdx > 0" class="program-day__join"> + </span>
                    <router-link :to="part.path" class="program-day__artist">
                      <span class="program-day__split" :style="splitStyleForLabel(part.label)">
                        <span class="program-day__split-ghost">{{ part.label }}</span>
                        <span
                          class="program-day__split-half program-day__split-half--top"
                          aria-hidden="true"
                        >
                          {{ part.label }}
                        </span>
                        <span
                          class="program-day__split-half program-day__split-half--bottom"
                          aria-hidden="true"
                        >
                          {{ part.label }}
                        </span>
                      </span>
                    </router-link>
                  </template>
                </template>
                <router-link
                  v-else-if="act.path"
                  :to="act.path"
                  class="program-day__artist"
                >
                  <span class="program-day__split" :style="splitStyleForLabel(act.label)">
                    <span class="program-day__split-ghost">{{ act.label }}</span>
                    <span
                      class="program-day__split-half program-day__split-half--top"
                      aria-hidden="true"
                    >
                      {{ act.label }}
                    </span>
                    <span
                      class="program-day__split-half program-day__split-half--bottom"
                      aria-hidden="true"
                    >
                      {{ act.label }}
                    </span>
                  </span>
                </router-link>
                <span v-else class="program-day__artist">{{ act.label }}</span>
              </template>
            </p>
          </section>
        </div>
      </section>
    </article>
  </main>
</template>

<script>
import { localeStore } from '@/store/locale.js'
import { programExhibition } from '@/assets/data/program_exhibition.js'
import { programPerformance } from '@/assets/data/program_performance.js'
import { programWorkshop } from '@/assets/data/program_workshop.js'
import { performanceSchedule, resolvePerformanceActs } from '@/assets/data/program_performance_schedule.js'

function textSeedHash(s) {
  return s.split('').reduce((a, c) => ((Math.imul(a, 31) + c.charCodeAt(0)) | 0) >>> 0, 5381) >>> 0
}

function artistSlug(artistOrName) {
  if (artistOrName && typeof artistOrName === 'object' && artistOrName.slug) {
    return artistOrName.slug
  }
  const nameEn = typeof artistOrName === 'string' ? artistOrName : artistOrName?.name_en || ''
  return nameEn.toLowerCase().trim().replace(/\s+/g, '-')
}

export default {
  name: 'Program',
  data() {
    return {
      locale: localeStore,
      programs: [
        { id: 'exhibition', data: programExhibition },
        { id: 'performance', data: programPerformance },
        { id: 'workshop', data: programWorkshop },
      ],
    }
  },
  computed: {
    performanceDays() {
      return performanceSchedule.map((show) => ({
        ...show,
        acts: resolvePerformanceActs(show.acts).map((act) => {
          if (act.kind === 'solo') {
            return {
              label: this.locale.lang === 'kr' ? act.artist.name_kr : act.artist.name_en,
              path: `/artists/${artistSlug(act.artist)}`,
            }
          }
          return {
            label: act.label[this.locale.lang] || act.label.en,
            path: null,
            parts: act.artists.map((artist) => ({
              label: this.locale.lang === 'kr' ? artist.name_kr : artist.name_en,
              path: `/artists/${artistSlug(artist)}`,
            })),
          }
        }),
      }))
    },
  },
  methods: {
    localized(field) {
      if (!field) return ''
      const value = field[this.locale.lang] || field.en || field.kr || ''
      return typeof value === 'string' ? value.trim() : value
    },
    splitStyleForLabel(label) {
      const key = textSeedHash(`${label}\0program-link`)
      const u = (n) => {
        let h = Math.imul((key + n) ^ 0x9e3779b9, 0x9e3779b9) >>> 0
        h = (h ^ (h >>> 16)) >>> 0
        h = Math.imul(h, 2246822507) >>> 0
        return h / 4294967296
      }
      const invert = u(101) >= 0.5
      const scale = this.locale.lang === 'kr' ? 1 : 0.56
      const base = (0.8 + u(7) * 1.1) * scale
      return {
        '--program-split-shift-top': `${((invert ? 1 : -1) * base).toFixed(2)}px`,
        '--program-split-shift-bottom': `${((invert ? -1 : 1) * base * (0.85 + u(13) * 0.3)).toFixed(2)}px`,
      }
    },
  },
}
</script>

<style scoped>
.program-page {
  box-sizing: border-box;
  width: 100%;
  padding: clamp(72px, 12vw, 132px) clamp(20px, 8vw, 112px);
  background: #fff;
  color: rgba(10, 10, 10, 0.82);
}

.program-page__inner {
  width: min(100%, 42rem);
  margin: 0 auto;
  filter: blur(0.22px) contrast(1.08);
  -webkit-font-smoothing: subpixel-antialiased;
  text-shadow:
    0 0 0.7px rgba(10, 10, 10, 0.42),
    0.42px 0.24px 0 rgba(10, 10, 10, 0.2),
    -0.28px -0.12px 0 rgba(10, 10, 10, 0.12);
}

.program-page--en .program-page__inner {
  font-family: var(--font-home-en);
  font-weight: 100;
}

.program-page--ko .program-page__inner {
  font-family: var(--font-home-ko);
  font-weight: 100;
}

.program-section {
  margin: 0 0 clamp(4rem, 10vw, 7rem);
}

.program-section:last-child {
  margin-bottom: 0;
}

.program-section__header {
  margin-bottom: 1.4rem;
}

.program-section__title {
  margin: 0 0 0.35rem;
  font-size: 1rem;
  line-height: 1.42;
  font-weight: inherit;
}

.program-section__date,
.program-section__hour,
.program-section__description,
.program-day__date,
.program-day__lineup {
  font-size: 1rem;
  line-height: 1.42;
  letter-spacing: 0.006em;
}

.program-section__date,
.program-section__hours {
  margin: 0.35rem 0 0;
}

.program-section__hour {
  margin: 0;
}

.program-section__description {
  color: rgba(10, 10, 10, 0.52);
  font-weight: 20;
  text-shadow:
    0 0 0.34px rgba(10, 10, 10, 0.2),
    0.18px 0.1px 0 rgba(10, 10, 10, 0.08),
    -0.12px -0.06px 0 rgba(10, 10, 10, 0.05);
  white-space: pre-wrap;
  word-break: keep-all;
  overflow-wrap: break-word;
}

.program-section__description :deep(i) {
  font-style: italic;
}

.program-section__schedule {
  margin-top: 2.2rem;
}

.program-day {
  margin: 0 0 1.15rem;
}

.program-day:last-child {
  margin-bottom: 0;
}

.program-day__date {
  margin: 0 0 0.15rem;
  font-family: var(--font-home-en);
  font-weight: var(--font-home-en-weight);
  letter-spacing: 0.055em;
}

.program-day__lineup {
  margin: 0;
}

.program-day__artist {
  color: inherit;
  text-decoration: none;
}

.program-day__artist:hover,
.program-day__artist:focus-visible {
  outline: none;
}

.program-day__split {
  position: relative;
  display: inline-block;
  vertical-align: baseline;
}

.program-day__split::after {
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

.program-day__split-ghost {
  opacity: 0;
  pointer-events: none;
  user-select: none;
  transition: opacity 0.35s cubic-bezier(0.45, 0, 0.2, 1);
}

.program-day__split-half {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  user-select: none;
  transition: opacity 0.35s cubic-bezier(0.45, 0, 0.2, 1);
}

.program-day__split-half--top {
  clip-path: inset(0 0 50% 0);
  transform: translateX(var(--program-split-shift-top, -1.2px));
}

.program-day__split-half--bottom {
  clip-path: inset(50% 0 0 0);
  transform: translateX(var(--program-split-shift-bottom, 1.2px));
}

.program-day__artist:hover .program-day__split-ghost,
.program-day__artist:focus-visible .program-day__split-ghost {
  opacity: 1;
}

.program-day__artist:hover .program-day__split-half,
.program-day__artist:focus-visible .program-day__split-half {
  opacity: 0;
}

.program-day__artist:hover .program-day__split::after,
.program-day__artist:focus-visible .program-day__split::after {
  opacity: 1;
}

.program-day__sep {
  user-select: none;
  font-size: 1.14em;
  vertical-align: 0.02em;
}

.program-day__join {
  user-select: none;
}

@media (prefers-reduced-motion: reduce) {
  .program-day__split-ghost,
  .program-day__split-half {
    transition: none;
  }

  .program-day__split-ghost {
    opacity: 1;
  }

  .program-day__split-half {
    display: none;
  }
}

@media (max-width: 768px) {
  .program-page {
    padding: 72px 20px 48px;
  }
}
</style>
