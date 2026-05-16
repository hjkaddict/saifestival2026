<template>
  <main
    class="venue-page app-min-vh"
    :class="locale.lang === 'kr' ? 'venue-page--ko' : 'venue-page--en'"
  >
    <p v-if="mapLoadState === 'no-key'" class="venue-page__hint">{{ mapNoKeyMessage }}</p>
    <p v-else-if="mapLoadState === 'error'" class="venue-page__hint">{{ mapErrorMessage }}</p>
    <div
      v-else
      class="venue-page__map"
      :class="{ 'venue-page__map--loading': mapLoadState === 'loading' }"
      aria-label="Venue map"
    >
      <div ref="mapContainer" class="venue-page__map-inner" />
      <aside class="venue-page__card" :key="locale.lang" aria-label="Venue details">
        <h1 class="venue-page__card-title">{{ venueCard.title }}</h1>
        <p class="venue-page__card-subtitle">{{ venueCard.subtitle }}</p>
        <address class="venue-page__card-address">
          <span
            v-for="(line, idx) in venueCard.addressLines"
            :key="idx"
            class="venue-page__card-line"
          >
            {{ line }}
          </span>
        </address>
        <a
          class="venue-page__card-link"
          :href="venueDirectionsUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="venue-page__split" :style="directionsSplitStyle">
            <span class="venue-page__split-ghost">{{ venueCard.directionsLabel }}</span>
            <span
              class="venue-page__split-half venue-page__split-half--top"
              aria-hidden="true"
            >
              {{ venueCard.directionsLabel }}
            </span>
            <span
              class="venue-page__split-half venue-page__split-half--bottom"
              aria-hidden="true"
            >
              {{ venueCard.directionsLabel }}
            </span>
          </span>
        </a>
      </aside>
    </div>
  </main>
</template>

<script>
import { setOptions, importLibrary } from '@googlemaps/js-api-loader'
import {
  defaultVenueCenter,
  defaultVenueZoom,
  venueDirectionsUrl,
  venueGrayscaleMapStyles,
  venuePlaceInfo,
} from '@/assets/data/venueMap.js'
import { localeStore } from '@/store/locale.js'

function parseEnvNumber(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function textSeedHash(s) {
  return s.split('').reduce((a, c) => ((Math.imul(a, 31) + c.charCodeAt(0)) | 0) >>> 0, 5381) >>> 0
}

export default {
  name: 'Venue',
  data() {
    return {
      locale: localeStore,
      mapLoadState: 'idle',
      mapInstance: null,
      _onMapResize: null,
    }
  },
  computed: {
    venueCenter() {
      const lat = parseEnvNumber(import.meta.env.VITE_VENUE_MAP_LAT)
      const lng = parseEnvNumber(import.meta.env.VITE_VENUE_MAP_LNG)
      return lat != null && lng != null ? { lat, lng } : defaultVenueCenter
    },
    venueZoom() {
      const zoom = parseEnvNumber(import.meta.env.VITE_VENUE_MAP_ZOOM)
      return zoom != null ? zoom : defaultVenueZoom
    },
    venueCard() {
      return venuePlaceInfo[this.locale.lang] || venuePlaceInfo.en
    },
    venueDirectionsUrl() {
      return venueDirectionsUrl
    },
    directionsSplitStyle() {
      const key = textSeedHash(`${this.venueCard.directionsLabel}\0venue-directions`)
      const u = (n) => {
        let h = Math.imul((key + n) ^ 0x9e3779b9, 0x9e3779b9) >>> 0
        h = (h ^ (h >>> 16)) >>> 0
        h = Math.imul(h, 2246822507) >>> 0
        return h / 4294967296
      }
      const invert = u(101) >= 0.5
      const scale = this.locale.lang === 'kr' ? 1 : 0.56
      const base = (0.95 + u(7) * 1.15) * scale
      return {
        '--venue-split-shift-top': `${((invert ? 1 : -1) * base).toFixed(2)}px`,
        '--venue-split-shift-bottom': `${((invert ? -1 : 1) * base * (0.88 + u(13) * 0.3)).toFixed(2)}px`,
      }
    },
    mapNoKeyMessage() {
      return this.locale.lang === 'kr'
        ? '구글맵을 표시하려면 VITE_GOOGLE_MAPS_API_KEY가 필요합니다.'
        : 'VITE_GOOGLE_MAPS_API_KEY is required to display Google Maps.'
    },
    mapErrorMessage() {
      return this.locale.lang === 'kr'
        ? '지도를 불러오지 못했습니다.'
        : 'The map could not be loaded.'
    },
  },
  mounted() {
    this.initMap()
  },
  beforeUnmount() {
    if (this._onMapResize) {
      window.removeEventListener('resize', this._onMapResize)
      this._onMapResize = null
    }
    this.mapInstance = null
  },
  methods: {
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
          fullscreenControl: false,
          zoomControl: true,
        })

        new google.maps.Marker({
          map,
          position: center,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: 'red',
            fillOpacity: 1,
            strokeColor: 'black',
            strokeWeight: 2,
          },
        })

        this.mapInstance = map
        this.mapLoadState = 'ready'
        this._onMapResize = () => google.maps.event.trigger(map, 'resize')
        window.addEventListener('resize', this._onMapResize)
      } catch (error) {
        console.error(error)
        this.mapLoadState = 'error'
      }
    },
  },
}
</script>

