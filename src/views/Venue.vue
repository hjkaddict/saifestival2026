<template>
  <div class="venue-container">
    <div class="venue-map-wrap" aria-label="Venue sketch map">
      <VenueSketchMap :lang="locale.lang" class="venue-map-inner" />
      <aside class="venue-map-card" :key="locale.lang" aria-label="Venue details">
        <h2 class="venue-card-title">{{ venueCard.title }}</h2>
        <p class="venue-card-subtitle">{{ venueCard.subtitle }}</p>
        <address class="venue-card-address">
          <span
            v-for="(line, i) in venueCard.addressLines"
            :key="i"
            class="venue-card-address-line"
            >{{ line }}</span
          >
        </address>
        <a
          class="venue-card-link"
          :href="venueDirectionsUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ venueCard.directionsLabel }}
        </a>
      </aside>
    </div>

    <article class="venue-story" :key="locale.lang">
      <figure
        v-for="(block, idx) in venueBlocks"
        :key="idx"
        class="venue-photo venue-photo--overlay"
        :class="[`venue-photo--${block.variant}`]"
      >
        <picture class="venue-photo__media">
          <source type="image/webp" :srcset="block.srcWebp" />
          <img
            :src="block.srcJpeg"
            :alt="block.alt"
            :loading="idx === 0 ? 'eager' : 'lazy'"
            :fetchpriority="idx === 0 ? 'high' : 'auto'"
            decoding="async"
          />
        </picture>
        <div class="venue-photo__scrim" aria-hidden="true" />
        <figcaption class="venue-photo__copy">
          <h1 v-if="block.showTitle" class="venue-photo__title">{{ block.title }}</h1>
          <p v-for="(para, i) in block.paragraphs" :key="i" class="venue-photo__text">{{ para }}</p>
        </figcaption>
      </figure>
    </article>
  </div>
</template>

<script>
import { localeStore } from '@/store/locale.js'
import VenueSketchMap from '@/components/VenueSketchMap.vue'
import { venueDirectionsUrl, venuePlaceInfo } from '@/assets/data/venueMap.js'
import { buildVenueBlocks } from '@/assets/data/venueIntro.js'

export default {
  name: 'VenueView',
  components: { VenueSketchMap },
  data() {
    return {
      locale: localeStore,
      _scrollRafId: null,
    }
  },
  computed: {
    venueCard() {
      return venuePlaceInfo[this.locale.lang] || venuePlaceInfo.en
    },
    venueDirectionsUrl() {
      return venueDirectionsUrl
    },
    venueBlocks() {
      return buildVenueBlocks(this.locale.lang)
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
.venue-container {
  width: 100%;
  min-height: calc(var(--app-vh, 1vh) * 100);
  padding: 12vh 8vw 10vh;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 2rem;
  position: relative;
  z-index: 10;
  background-color: #fff;
}

.venue-story {
  width: 100%;
}

/* 사진 + 하단 오버레이 텍스트 */
.venue-photo {
  margin: 0;
  padding: 0;
  border: none;
  background: #0a0a0a;
}

.venue-photo--overlay {
  position: relative;
  overflow: hidden;
}

.venue-photo--bleed,
.venue-photo--full,
.venue-photo--tall {
  width: 100vw;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  margin-top: 2.25rem;
  margin-bottom: 2.25rem;
}

.venue-photo:first-child {
  margin-top: 0;
}

.venue-photo--bleed.venue-photo--overlay {
  min-height: min(84vh, 880px);
}

.venue-photo--full.venue-photo--overlay {
  min-height: min(72vh, 720px);
}

.venue-photo--tall.venue-photo--overlay {
  min-height: min(80vh, 800px);
}

.venue-photo__media {
  position: absolute;
  inset: 0;
  display: block;
}

.venue-photo__media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.venue-photo__scrim {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.58) 0%,
    rgba(0, 0, 0, 0.32) 28%,
    rgba(0, 0, 0, 0.1) 48%,
    rgba(0, 0, 0, 0) 72%
  );
}

.venue-photo__copy {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  margin: 0;
  padding: 2.25rem clamp(1rem, 4vw, 2.75rem) 1.85rem;
  max-width: 46rem;
  margin-left: auto;
  margin-right: auto;
  font-style: normal;
  color: #fff;
}

.venue-photo__title {
  font-size: clamp(1.35rem, 3vw, 2rem);
  font-weight: 700;
  margin: 0 0 0.85rem;
  line-height: 1.2;
  letter-spacing: -0.02em;
  word-break: keep-all;
  text-shadow:
    0 1px 3px rgba(0, 0, 0, 0.65),
    0 0 12px rgba(0, 0, 0, 0.35);
}

.venue-photo__text {
  margin: 0 0 0.75em;
  font-size: clamp(0.9rem, 1.85vw, 1.05rem);
  line-height: 1.65;
  font-weight: 450;
  word-break: keep-all;
  text-shadow:
    0 1px 2px rgba(0, 0, 0, 0.6),
    0 0 10px rgba(0, 0, 0, 0.3);
}

.venue-photo__text:last-child {
  margin-bottom: 0;
}

@media (max-width: 480px) {
  .venue-photo__copy {
    padding-bottom: 1.5rem;
  }

  .venue-photo__text {
    line-height: 1.7;
  }
}

.venue-map-wrap {
  position: relative;
  width: 100%;
  min-height: 45vh;
  height: 420px;
  max-height: 60vh;
  border: 1px solid #000;
  background: #f4f1ea;
}

.venue-map-inner {
  position: absolute;
  inset: 0;
}

.venue-map-card {
  position: absolute;
  left: 12px;
  bottom: 12px;
  max-width: min(280px, calc(100% - 24px));
  padding: 14px 16px;
  background: #fff;
  border: 1px solid #000;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.12);
  pointer-events: auto;
  z-index: 2;
  font-size: 0.8rem;
  line-height: 1.45;
  color: #000;
}

.venue-card-title {
  font-size: 0.95rem;
  font-weight: 700;
  margin: 0 0 4px;
  letter-spacing: 0.02em;
}

.venue-card-subtitle {
  margin: 0 0 10px;
  font-weight: 400;
  opacity: 0.85;
}

.venue-card-address {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0 0 12px;
  font-style: normal;
  opacity: 0.9;
}

.venue-card-address-line {
  display: block;
}

.venue-card-link {
  display: inline-block;
  margin: 0;
  padding: 6px 10px;
  background: #000;
  color: #fff;
  text-decoration: none;
  border: 1px solid #000;
  font-size: 0.75rem;
  transition:
    background 0.15s ease,
    color 0.15s ease;
}

.venue-card-link:hover {
  background: #fff;
  color: #000;
}
</style>
