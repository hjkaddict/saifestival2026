<template>
  <main
    class="ticket-page app-min-vh"
    :class="locale.lang === 'kr' ? 'ticket-page--ko' : 'ticket-page--en'"
  >
    <p v-if="showComingSoon" class="ticket-page__message">{{ comingSoonMessage }}</p>

    <article v-else class="ticket-page__inner" :key="locale.lang">
      <h1 class="ticket-page__title visually-hidden">{{ copy.title }}</h1>

      <section class="ticket-section" aria-label="Program admission">
        <div
          v-for="program in programs"
          :key="program.id"
          class="ticket-program"
          :class="{ 'ticket-program--paid': program.isPaid }"
        >
          <h2 class="ticket-row ticket-program__title">
            <span class="ticket-program__name rich-text" v-html="program.name"></span>
            <span class="ticket-program__admission ticket-row__value rich-text" v-html="program.admission"></span>
          </h2>
          <p v-if="program.dates" class="ticket-program__meta rich-text" v-html="program.dates"></p>
          <p
            v-for="(line, idx) in program.hours"
            :key="idx"
            class="ticket-program__meta rich-text"
            v-html="line"
          ></p>
        </div>
      </section>

      <section
        class="ticket-section"
        :aria-label="locale.lang === 'kr' ? '퍼포먼스 티켓' : 'Performance tickets'"
      >
        <div class="ticket-info-block">
          <ul class="ticket-price-list">
            <li v-for="tier in prices" :key="tier.id" class="ticket-row ticket-row--tier">
              <span class="ticket-row__main">
                <span class="ticket-row__label rich-text" v-html="tier.label"></span>
                <span class="ticket-row__period rich-text" v-html="tier.period"></span>
              </span>
              <span class="ticket-row__value ticket-row__value--price rich-text" v-html="tier.price"></span>
            </li>
          </ul>
        </div>

        <div class="ticket-info-block ticket-info-block--dates">
          <ul id="ticket-dates" class="ticket-show-list">
            <li v-for="show in showDates" :key="show.id" class="ticket-row ticket-row--show">
              <div class="ticket-row__main">
                <span class="ticket-show__date rich-text" v-html="show.dateLabel"></span>
                <span class="ticket-show__artists rich-text" v-html="show.artists.join(', ')"></span>
              </div>
              <a
                v-if="show.naverBookingUrl"
                class="ticket-row__value ticket-booking-cta ticket-booking-cta--link"
                :href="show.naverBookingUrl"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span class="ticket-booking-cta__text">{{ copy.bookLabel }}</span>
                <svg
                  class="ticket-booking-cta__icon"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    stroke="currentColor"
                    stroke-width="1.25"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.5 9.5 9.5 2.5M9.5 2.5H4.5M9.5 2.5v5"
                  />
                </svg>
              </a>
              <span v-else class="ticket-row__value ticket-booking-cta ticket-booking-cta--soon">
                <span class="ticket-booking-cta__text">{{ copy.bookOpens }}</span>
                <svg
                  class="ticket-booking-cta__icon"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    stroke="currentColor"
                    stroke-width="1.25"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.5 9.5 9.5 2.5M9.5 2.5H4.5M9.5 2.5v5"
                  />
                </svg>
              </span>
            </li>
          </ul>
        </div>
      </section>

      <section
        class="ticket-section ticket-section--notes"
        :aria-label="locale.lang === 'kr' ? '안내' : 'Notes'"
      >
        <ul class="ticket-notes">
          <li v-for="(bullet, idx) in footnotes.bullets" :key="idx" class="rich-text" v-html="bullet"></li>
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
  ticketFootnotes,
  ticketPage,
} from '@/assets/data/ticket.js'

// Set to false when ticket content is ready to publish.
const TICKET_SHOW_COMING_SOON = false

