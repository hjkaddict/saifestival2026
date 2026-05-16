<template>
  <main class="about-page app-min-vh" :class="locale.lang === 'kr' ? 'about-page--ko' : 'about-page--en'">
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
                  {{ member.name }}
                </a>
                <span v-else>{{ member.name }}</span>
              </template>
            </dd>
          </div>
        </dl>
      </section>
    </article>
  </main>
</template>

<script>
import { localeStore } from '@/store/locale.js'
import { aboutData } from '@/assets/data/about.js'
import { festivalTeamHeading, getFestivalTeam } from '@/assets/data/festivalTeam.js'

export default {
  name: 'About',
  data() {
    return {
      locale: localeStore,
    }
  },
  computed: {
    aboutContent() {
      return aboutData[this.locale.lang] || aboutData.en
    },
    teamHeading() {
      return festivalTeamHeading[this.locale.lang] || festivalTeamHeading.en
    },
    teamSections() {
      return getFestivalTeam(this.locale.lang)
    },
  },
}
</script>

<style scoped>
.about-page {
  box-sizing: border-box;
  width: 100%;
  padding: clamp(72px, 12vw, 132px) clamp(20px, 8vw, 112px);
  background: #fff;
  color: rgba(10, 10, 10, 0.82);
}

.about-page__inner {
  width: min(100%, 42rem);
  margin: 0 auto;
  filter: blur(0.22px) contrast(1.08);
  -webkit-font-smoothing: subpixel-antialiased;
  text-shadow:
    0 0 0.7px rgba(10, 10, 10, 0.42),
    0.42px 0.24px 0 rgba(10, 10, 10, 0.2),
    -0.28px -0.12px 0 rgba(10, 10, 10, 0.12);
}

.about-page--en .about-page__inner {
  font-family: var(--font-home-en);
  font-weight: 100;
}

.about-page--ko .about-page__inner {
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
  transition: opacity 0.15s ease;
}

.about-page__team-link:hover,
.about-page__team-link:focus-visible {
  opacity: 0.55;
  outline: none;
}

@media (max-width: 768px) {
  .about-page {
    padding: 72px 20px 48px;
  }

}
</style>
