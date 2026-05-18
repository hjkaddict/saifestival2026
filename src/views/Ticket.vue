<template>
  <main
    class="ticket-page app-min-vh"
    :class="locale.lang === 'kr' ? 'ticket-page--ko' : 'ticket-page--en'"
  >
    <article class="ticket-page__inner" :key="locale.lang">
      <h1 class="ticket-page__title">{{ copy.title }}</h1>

      <section class="ticket-section" aria-label="Program admission">
        <div v-for="program in programs" :key="program.id" class="ticket-program">
          <h2 class="ticket-program__title">
            <span>{{ program.name }}</span>
            <span class="ticket-program__admission">{{ program.admission }}</span>
          </h2>
          <p v-if="program.dates" class="ticket-program__meta">{{ program.dates }}</p>
          <p v-for="(line, idx) in program.hours" :key="idx" class="ticket-program__meta">
            {{ line }}
          </p>
        </div>
      </section>

      <section class="ticket-section" aria-labelledby="ticket-performance">
        <h2 id="ticket-performance" class="ticket-section__title">
          {{ copy.performanceHeading }}
        </h2>

        <div class="ticket-info-block">
          <h3 class="ticket-info-block__title">{{ copy.salesHeading }}</h3>
          <dl class="ticket-rows">
            <div class="ticket-row">
              <dt>{{ sales.earlyBirdLabel }}</dt>
              <dd>{{ sales.earlyBirdPeriod }}</dd>
            </div>
            <div class="ticket-row">
              <dt>{{ sales.regularLabel }}</dt>
              <dd>{{ sales.regularPeriod }}</dd>
            </div>
          </dl>
        </div>

        <div class="ticket-info-block">
          <h3 class="ticket-info-block__title">{{ copy.priceHeading }}</h3>
          <ul class="ticket-price-list">
            <li v-for="tier in prices" :key="tier.id" class="ticket-row">
              <span>{{ tier.label }}</span>
              <span>{{ tier.price }}</span>
            </li>
          </ul>
        </div>

        <div class="ticket-info-block">
          <h3 class="ticket-info-block__title">{{ copy.datesHeading }}</h3>
          <ul class="ticket-show-list">
            <li v-for="show in showDates" :key="show.id" class="ticket-show">
              <router-link :to="`/program#${show.id}`" class="ticket-show__link">
                <span class="ticket-show__date">{{ show.label }}</span>
                <span class="ticket-show__artists">{{ show.artists.join(', ') }}</span>
                <span class="ticket-show__cta">{{ copy.viewProgramLabel }}</span>
              </router-link>
              <a
                v-if="show.naverBookingUrl"
                class="ticket-show__book"
                :href="show.naverBookingUrl"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ copy.bookLabel }}
              </a>
              <span v-else class="ticket-show__book ticket-show__book--soon">
                {{ copy.bookOpens }}
              </span>
            </li>
          </ul>
        </div>
      </section>

      <section class="ticket-section ticket-section--notes" aria-labelledby="ticket-notes">
        <h2 id="ticket-notes" class="ticket-section__title">{{ footnotes.heading }}</h2>
        <ul class="ticket-notes">
          <li v-for="(bullet, idx) in footnotes.bullets" :key="idx">{{ bullet }}</li>
        </ul>
      </section>
    </article>
  </main>
</template>

<script>
import { localeStore } from '@/store/locale.js'
import {
  getPerformancePrices,
  getPerformanceShowDates,
  getTicketPrograms,
  getTicketSales,
  ticketFootnotes,
  ticketPage,
} from '@/assets/data/ticket.js'

export default {
  name: 'Ticket',
  data() {
    return {
      locale: localeStore,
    }
  },
  computed: {
    copy() {
      return ticketPage[this.locale.lang] || ticketPage.en
    },
    programs() {
      return getTicketPrograms(this.locale.lang)
    },
    sales() {
      return getTicketSales(this.locale.lang)
    },
    prices() {
      return getPerformancePrices(this.locale.lang)
    },
    showDates() {
      return getPerformanceShowDates(this.locale.lang)
    },
    footnotes() {
      return ticketFootnotes[this.locale.lang] || ticketFootnotes.en
    },
  },
}
</script>