export default {
  name: 'Ticket',
  data() {
    return {
      locale: localeStore,
      showComingSoon: TICKET_SHOW_COMING_SOON,
    }
  },
  computed: {
    comingSoonMessage() {
      return this.locale.lang === 'kr' ? '업데이트 될 예정입니다.' : 'Will be updated.'
    },
    copy() {
      return ticketPage[this.locale.lang] || ticketPage.en
    },
    programs() {
      return getTicketPrograms(this.locale.lang)
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

.ticket-page__message {
  display: grid;
  place-items: center;
  width: 100%;
  min-height: calc(100vh - clamp(72px, 12vw, 132px) * 2);
  margin: 0;
  font-size: 1rem;
  font-weight: 100;
  line-height: 1.42;
  letter-spacing: 0.006em;
  text-align: center;
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

.ticket-page--en .ticket-page__inner,
.ticket-page--en .ticket-page__message {
  font-family: var(--font-home-en);
  font-weight: 300;
  letter-spacing: 0.02em;
}

.ticket-page--ko .ticket-page__inner,
.ticket-page--ko .ticket-page__message {
  font-family: var(--font-home-ko);
  font-weight: 100;
}

.ticket-section__title,
.ticket-info-block__title,
.ticket-program__title,
.ticket-program__meta,
.ticket-row,
.ticket-notes {
  font-size: 1rem;
  line-height: 1.42;
  letter-spacing: 0.006em;
}

.ticket-page--en .ticket-section__title {
  letter-spacing: 0.04em;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.ticket-section {
  margin: 0 0 clamp(3.2rem, 8vw, 4.5rem);
}

.ticket-section:first-of-type {
  margin-bottom: clamp(1rem, 2.8vw, 1.35rem);
}

.ticket-section:last-child {
  margin-bottom: 0;
}

.ticket-section__title {
  margin: 0 0 clamp(1.2rem, 3vw, 1.6rem);
  font-weight: 500;
}

.ticket-page--ko .ticket-section__title {
  font-weight: 600;
}

.ticket-section--notes {
  margin-top: clamp(3.6rem, 9vw, 5rem);
}

.ticket-program {
  margin: 0 0 clamp(2.8rem, 7vw, 3.8rem);
}

.ticket-program:last-child {
  margin-bottom: 0;
}

.ticket-program__title {
  margin: 0 0 0.2rem;
}

.ticket-program__name {
  min-width: 0;
  font-weight: 500;
}

.ticket-page--ko .ticket-program__name {
  font-weight: 600;
}

.ticket-program__admission {
  flex-shrink: 0;
  text-align: right;
  color: rgba(10, 10, 10, 0.42);
  font-weight: 300;
}

.ticket-page--ko .ticket-program__admission {
  font-weight: 100;
}

.ticket-program--paid .ticket-program__admission {
  text-decoration: underline;
  text-underline-offset: 0.12em;
  text-decoration-thickness: 0.06em;
}

.ticket-program__meta {
  margin: 0;
  color: rgba(10, 10, 10, 0.48);
  font-weight: 300;
}

.ticket-page--ko .ticket-program__meta {
  font-weight: 100;
}

.ticket-program__meta + .ticket-program__meta {
  margin-top: 0.08rem;
}

.ticket-info-block {
  margin: 0 0 clamp(2rem, 5vw, 2.6rem);
}

.ticket-info-block:last-child {
  margin-bottom: 0;
}

.ticket-info-block__title {
  margin: 0 0 0.55rem;
  color: rgba(10, 10, 10, 0.46);
  font-weight: 400;
  font-size: 0.92rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.ticket-page--ko .ticket-info-block__title {
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.006em;
  text-transform: none;
  color: rgba(10, 10, 10, 0.5);
}

.ticket-row--show {
  margin-bottom: clamp(1.1rem, 3vw, 1.45rem);
  padding-bottom: clamp(1.1rem, 3vw, 1.45rem);
  border-bottom: 1px solid rgba(10, 10, 10, 0.08);
}

.ticket-row--show:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: 0;
}

.ticket-row__value.ticket-booking-cta {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.3em;
  flex-shrink: 0;
  text-align: right;
}

.ticket-booking-cta {
  color: #ff0000;
  font-weight: 500;
  letter-spacing: 0.02em;
  text-decoration: none;
  white-space: nowrap;
  filter: none;
}

.ticket-page--ko .ticket-booking-cta {
  font-weight: 600;
  letter-spacing: 0.006em;
}

.ticket-booking-cta--link {
  cursor: pointer;
}

.ticket-booking-cta--link:hover,
.ticket-booking-cta--link:focus-visible {
  color: #cc0000;
  outline: none;
}

@keyframes ticket-booking-soon-fade {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.28;
  }
}

.ticket-booking-cta--soon {
  cursor: default;
  animation: ticket-booking-soon-fade 3.2s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .ticket-booking-cta--soon {
    animation: none;
  }
}

.ticket-booking-cta__text {
  display: inline;
}

.ticket-booking-cta__icon {
  display: block;
  flex: 0 0 0.72em;
  width: 0.72em;
  height: 0.72em;
}

.ticket-price-list,
.ticket-show-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.ticket-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1.25rem;
  margin: 0 0 0.5rem;
}

.ticket-row:last-child {
  margin-bottom: 0;
}

.ticket-row--tier {
  margin-bottom: 0.5rem;
}

.ticket-row--tier:last-child {
  margin-bottom: 0;
}

.ticket-row__main {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.ticket-row__label {
  color: rgba(10, 10, 10, 0.78);
  font-weight: 400;
}

.ticket-page--ko .ticket-row__label {
  font-weight: 500;
}

.ticket-row__period {
  color: rgba(10, 10, 10, 0.46);
  font-weight: 300;
  font-size: 0.94rem;
}

.ticket-page--ko .ticket-row__period {
  font-size: 1rem;
  font-weight: 100;
}

.ticket-row__value--price {
  font-weight: 400;
  color: #0a0a0a;
  letter-spacing: 0.02em;
}

.ticket-row__value.ticket-booking-cta {
  font-weight: 500;
  color: #ff0000;
  letter-spacing: 0.02em;
}

.ticket-page--ko .ticket-row__value--price {
  font-weight: 500;
  letter-spacing: 0.006em;
}

.ticket-page--ko .ticket-row__value.ticket-booking-cta {
  font-weight: 600;
  letter-spacing: 0.006em;
}

.ticket-show__date {
  display: block;
}

.ticket-show__artists {
  display: block;
}

.ticket-show__date {
  margin-bottom: 0.12rem;
  font-weight: 500;
  color: rgba(10, 10, 10, 0.9);
}

.ticket-page--ko .ticket-show__date {
  font-weight: 600;
}

.ticket-show__artists {
  margin-bottom: 0;
  color: rgba(10, 10, 10, 0.52);
  font-weight: 300;
}

.ticket-page--ko .ticket-show__artists {
  font-weight: 100;
}

.ticket-notes {
  margin: 0;
  padding: 0;
  list-style: none;
  color: rgba(10, 10, 10, 0.46);
  font-weight: 300;
  font-size: 0.94rem;
  line-height: 1.48;
}

.ticket-page--ko .ticket-notes {
  font-size: 1rem;
  font-weight: 100;
}

.ticket-notes li {
  position: relative;
  margin: 0 0 0.45rem;
  padding-left: 0.95em;
}

.ticket-notes li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.58em;
  width: 0.32em;
  height: 0.32em;
  border-radius: 50%;
  background: #0a0a0a;
  transform: translateY(-50%);
}

.ticket-notes li:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .ticket-page {
    padding: calc(108px + env(safe-area-inset-top, 0px)) 20px 48px;
  }

  .ticket-page__inner > .ticket-section:first-child {
    margin-top: 0.75rem;
  }

  .ticket-page__message {
    min-height: calc(100vh - 120px);
  }

  .ticket-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.12rem;
  }

  .ticket-row--tier,
  .ticket-row--show,
  .ticket-program__title {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }

  .ticket-row__value--price,
  .ticket-row__value.ticket-booking-cta,
  .ticket-program__admission {
    flex-shrink: 0;
    text-align: right;
  }
}
</style>
