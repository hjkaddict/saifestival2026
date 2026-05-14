<template>
  <div class="ticket-container">
    <article class="ticket-wrapper" :key="locale.lang">
      <header class="ticket-header">
        <h1 class="ticket-title">{{ copy.title }}</h1>
      </header>

      <section class="ticket-block">
        <ul class="program-list">
          <li
            v-for="program in programs"
            :key="program.id"
            class="program-card"
            :class="{ 'program-card--paid': program.isPaid }"
          >
            <div class="program-card__head">
              <span class="program-card__name">{{ program.name }}</span>
              <span class="program-card__badge">{{ program.admission }}</span>
            </div>
            <p v-if="program.dates" class="program-card__meta">{{ program.dates }}</p>
            <p v-for="(line, i) in program.hours" :key="i" class="program-card__meta">{{ line }}</p>
          </li>
        </ul>
      </section>

      <section class="ticket-block ticket-block--performance" aria-labelledby="ticket-performance-heading">
        <h2 id="ticket-performance-heading" class="ticket-block__heading">
          {{ copy.performanceHeading }}
        </h2>

        <div class="sales-panel">
          <h3 class="sales-panel__sub">{{ copy.salesHeading }}</h3>
          <dl class="sales-panel__rows">
            <div class="sales-panel__row">
              <dt>{{ sales.earlyBirdLabel }}</dt>
              <dd>{{ sales.earlyBirdPeriod }}</dd>
            </div>
            <div class="sales-panel__row">
              <dt>{{ sales.regularLabel }}</dt>
              <dd>{{ sales.regularPeriod }}</dd>
            </div>
          </dl>
        </div>

        <div class="price-panel">
          <h3 class="price-panel__sub">{{ copy.priceHeading }}</h3>
          <ul class="price-list">
            <li v-for="tier in prices" :key="tier.id" class="price-list__row">
              <span class="price-list__label">{{ tier.label }}</span>
              <span class="price-list__value">{{ tier.price }}</span>
            </li>
          </ul>
        </div>

        <div class="dates-panel">
          <h3 class="dates-panel__sub">{{ copy.datesHeading }}</h3>
          <ul class="show-list">
            <li v-for="show in showDates" :key="show.id" class="show-card">
              <div class="show-card__body">
                <router-link :to="`/program#${show.id}`" class="show-card__link">
                  <span class="show-card__date">{{ show.label }}</span>
                  <span class="show-card__artists">{{ show.artists.join(', ') }}</span>
                  <span class="show-card__cta">{{ copy.viewProgramLabel }}</span>
                </router-link>
                <a
                  v-if="show.naverBookingUrl"
                  class="show-card__book-btn"
                  :href="show.naverBookingUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ copy.bookLabel }}
                </a>
                <p v-else class="show-card__book-soon">{{ copy.bookLabel }} · {{ copy.bookOpens }}</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section class="ticket-footnotes" aria-labelledby="ticket-footnotes-heading">
        <h2 id="ticket-footnotes-heading" class="ticket-footnotes__heading">
          {{ footnotes.heading }}
        </h2>
        <ul class="ticket-footnotes__list">
          <li v-for="(bullet, i) in footnotes.bullets" :key="i">{{ bullet }}</li>
        </ul>
      </section>
    </article>
  </div>
</template>

<script>
import { localeStore } from '@/store/locale.js'
import {
  ticketPage,
  ticketFootnotes,
  getTicketPrograms,
  getTicketSales,
  getPerformancePrices,
  getPerformanceShowDates,
} from '@/assets/data/ticket.js'

