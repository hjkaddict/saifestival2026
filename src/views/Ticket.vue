<template>
  <main
    class="ticket-page app-min-vh"
    :class="locale.lang === 'kr' ? 'ticket-page--ko' : 'ticket-page--en'"
  >
    <p v-if="showComingSoon" class="ticket-page__message">{{ comingSoonMessage }}</p>

    <article v-else class="ticket-page__inner" :key="locale.lang">
      <h1 class="ticket-page__title visually-hidden">{{ copy.title }}</h1>

      <section class="ticket-section ticket-section--programs" aria-label="Program admission">
        <ul class="ticket-program-list">
          <li
            v-for="program in programs"
            :key="program.id"
            class="ticket-program"
            :class="{ 'ticket-program--paid': program.isPaid }"
          >
            <div class="ticket-line ticket-line--head">
              <span class="ticket-line__primary rich-text" v-html="program.name"></span>
              <template v-if="program.isPaid">
                <a
                  v-if="bookingUrl"
                  class="ticket-line__action ticket-booking-cta ticket-booking-cta--link"
                  :href="bookingUrl"
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
                <span v-else class="ticket-line__action ticket-booking-cta ticket-booking-cta--soon">
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
              </template>
              <span v-else class="ticket-line__badge rich-text" v-html="program.admission"></span>
            </div>
            <div
              v-if="program.dates || program.hours.length"
              class="ticket-program__details"
            >
              <p v-if="program.dates" class="ticket-detail ticket-detail--dates rich-text" v-html="program.dates"></p>
              <p
                v-for="(line, idx) in program.hours"
                :key="idx"
                class="ticket-detail ticket-detail--hours rich-text"
                v-html="line"
              ></p>
            </div>

            <div
              v-if="program.isPaid"
              class="ticket-program__subs"
              :aria-label="locale.lang === 'kr' ? '퍼포먼스 티켓' : 'Performance tickets'"
            >
              <div class="ticket-block ticket-block--prices">
                <ul class="ticket-tier-list">
                  <li v-for="tier in prices" :key="tier.id" class="ticket-tier">
                    <div class="ticket-tier__main">
                      <span class="ticket-tier__label rich-text" v-html="tier.label"></span>
                      <span class="ticket-tier__period rich-text" v-html="tier.period"></span>
                    </div>
                    <span class="ticket-tier__price rich-text" v-html="tier.price"></span>
                  </li>
                </ul>
              </div>

              <ul
                class="ticket-notes"
                :aria-label="locale.lang === 'kr' ? '안내' : 'Notes'"
              >
                <li v-for="(bullet, idx) in footnotes.bullets" :key="idx" class="rich-text" v-html="bullet"></li>
              </ul>
            </div>

            <router-link
              :to="{ path: '/program', hash: `#${program.id}` }"
              class="ticket-program__view"
            >
              <span class="ticket-program__view-text">{{ program.viewProgramLabel }}</span>
              <span class="ticket-program__view-arrow" aria-hidden="true">→</span>
            </router-link>
          </li>
        </ul>
      </section>
    </article>
  </main>
</template>

<script>
import { localeStore } from '@/store/locale.js'
import {
  getPerformancePrices,
  getTicketPrograms,
  performanceBooking,
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
    footnotes() {
      return ticketFootnotes[this.locale.lang] || ticketFootnotes.en
    },
    bookingUrl() {
      return performanceBooking.url
    },
  },
}
</script>

<style scoped>
.ticket-page {
  --ticket-text: rgba(10, 10, 10, 0.86);
  --ticket-text-muted: rgba(10, 10, 10, 0.5);
  --ticket-text-soft: rgba(10, 10, 10, 0.42);
  --ticket-line: rgba(10, 10, 10, 0.1);
  --ticket-gap-sm: 0.35rem;
  --ticket-gap-md: 0.75rem;
  --ticket-gap-lg: 1.5rem;
  --ticket-gap-xl: 2.25rem;

  box-sizing: border-box;
  width: 100%;
  padding: clamp(72px, 12vw, 132px) clamp(20px, 8vw, 112px);
  background: transparent;
  color: var(--ticket-text);
  font-size: 1rem;
  line-height: 1.5;
  letter-spacing: normal;
}

.ticket-page__message {
  display: grid;
  place-items: center;
  width: 100%;
  min-height: calc(100vh - clamp(72px, 12vw, 132px) * 2);
  margin: 0;
  text-align: center;
}

.ticket-page__inner {
  width: min(100%, 40rem);
  margin: 0 auto;
}

.ticket-page--en .ticket-page__inner,
.ticket-page--en .ticket-page__message {
  font-family: var(--font-home-en);
  font-weight: 300;
  letter-spacing: normal;
}

.ticket-page--ko .ticket-page__inner,
.ticket-page--ko .ticket-page__message {
  font-family: var(--font-home-ko);
  font-weight: 100;
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
  margin: 0 0 var(--ticket-gap-xl);
}

.ticket-section:last-child {
  margin-bottom: 0;
}

/* Programs */

.ticket-program-list,
.ticket-tier-list,
.ticket-notes {
  margin: 0;
  padding: 0;
  list-style: none;
}

.ticket-program {
  margin: 0 0 var(--ticket-gap-xl);
  padding-bottom: var(--ticket-gap-xl);
  border-bottom: 1px solid var(--ticket-line);
}

