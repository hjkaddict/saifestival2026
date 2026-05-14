<template>
  <div class="venue-container">
    <p v-if="mapLoadState === 'no-key'" class="map-hint">{{ copy.mapNoKey }}</p>
    <p v-else-if="mapLoadState === 'error'" class="map-hint">{{ copy.mapError }}</p>
    <div
      v-else
      class="venue-map-wrap"
      :class="{ 'is-loading': mapLoadState === 'loading' }"
      aria-label="Venue map"
    >
      <div ref="mapContainer" class="venue-map-inner" />
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
          :href="venueExternalMapsUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ venueCard.mapsLinkLabel }}
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
import { setOptions, importLibrary } from '@googlemaps/js-api-loader'
import { localeStore } from '@/store/locale.js'
import {
  defaultVenueCenter,
  defaultVenueZoom,
  venueGrayscaleMapStyles,
  venuePlaceInfo,
} from '@/assets/data/venueMap.js'
import { buildVenueBlocks } from '@/assets/data/venueIntro.js'

const messages = {
  kr: {
    mapNoKey:
      '지도를 보려면 프로젝트 루트에 .env.local 파일을 만들고 VITE_GOOGLE_MAPS_API_KEY=발급받은키 를 넣은 뒤 개발 서버를 다시 실행하세요. Google Cloud에서 Maps JavaScript API를 켜야 합니다.',
    mapError:
      '지도를 불러오지 못했습니다. API 키 제한·결제·Maps JavaScript API 활성화를 확인해 주세요.',
  },
  en: {
    mapNoKey:
      'Add VITE_GOOGLE_MAPS_API_KEY to .env.local and restart the dev server. Enable the Maps JavaScript API for your key in Google Cloud.',
    mapError:
      'The map could not be loaded. Check API key restrictions, billing, and that Maps JavaScript API is enabled.',
  },
}

function parseEnvNumber(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

export default {
  name: 'VenueView',
  data() {
    return {
      locale: localeStore,
      mapLoadState: 'idle',
      mapInstance: null,
      _onMapResize: null,
      _scrollRafId: null,
    }
  },
  computed: {
    copy() {
      return messages[this.locale.lang] || messages.en
    },
    venueCenter() {
      const lat = parseEnvNumber(import.meta.env.VITE_VENUE_MAP_LAT)
      const lng = parseEnvNumber(import.meta.env.VITE_VENUE_MAP_LNG)
      if (lat != null && lng != null) {
        return { lat, lng }
      }
      return defaultVenueCenter
    },
    venueZoom() {
      const z = parseEnvNumber(import.meta.env.VITE_VENUE_MAP_ZOOM)
      return z != null ? z : defaultVenueZoom
    },
    venueCard() {
      return venuePlaceInfo[this.locale.lang] || venuePlaceInfo.en
    },
    venueExternalMapsUrl() {
      const { lat, lng } = this.venueCenter
      return `https://www.google.com/maps?q=${lat},${lng}`
    },
    venueBlocks() {
      return buildVenueBlocks(this.locale.lang)
    },
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    this.handleScroll()
    this.initMap()
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
    if (this._scrollRafId != null) {
      cancelAnimationFrame(this._scrollRafId)
      this._scrollRafId = null
    }
    window.aboutScrollProgress = 0
    window.dispatchEvent(new Event('scroll-canvas'))
    if (this._onMapResize) {
      window.removeEventListener('resize', this._onMapResize)
      this._onMapResize = null
    }
    this.mapInstance = null
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
    async initMap() {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      if (!apiKey) {
        this.mapLoadState = 'no-key'
        return
      }

      this.mapLoadState = 'loading'
      await this.$nextTick()

      try {
        setOptions({
          key: apiKey,
          v: 'weekly',
          language: this.locale.lang === 'kr' ? 'ko' : 'en',
          region: 'KR',
        })
        await importLibrary('maps')

        const el = this.$refs.mapContainer
        if (!el) return

        const center = this.venueCenter
        const map = new google.maps.Map(el, {
          center,
          zoom: this.venueZoom,
          styles: venueGrayscaleMapStyles,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
        })

        new google.maps.Marker({
          map,
          position: center,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#000000',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
        })

        this.mapInstance = map
        this.mapLoadState = 'ready'

        this._onMapResize = () => {
          if (this.mapInstance) {
            google.maps.event.trigger(this.mapInstance, 'resize')
          }
        }
        window.addEventListener('resize', this._onMapResize)
      } catch (e) {
        console.error(e)
        this.mapLoadState = 'error'
      }
    },
  },
}
</script>

<style scoped>
.venue-container {
  width: 100%;
  min-height: 100vh;
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
  background: #e8e8e8;
}

.venue-map-wrap.is-loading {
  opacity: 0.92;
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
  font-family: monospace;
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

.map-hint {
  font-size: 0.9rem;
  line-height: 1.5;
  color: #333;
  word-break: keep-all;
  max-width: 40rem;
}
</style>