export default {
  name: 'TicketView',
  data() {
    return {
      locale: localeStore,
      _scrollRafId: null,
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
.ticket-container {
  width: 100%;
  min-height: calc(var(--app-vh, 1vh) * 100);
  padding: 18vh 10vw 12vh;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 10;
  background-color: #fff;
}

.ticket-wrapper {
  width: 100%;
  max-width: 34rem;
  margin: 0 auto;
  text-align: center;
}

.ticket-header {
  margin-bottom: 2.75rem;
}

.ticket-title {
  margin: 0;
  font-size: clamp(1.6rem, 4vw, 2.1rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.ticket-block {
  margin-bottom: 2.75rem;
}

.ticket-block--performance {
  padding-top: 0.25rem;
}

.ticket-block__heading {
  margin: 0 0 1.25rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.program-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.program-card {
  padding: 0;
}

.program-card__head {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.3rem;
}

.program-card__name {
  font-size: 1rem;
  font-weight: 700;
  word-break: keep-all;
}

.program-card__badge {
  flex-shrink: 0;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  opacity: 0.5;
}

.program-card--paid .program-card__badge {
  opacity: 1;
}

.program-card__meta {
  margin: 0 0 0.15rem;
  font-size: 0.86rem;
  line-height: 1.5;
  opacity: 0.7;
  word-break: keep-all;
}

.program-card__meta:last-child {
  margin-bottom: 0;
}

.sales-panel,
.price-panel,
.dates-panel {
  margin-bottom: 1.5rem;
}

.sales-panel {
  padding: 1rem 1.1rem;
}

.sales-panel__sub,
.price-panel__sub,
.dates-panel__sub {
  margin: 0 0 0.65rem;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.45;
}

.sales-panel__rows {
  margin: 0;
}

.sales-panel__row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  margin-bottom: 0.45rem;
}

.sales-panel__row:last-of-type {
  margin-bottom: 0;
}

.sales-panel__row dt {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 600;
}

.sales-panel__row dd {
  margin: 0;
  font-size: 0.86rem;
  line-height: 1.45;
  opacity: 0.8;
  word-break: keep-all;
}

.price-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.price-list__row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  font-size: 0.92rem;
}

.price-list__label {
  font-weight: 450;
}

.price-list__value {
  font-weight: 700;
  white-space: nowrap;
}

.show-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.show-card {
  padding: 0;
}

.show-card__body {
  padding: 0;
}

.show-card__link {
  display: block;
  padding: 0;
  color: inherit;
  text-decoration: none;
  transition: opacity 0.15s ease;
}

.show-card__link:hover {
  opacity: 0.55;
}

.show-card__date {
  display: block;
  margin-bottom: 0.3rem;
  font-size: 0.92rem;
  font-weight: 700;
}

.show-card__artists {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.84rem;
  line-height: 1.5;
  opacity: 0.75;
  word-break: keep-all;
}

.show-card__cta {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-decoration: underline;
  text-underline-offset: 0.12em;
  opacity: 0.45;
}

.show-card__book-btn {
  display: inline-block;
  margin-top: 0.65rem;
  padding: 0.45rem 0.75rem;
  background: #000;
  color: #fff;
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  text-decoration: none;
  border: 1px solid #000;
  transition:
    background 0.15s ease,
    color 0.15s ease;
}

.show-card__book-btn:hover {
  background: #fff;
  color: #000;
}

.show-card__book-soon {
  margin: 0.55rem 0 0;
  font-size: 0.78rem;
  opacity: 0.5;
  word-break: keep-all;
}

.ticket-footnotes {
  padding-top: 2rem;
}

.ticket-footnotes__heading {
  margin: 0 0 0.85rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.45;
}

.ticket-footnotes__list {
  display: inline-block;
  margin: 0;
  padding: 0;
  list-style: none;
  text-align: left;
}

.ticket-footnotes__list li {
  position: relative;
  margin: 0 0 0.45rem;
  padding-left: 0.85rem;
  font-size: 0.82rem;
  line-height: 1.55;
  opacity: 0.65;
  word-break: keep-all;
}

.ticket-footnotes__list li::before {
  content: '·';
  position: absolute;
  left: 0;
  opacity: 0.5;
}

.ticket-footnotes__list li:last-child {
  margin-bottom: 0;
}

@media (max-width: 480px) {
  .sales-panel__row {
    gap: 0.15rem;
  }
}
</style>