.ticket-program:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: 0;
}

.ticket-program__subs {
  margin-top: var(--ticket-gap-lg);
  padding-left: clamp(0.65rem, 2.5vw, 1rem);
}

.ticket-line {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: baseline;
  gap: 1rem 1.25rem;
}

.ticket-line__primary {
  min-width: 0;
  font-weight: 500;
  color: var(--ticket-text);
}

.ticket-page--ko .ticket-line__primary {
  font-weight: 600;
}

.ticket-line__badge {
  flex-shrink: 0;
  text-align: right;
  color: var(--ticket-text-soft);
  font-weight: 300;
  white-space: nowrap;
}

.ticket-page--ko .ticket-line__badge {
  font-weight: 100;
}

.ticket-line__action {
  flex-shrink: 0;
  justify-self: end;
}

.ticket-program__view {
  display: inline-flex;
  align-items: center;
  gap: 0.28em;
  margin-top: var(--ticket-gap-md);
  color: var(--ticket-text-muted);
  font-weight: 400;
  font-size: 0.94rem;
  letter-spacing: normal;
  text-decoration: none;
  filter: none;
}

.ticket-page--ko .ticket-program__view {
  font-size: 1rem;
  font-weight: 100;
}

.ticket-program--paid .ticket-program__view {
  margin-top: var(--ticket-gap-lg);
}

.ticket-program__view:hover,
.ticket-program__view:focus-visible {
  color: var(--ticket-text);
  outline: none;
}

.ticket-program__view-arrow {
  font-family: var(--font-home-en);
  font-weight: 700;
  line-height: 1;
}

.ticket-program__details {
  margin-top: var(--ticket-gap-sm);
  padding-left: 0;
}

.ticket-detail {
  margin: 0;
  color: var(--ticket-text-muted);
  font-weight: 300;
  font-size: 0.94rem;
  line-height: 1.45;
}

.ticket-page--ko .ticket-detail {
  font-size: 1rem;
  font-weight: 100;
}

.ticket-detail--dates + .ticket-detail--hours,
.ticket-detail--hours + .ticket-detail--hours {
  margin-top: 0.15rem;
}

.ticket-detail--hours {
  color: var(--ticket-text-muted);
}

/* Prices */

.ticket-block--prices {
  margin-bottom: 0;
}

.ticket-program__subs .ticket-notes {
  margin-top: var(--ticket-gap-lg);
}

.ticket-tier {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  gap: 0.2rem 1.25rem;
  margin-bottom: var(--ticket-gap-md);
}

.ticket-tier:last-child {
  margin-bottom: 0;
}

.ticket-tier__main {
  min-width: 0;
}

.ticket-tier__label {
  display: block;
  color: var(--ticket-text);
  font-weight: 400;
}

.ticket-page--ko .ticket-tier__label {
  font-weight: 500;
}

.ticket-tier__period {
  display: block;
  margin-top: 0.12rem;
  color: var(--ticket-text-muted);
  font-weight: 300;
  font-size: 0.9rem;
  line-height: 1.4;
}

.ticket-page--ko .ticket-tier__period {
  font-size: 0.96rem;
  font-weight: 100;
}

.ticket-tier__price {
  flex-shrink: 0;
  text-align: right;
  color: var(--ticket-text);
  font-weight: 400;
  white-space: nowrap;
}

.ticket-page--ko .ticket-tier__price {
  font-weight: 500;
}

.ticket-booking-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.28em;
  color: #ff0000;
  font-weight: 500;
  letter-spacing: normal;
  text-decoration: none;
  white-space: nowrap;
  filter: none;
}

.ticket-page--ko .ticket-booking-cta {
  font-weight: 600;
  letter-spacing: normal;
}

.ticket-booking-cta--link {
  cursor: pointer;
  animation: ticket-booking-pulse 2.8s ease-in-out infinite;
}

.ticket-booking-cta--link:hover,
.ticket-booking-cta--link:focus-visible {
  color: #cc0000;
  opacity: 1;
  animation: none;
  outline: none;
}

@keyframes ticket-booking-pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.42;
  }
}

.ticket-booking-cta--soon {
  cursor: default;
  animation: ticket-booking-pulse 2.8s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .ticket-booking-cta--link,
  .ticket-booking-cta--soon {
    animation: none;
  }
}

.ticket-booking-cta__icon {
  display: block;
  flex: 0 0 0.72em;
  width: 0.72em;
  height: 0.72em;
}

/* Notes */

.ticket-notes {
  color: var(--ticket-text-muted);
  font-weight: 300;
  font-size: 0.92rem;
  line-height: 1.55;
}

.ticket-page--ko .ticket-notes {
  font-size: 0.98rem;
  font-weight: 100;
}

.ticket-notes li {
  position: relative;
  margin: 0 0 0.55rem;
  padding-left: 1em;
}

.ticket-notes li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.62em;
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
    --ticket-gap-xl: 2rem;

    padding: calc(108px + env(safe-area-inset-top, 0px)) 20px 48px;
  }

  .ticket-page__inner > .ticket-section--programs {
    margin-top: 0.5rem;
  }

  .ticket-page__message {
    min-height: calc(100vh - 120px);
  }

  .ticket-program__subs {
    padding-left: 0.5rem;
  }
}
</style>