<style scoped>
.ticket-page {
  box-sizing: border-box;
  width: 100%;
  padding: clamp(72px, 12vw, 132px) clamp(20px, 8vw, 112px);
  background: transparent;
  color: rgba(10, 10, 10, 0.82);
}

.ticket-page__inner {
  width: min(100%, 42rem);
  margin: 0 auto;
  filter: blur(0.22px) contrast(1.08);
  -webkit-font-smoothing: subpixel-antialiased;
  text-shadow:
    0 0 0.7px rgba(10, 10, 10, 0.42),
    0.42px 0.24px 0 rgba(10, 10, 10, 0.2),
    -0.28px -0.12px 0 rgba(10, 10, 10, 0.12);
}

.ticket-page--en .ticket-page__inner {
  font-family: var(--font-home-en);
  font-weight: 100;
}

.ticket-page--ko .ticket-page__inner {
  font-family: var(--font-home-ko);
  font-weight: 100;
}

.ticket-page__title,
.ticket-section__title,
.ticket-info-block__title,
.ticket-program__title,
.ticket-program__meta,
.ticket-row,
.ticket-show,
.ticket-notes {
  font-size: 1rem;
  line-height: 1.42;
  letter-spacing: 0.006em;
}

.ticket-page__title {
  margin: 0 0 2rem;
  font-weight: inherit;
}

.ticket-section {
  margin: 0 0 clamp(3rem, 7vw, 5rem);
}

.ticket-section:last-child {
  margin-bottom: 0;
}

.ticket-section__title,
.ticket-info-block__title {
  margin: 0 0 0.7rem;
  font-weight: inherit;
}

.ticket-program {
  margin: 0 0 1.15rem;
}

.ticket-program:last-child {
  margin-bottom: 0;
}

.ticket-program__title {
  margin: 0 0 0.15rem;
  font-weight: inherit;
}

.ticket-program__admission {
  margin-left: 0.5em;
}

.ticket-program__meta {
  margin: 0;
  color: rgba(10, 10, 10, 0.6);
}

.ticket-info-block {
  margin: 0 0 1.8rem;
}

.ticket-info-block:last-child {
  margin-bottom: 0;
}

.ticket-rows,
.ticket-price-list,
.ticket-show-list,
.ticket-notes {
  margin: 0;
  padding: 0;
  list-style: none;
}

.ticket-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin: 0 0 0.35rem;
}

.ticket-row dt,
.ticket-row dd {
  margin: 0;
}

.ticket-show {
  margin: 0 0 0.9rem;
}

.ticket-show:last-child {
  margin-bottom: 0;
}

.ticket-show__link {
  display: block;
  color: inherit;
  text-decoration: none;
}

.ticket-show__date,
.ticket-show__artists,
.ticket-show__cta,
.ticket-show__book {
  display: block;
}

.ticket-show__cta::after {
  content: '→';
  position: relative;
  z-index: 5;
  display: inline-block;
  margin-left: 0.26em;
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

.ticket-show__book:not(.ticket-show__book--soon)::after {
  content: '↗';
  position: relative;
  z-index: 5;
  display: inline-block;
  margin-left: 0.26em;
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

.ticket-show__artists,
.ticket-show__cta,
.ticket-show__book,
.ticket-notes {
  color: rgba(10, 10, 10, 0.6);
}

.ticket-show__link:hover,
.ticket-show__link:focus-visible {
  opacity: 0.62;
  outline: none;
}

.ticket-show__book {
  width: fit-content;
  margin-top: 0.2rem;
  text-decoration: none;
}

.ticket-show__book--soon {
  cursor: default;
}

.ticket-notes li {
  margin: 0 0 0.35rem;
}

@media (max-width: 768px) {
  .ticket-page {
    padding: 72px 20px 48px;
  }

  .ticket-row {
    display: block;
  }
}
</style>
