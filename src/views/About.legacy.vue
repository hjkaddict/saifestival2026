<template>
  <div class="about-container">
    <article class="about-text-wrapper" :key="locale.lang">
      <div class="description-text" v-html="aboutContent"></div>

      <section class="festival-team" aria-labelledby="festival-team-heading">
        <h2 id="festival-team-heading" class="festival-team__heading">{{ teamHeading }}</h2>
        <dl class="festival-team__list">
          <div v-for="(section, idx) in teamSections" :key="idx" class="festival-team__row">
            <dt class="festival-team__role">{{ section.role }}</dt>
            <dd class="festival-team__members">
              <template v-for="(member, mi) in section.members" :key="mi">
                <span v-if="mi > 0" class="festival-team__sep">, </span>
                <a
                  v-if="member.url"
                  class="festival-team__link"
                  :href="member.url"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ member.name }}
                </a>
                <span v-else class="festival-team__name">{{ member.name }}</span>
              </template>
            </dd>
          </div>
        </dl>
      </section>
    </article>
  </div>
</template>

<script>
import { localeStore } from '@/store/locale.js'
import { aboutData } from '@/assets/data/about.js'
import { festivalTeamHeading, getFestivalTeam } from '@/assets/data/festivalTeam.js'

export default {
  name: 'AboutView',
  data() {
    return {
      locale: localeStore,
      _scrollRafId: null,
    }
  },
  computed: {
    aboutContent() {
      return aboutData[this.locale.lang]
    },
    teamHeading() {
      return festivalTeamHeading[this.locale.lang] || festivalTeamHeading.en
    },
    teamSections() {
      return getFestivalTeam(this.locale.lang)
    },
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    this.handleScroll()
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
    if (this._scrollRafId != null) {
      cancelAnimationFrame(this._scrollRafId)
      this._scrollRafId = null
    }
    window.aboutScrollProgress = 0
    window.dispatchEvent(new Event('scroll-canvas'))
  },
  methods: {
    handleScroll() {
      if (this._scrollRafId != null) return
      this._scrollRafId = requestAnimationFrame(() => {
        this._scrollRafId = null
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const progress = docHeight > 0 ? scrollTop / docHeight : 0
        window.aboutScrollProgress = progress
        window.dispatchEvent(new Event('scroll-canvas'))
      })
    },
  },
}
</script>

<style scoped>
.about-container {
  width: 100%;
  min-height: calc(var(--app-vh, 1vh) * 100);
  padding: 20vh 10vw;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 10;
  background-color: #fff;
}

.about-text-wrapper {
  width: 100%;
  max-width: 42rem;
  margin: 0 auto;
}

.description-text {
  font-size: 1rem;
  line-height: 1.5;
  color: #000;
  white-space: pre-wrap;
  word-break: keep-all;
  font-weight: 400;
  text-align: center;
}

.festival-team {
  margin-top: 4rem;
  padding-top: 0;
  text-align: left;
}

.festival-team__heading {
  margin: 0 0 2rem;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.festival-team__list {
  margin: 0;
  padding: 0;
}

.festival-team__row {
  margin: 0 0 0.85rem;
}

.festival-team__row:last-child {
  margin-bottom: 0;
}

.festival-team__role,
.festival-team__members {
  margin: 0;
}

.festival-team__role {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.55;
  margin-bottom: 0.1rem;
}

.festival-team__members {
  font-size: 1rem;
  line-height: 1.45;
  font-weight: 450;
}

.festival-team__link {
  color: inherit;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.15em;
  transition: opacity 0.15s ease;
}

.festival-team__link:hover {
  opacity: 0.55;
}

.festival-team__name {
  color: inherit;
}
</style>