<style scoped>
.venue-page {
  width: 100%;
  min-height: calc(var(--app-vh, 1vh) * 100);
  background: transparent;
}

.venue-page__map {
  position: relative;
  width: 100%;
  min-height: calc(var(--app-vh, 1vh) * 100);
  overflow: hidden;
  background: #fff;
}

.venue-page__map-inner {
  width: 100%;
  min-height: calc(var(--app-vh, 1vh) * 100);
  filter: grayscale(1) contrast(1.42) brightness(0.96) blur(0.16px);
}

.venue-page__map::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.028) 0,
      rgba(0, 0, 0, 0.028) 1px,
      rgba(255, 255, 255, 0.08) 1px,
      rgba(255, 255, 255, 0.08) 3px
    ),
    radial-gradient(circle at 18% 22%, rgba(0, 0, 0, 0.045) 0 0.7px, transparent 0.8px),
    radial-gradient(circle at 71% 62%, rgba(0, 0, 0, 0.035) 0 0.6px, transparent 0.7px),
    linear-gradient(180deg, rgba(255, 255, 255, 0.18), transparent 35%, rgba(0, 0, 0, 0.035));
  background-size:
    100% 3px,
    7px 7px,
    11px 11px,
    100% 100%;
  mix-blend-mode: multiply;
  opacity: 0.78;
}

.venue-page__card {
  position: absolute;
  left: clamp(20px, 5vw, 72px);
  bottom: clamp(20px, 5vw, 72px);
  z-index: 2;
  box-sizing: border-box;
  width: min(82vw, 22rem);
  padding: 1rem 1.1rem 1.05rem;
  border: 1px solid rgba(10, 10, 10, 0.82);
  background: rgba(255, 255, 255, 0.92);
  color: rgba(10, 10, 10, 0.82);
  font-size: 1rem;
  line-height: 1.42;
  text-align: left;
  filter: blur(0.16px) contrast(1.08);
}

.venue-page--en .venue-page__card {
  font-family: var(--font-home-en);
  font-weight: var(--font-home-en-weight);
}

.venue-page--ko .venue-page__card {
  font-family: var(--font-home-ko);
  font-weight: var(--font-home-ko-weight);
}

.venue-page__card-title,
.venue-page__card-subtitle,
.venue-page__card-address {
  margin: 0;
}

.venue-page__card-title {
  font-size: 1rem;
  font-weight: inherit;
}

.venue-page__card-subtitle {
  margin-top: 0.18rem;
}

.venue-page__card-address {
  margin-top: 0.75rem;
  font-style: normal;
}

.venue-page__card-line {
  display: block;
}

.venue-page__card-link {
  display: inline-block;
  margin-top: 0.9rem;
  color: inherit;
  text-decoration: none;
}

.venue-page__card-link:hover,
.venue-page__card-link:focus-visible {
  outline: none;
}

.venue-page__split {
  position: relative;
  display: inline-block;
  vertical-align: baseline;
}

.venue-page__split::after {
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

.venue-page__split-ghost {
  opacity: 0;
  pointer-events: none;
  user-select: none;
  transition: opacity 0.35s cubic-bezier(0.45, 0, 0.2, 1);
}

.venue-page__split-half {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  user-select: none;
  transition: opacity 0.35s cubic-bezier(0.45, 0, 0.2, 1);
}

.venue-page__split-half--top {
  clip-path: inset(0 0 50% 0);
  transform: translateX(var(--venue-split-shift-top, -1.5px));
}

.venue-page__split-half--bottom {
  clip-path: inset(50% 0 0 0);
  transform: translateX(var(--venue-split-shift-bottom, 1.5px));
}

.venue-page__card-link:hover .venue-page__split-ghost,
.venue-page__card-link:focus-visible .venue-page__split-ghost {
  opacity: 1;
}

.venue-page__card-link:hover .venue-page__split-half,
.venue-page__card-link:focus-visible .venue-page__split-half {
  opacity: 0;
}

.venue-page__card-link:hover .venue-page__split::after,
.venue-page__card-link:focus-visible .venue-page__split::after {
  opacity: 1;
}

.venue-page__map--loading {
  opacity: 0.72;
}

.venue-page__hint {
  min-height: calc(var(--app-vh, 1vh) * 100);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(24px, 6vw, 48px);
  color: rgba(10, 10, 10, 0.82);
  text-align: center;
  font-family: var(--font-home-en);
  font-size: 1rem;
  font-weight: var(--font-home-en-weight);
  line-height: 1.65;
}
</style>
