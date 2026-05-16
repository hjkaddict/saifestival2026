<template>
  <article
    v-if="currentArtist"
    class="artist-detail app-min-vh"
    :class="{ 'artist-detail--bio-expanded': bioExpanded }"
  >
    <div
      class="artist-detail__media"
      :class="{ 'artist-detail__media--transitioning': detailTransitioning }"
    >
      <figure class="artist-detail__figure">
        <div class="artist-detail__image-split" :style="imageSplitStyle(detailArtist)">
          <img
            class="artist-detail__image artist-detail__image--base"
            :src="detailArtist.img"
            :alt="artistDisplayName(detailArtist)"
            :style="detailImageStyle(detailArtist)"
            decoding="sync"
            fetchpriority="high"
          />
          <img
            class="artist-detail__image artist-detail__image-layer artist-detail__image-layer--top"
            :src="detailArtist.img"
            alt=""
            aria-hidden="true"
            :style="detailImageStyle(detailArtist)"
            decoding="sync"
          />
          <img
            class="artist-detail__image artist-detail__image-layer artist-detail__image-layer--bottom"
            :src="detailArtist.img"
            alt=""
            aria-hidden="true"
            :style="detailImageStyle(detailArtist)"
            decoding="sync"
          />
        </div>
      </figure>
      <div class="artist-detail__text">
        <h1 class="artist-detail__title" :aria-label="artistTitleLabel(detailArtist)">
          <span class="home-text__split" :style="splitRandomStyleForArtist(detailArtist)">
            <span class="home-text__split-ghost">
              <span v-if="locale.lang === 'kr'" class="home-text__ko">{{
                artistDisplayNameKr(detailArtist)
              }}</span>
              <span v-else class="home-text__en">{{ detailArtist.name_en }}</span>
              <span class="artists-list__cc">({{ detailArtist.nationality }})</span>
            </span>
            <span class="home-text__split-half home-text__split-half--top" aria-hidden="true">
              <span v-if="locale.lang === 'kr'" class="home-text__ko">{{
                artistDisplayNameKr(detailArtist)
              }}</span>
              <span v-else class="home-text__en">{{ detailArtist.name_en }}</span>
              <span class="artists-list__cc">({{ detailArtist.nationality }})</span>
            </span>
            <span class="home-text__split-half home-text__split-half--bottom" aria-hidden="true">
              <span v-if="locale.lang === 'kr'" class="home-text__ko">{{
                artistDisplayNameKr(detailArtist)
              }}</span>
              <span v-else class="home-text__en">{{ detailArtist.name_en }}</span>
              <span class="artists-list__cc">({{ detailArtist.nationality }})</span>
            </span>
          </span>
        </h1>
        <section
          v-if="activeBio"
          class="artist-detail__bio"
          :class="locale.lang === 'kr' ? 'artist-detail__bio--ko' : 'artist-detail__bio--en'"
        >
          <span class="artist-detail__bio-text">{{ displayedBio }}</span>
          <button
            v-if="isBioCollapsed"
            type="button"
            class="artist-detail__more"
            @click.stop="bioExpanded = true"
          >
            <span class="home-text__split" :style="moreSplitStyle()">
              <span class="home-text__split-ghost">
                <span class="home-text__en">more</span>
              </span>
              <span class="home-text__split-half home-text__split-half--top" aria-hidden="true">
                <span class="home-text__en">more</span>
              </span>
              <span class="home-text__split-half home-text__split-half--bottom" aria-hidden="true">
                <span class="home-text__en">more</span>
              </span>
            </span>
          </button>
          <a
            v-if="detailArtist.website"
            class="artist-detail__website"
            :href="detailArtist.website"
            target="_blank"
            rel="noopener noreferrer"
            @click.stop
          >
            <span class="home-text__split" :style="websiteSplitStyle()">
              <span class="home-text__split-ghost">
                <span class="home-text__en">{{ websiteLabel }}</span>
              </span>
              <span class="home-text__split-half home-text__split-half--top" aria-hidden="true">
                <span class="home-text__en">{{ websiteLabel }}</span>
              </span>
              <span class="home-text__split-half home-text__split-half--bottom" aria-hidden="true">
                <span class="home-text__en">{{ websiteLabel }}</span>
              </span>
            </span>
          </a>
        </section>
      </div>
      <div
        v-if="lineupVisible"
        class="artist-detail__lineup home-text"
        :class="{ 'artist-detail__lineup--closing': lineupClosing }"
        aria-label="Artists lineup"
        @click.self="closeLineup"
      >
        <p class="home-text__menu" @click.stop>
          <template v-for="(artist, idx) in artists" :key="artist.id">
            <span
              v-if="isCurrentArtist(artist)"
              class="home-text__current-artist"
              :aria-current="'page'"
            >
              <span v-if="locale.lang === 'kr'" class="home-text__ko">{{
                artistDisplayNameKr(artist)
              }}</span>
              <span v-else class="home-text__en">{{ artist.name_en }}</span>
              <span class="artists-list__cc">({{ artist.nationality }})</span>
            </span>
            <router-link
              v-else
              :to="artistPath(artist)"
              class="home-text__link"
              data-mobile-delay="skip"
              @click.prevent="goToArtistFromLineup(artist)"
            >
              <span class="home-text__split" :style="splitRandomStyleForArtist(artist)">
                <span class="home-text__split-ghost">
                  <span v-if="locale.lang === 'kr'" class="home-text__ko">{{
                    artistDisplayNameKr(artist)
                  }}</span>
                  <span v-else class="home-text__en">{{ artist.name_en }}</span>
                  <span class="artists-list__cc">({{ artist.nationality }})</span>
                </span>
                <span class="home-text__split-half home-text__split-half--top" aria-hidden="true">
                  <span v-if="locale.lang === 'kr'" class="home-text__ko">{{
                    artistDisplayNameKr(artist)
                  }}</span>
                  <span v-else class="home-text__en">{{ artist.name_en }}</span>
                  <span class="artists-list__cc">({{ artist.nationality }})</span>
                </span>
                <span
                  class="home-text__split-half home-text__split-half--bottom"
                  aria-hidden="true"
                >
                  <span v-if="locale.lang === 'kr'" class="home-text__ko">{{
                    artistDisplayNameKr(artist)
                  }}</span>
                  <span v-else class="home-text__en">{{ artist.name_en }}</span>
                  <span class="artists-list__cc">({{ artist.nationality }})</span>
                </span>
              </span>
            </router-link>
            <span v-if="idx < artists.length - 1" class="home-text__sep"> · </span>
          </template>
        </p>
      </div>
    </div>
  </article>

  <div v-else class="home-text">
    <p class="home-text__menu" aria-label="Artists">
      <template v-for="(artist, idx) in artists" :key="artist.id">
        <router-link
          :to="artistPath(artist)"
          class="home-text__link"
          :aria-current="id === artistSlug(artist) ? 'page' : undefined"
        >
          <span class="home-text__split" :style="splitRandomStyleForArtist(artist)">
            <span class="home-text__split-ghost">
              <span v-if="locale.lang === 'kr'" class="home-text__ko">{{
                artistDisplayNameKr(artist)
              }}</span>
              <span v-else class="home-text__en">{{ artist.name_en }}</span>
              <span class="artists-list__cc">({{ artist.nationality }})</span>
            </span>
            <span class="home-text__split-half home-text__split-half--top" aria-hidden="true">
              <span v-if="locale.lang === 'kr'" class="home-text__ko">{{
                artistDisplayNameKr(artist)
              }}</span>
              <span v-else class="home-text__en">{{ artist.name_en }}</span>
              <span class="artists-list__cc">({{ artist.nationality }})</span>
            </span>
            <span class="home-text__split-half home-text__split-half--bottom" aria-hidden="true">
              <span v-if="locale.lang === 'kr'" class="home-text__ko">{{
                artistDisplayNameKr(artist)
              }}</span>
              <span v-else class="home-text__en">{{ artist.name_en }}</span>
              <span class="artists-list__cc">({{ artist.nationality }})</span>
            </span>
          </span>
        </router-link>
        <span v-if="idx < artists.length - 1" class="home-text__sep"> · </span>
      </template>
    </p>
  </div>
</template>

<script>
import { artistsData } from '@/assets/data/artists.js'
import { localeStore } from '@/store/locale.js'

/** 영문 이름·코드: 갈라짐 약하게 (한글 UI일 때는 1) */
const ARTISTS_SPLIT_SCALE_LATIN = 0.56

function artistSeedHash(s) {
  return s.split('').reduce((a, c) => ((Math.imul(a, 31) + c.charCodeAt(0)) | 0) >>> 0, 5381) >>> 0
}

export default {
  name: 'Artists',
  props: {
    id: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      artists: artistsData,
      locale: localeStore,
      bioExpanded: false,
      lineupVisible: false,
      lineupClosing: false,
      displayedArtist: null,
      detailTransitioning: false,
      _artistTransitionToken: 0,
      _lineupNavigationPending: false,
      imageSplitNonce: Math.floor(Math.random() * 1000000000),
    }
  },
  mounted() {
    document.addEventListener('click', this.closeExpandedBio)
    window.addEventListener('artists-lineup-toggle', this.toggleLineup)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeExpandedBio)
    window.removeEventListener('artists-lineup-toggle', this.toggleLineup)
  },
  computed: {
    currentArtist() {
      if (!this.id) return null
      return this.artists.find((artist) => this.artistSlug(artist) === this.id) || null
    },
    detailArtist() {
      return this.displayedArtist || this.currentArtist
    },
    activeBio() {
      if (!this.detailArtist) return ''
      const localized = this.locale.lang === 'kr' ? this.detailArtist.bio_kr : this.detailArtist.bio_en
      const fallback = this.detailArtist.bio_en || this.detailArtist.bio_kr || ''
      return (localized && localized.trim() ? localized : fallback).trim()
    },
    isBioLong() {
      return this.activeBio.length > 200
    },
    isBioCollapsed() {
      return this.isBioLong && !this.bioExpanded
    },
    displayedBio() {
      if (!this.isBioCollapsed) return this.activeBio
      return this.truncateBio(this.activeBio, 200)
    },
    websiteLabel() {
      return this.detailArtist?.website || ''
    },
  },
  watch: {
    currentArtist: {
      immediate: true,
      handler(newArtist, oldArtist) {
        this.transitionToArtist(newArtist, oldArtist)
      },
    },
    id() {
      this.bioExpanded = false
      if (!this._lineupNavigationPending) {
        this.lineupVisible = false
        this.lineupClosing = false
      }
    },
    lineupVisible(open) {
      window.dispatchEvent(new CustomEvent('artists-lineup-state', { detail: { open } }))
    },
    'locale.lang'() {
      this.bioExpanded = false
    },
  },
  methods: {
    artistDisplayNameKr(artist) {
      const k = artist.name_kr
      return typeof k === 'string' && k.trim() !== '' ? k : artist.name_en
    },
    artistDisplayName(artist) {
      return this.locale.lang === 'kr' ? this.artistDisplayNameKr(artist) : artist.name_en
    },
    artistTitleLabel(artist) {
      return `${this.artistDisplayName(artist)} (${artist.nationality})`
    },
    artistSlug(artistOrName) {
      if (artistOrName && typeof artistOrName === 'object' && artistOrName.slug) {
        return artistOrName.slug
      }
      const nameEn = typeof artistOrName === 'string' ? artistOrName : artistOrName?.name_en || ''
      return nameEn.toLowerCase().trim().replace(/\s+/g, '-')
    },
    artistPath(artist) {
      return `/artists/${this.artistSlug(artist)}`
    },
    isCurrentArtist(artist) {
      return this.currentArtist && this.artistSlug(artist) === this.artistSlug(this.currentArtist)
    },
    setLineupVisible(open) {
      this.lineupVisible = open
      if (open) {
        this.lineupClosing = false
      }
    },
    toggleLineup() {
      if (this.currentArtist) {
        if (this.lineupVisible) {
          this.closeLineup()
        } else {
          this.setLineupVisible(true)
        }
      }
    },
    async closeLineup() {
      if (!this.lineupVisible || this.lineupClosing) return
      this.lineupClosing = true
      await this.delay(280)
      this.setLineupVisible(false)
      this.lineupClosing = false
    },
    async goToArtistFromLineup(artist) {
      if (this.lineupClosing) return
      const path = this.artistPath(artist)
      this._lineupNavigationPending = true
      await this.preloadImage(artist.img)
      this.displayedArtist = artist
      this.imageSplitNonce = Math.floor(Math.random() * 1000000000)
      await this.$nextTick()
      await this.waitForPaint()
      if (this.$route.path !== path) {
        await this.$router.push(path)
      }
      await this.$nextTick()
      await this.waitForPaint()
      await this.closeLineup()
      this._lineupNavigationPending = false
    },
    detailImageStyle(artist) {
      return artist.objectPosition ? { objectPosition: artist.objectPosition } : {}
    },
    truncateBio(text, limit) {
      const normalized = text.trim()
      if (normalized.length <= limit) return normalized
      const sliced = normalized.slice(0, limit).trimEnd()
      const boundary = Math.max(sliced.lastIndexOf(' '), sliced.lastIndexOf('\n'), sliced.lastIndexOf('\t'))
      if (boundary <= 0) return `${sliced}...`
      return `${sliced.slice(0, boundary).trimEnd()}...`
    },
    imageSplitStyle(artist) {
      const key = artistSeedHash(`${artist.id}\0image\0${this.imageSplitNonce}`)
      const u = (n) => {
        let h = Math.imul((key + n) ^ 0x9e3779b9, 0x9e3779b9) >>> 0
        h = (h ^ (h >>> 16)) >>> 0
        h = Math.imul(h, 2246822507) >>> 0
        return h / 4294967296
      }
      const invert = u(101) >= 0.5
      const base = 9 + u(7) * 18
      const signTop = invert ? 1 : -1
      const signBottom = invert ? -1 : 1
      const centerY = 35 + u(41) * 30
      const angle = 16 + u(43) * 30
      const slopeSign = u(47) >= 0.5 ? 1 : -1
      const leftY = Math.max(12, Math.min(88, centerY - slopeSign * angle * 0.5))
      const rightY = Math.max(12, Math.min(88, centerY + slopeSign * angle * 0.5))
      return {
        '--artist-image-shift-top': `${(signTop * base * (0.85 + u(13) * 0.35)).toFixed(2)}px`,
        '--artist-image-shift-bottom': `${(signBottom * base * (0.85 + u(29) * 0.35)).toFixed(2)}px`,
        '--artist-image-split-left': `${leftY.toFixed(2)}%`,
        '--artist-image-split-right': `${rightY.toFixed(2)}%`,
        '--artist-image-gap': `${(0.9 + u(67) * 1.1).toFixed(2)}%`,
        '--artist-image-base-opacity': `${(0.32 + u(53) * 0.18).toFixed(2)}`,
      }
    },
    splitShiftVars(seedStr, scale) {
      const key = artistSeedHash(seedStr)
      const u = (n) => {
        let h = Math.imul((key + n) ^ 0x9e3779b9, 0x9e3779b9) >>> 0
        h = (h ^ (h >>> 16)) >>> 0
        h = Math.imul(h, 2246822507) >>> 0
        return h / 4294967296
      }
      const invert = u(101) >= 0.5
      const base = 0.95 + u(7) * 1.15
      const topJitter = 0.88 + u(13) * 0.3
      const botJitter = 0.88 + u(29) * 0.3
      const signTop = invert ? 1 : -1
      const signBot = invert ? -1 : 1
      const topPx = signTop * base * topJitter * scale
      const botPx = signBot * base * botJitter * scale
      return {
        '--home-split-shift-top': `${topPx.toFixed(2)}px`,
        '--home-split-shift-bottom': `${botPx.toFixed(2)}px`,
      }
    },
    splitRandomStyleForArtist(artist) {
      const kr = this.locale.lang === 'kr'
      const scale = kr ? 1 : ARTISTS_SPLIT_SCALE_LATIN
      const seed = kr ? `${artist.id}\0ko` : `${artist.id}\0lat`
      return this.splitShiftVars(seed, scale)
    },
    moreSplitStyle() {
      return this.splitShiftVars(`${this.detailArtist?.id || 'artist'}\0more`, ARTISTS_SPLIT_SCALE_LATIN)
    },
    websiteSplitStyle() {
      return this.splitShiftVars(`${this.detailArtist?.id || 'artist'}\0website`, ARTISTS_SPLIT_SCALE_LATIN)
    },
    preloadImage(src) {
      if (!src || typeof window === 'undefined') return Promise.resolve()
      return new Promise((resolve) => {
        const img = new Image()
        img.decoding = 'sync'
        img.onload = async () => {
          try {
            if (typeof img.decode === 'function') {
              await img.decode()
            }
          } catch {
            /* The load event is enough if decode rejects for a cached image. */
          }
          resolve()
        }
        img.onerror = resolve
        img.src = src
        if (img.complete) {
          img.onload()
        }
      })
    },
    waitForPaint() {
      return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    },
    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    },
    async transitionToArtist(newArtist, oldArtist) {
      const token = ++this._artistTransitionToken
      if (!newArtist) {
        this.displayedArtist = null
        this.detailTransitioning = false
        return
      }
      if (!oldArtist || !this.displayedArtist) {
        this.displayedArtist = newArtist
        this.detailTransitioning = false
        return
      }
      if (this.artistSlug(newArtist) === this.artistSlug(this.displayedArtist)) {
        this.detailTransitioning = false
        return
      }

      this.detailTransitioning = true
      await Promise.all([this.preloadImage(newArtist.img), this.delay(160)])
      if (token !== this._artistTransitionToken) return

      this.displayedArtist = newArtist
      this.imageSplitNonce = Math.floor(Math.random() * 1000000000)
      await this.$nextTick()
      requestAnimationFrame(() => {
        if (token === this._artistTransitionToken) {
          this.detailTransitioning = false
        }
      })
    },
    closeExpandedBio() {
      if (this.bioExpanded) {
        this.bioExpanded = false
      }
    },
  },
}
</script>

<style scoped>
.artist-detail {
  --artist-detail-x: clamp(20px, 6vw, 72px);
  box-sizing: border-box;
  padding: clamp(52px, 7vw, 84px) var(--artist-detail-x) clamp(56px, 8vw, 96px);
  background: #fff;
  color: #0a0a0a;
}

.artist-detail__title {
  display: inline;
  margin: 0 0.55em 0 0;
  background: #fff;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
  padding: 0 0.12em;
  color: #0a0a0a;
  font-size: 1rem;
  font-weight: inherit;
  line-height: 1.65;
  text-align: left;
}

.artist-detail__media {
  position: relative;
  width: 100%;
  margin: 0 auto;
}

.artist-detail__figure {
  margin: 0 auto;
  width: fit-content;
  max-width: 100%;
  transition: opacity 0.22s ease;
}

.artist-detail__image-split {
  position: relative;
  display: block;
  width: fit-content;
  max-width: 100%;
  line-height: 0;
  background: #fff;
  filter: contrast(1.1) brightness(1.03) saturate(0.9) blur(0.16px);
}

.artist-detail__image-split::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  background-image:
    repeating-linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.08) 0,
      rgba(255, 255, 255, 0.08) 1px,
      transparent 1px,
      transparent 3px
    ),
    radial-gradient(circle at 22% 31%, rgba(0, 0, 0, 0.06) 0 0.7px, transparent 0.8px),
    radial-gradient(circle at 71% 64%, rgba(0, 0, 0, 0.05) 0 0.6px, transparent 0.7px);
  background-size:
    100% 3px,
    7px 7px,
    9px 9px;
  mix-blend-mode: multiply;
  opacity: 0.45;
}

.artist-detail__image {
  display: block;
  width: auto;
  max-width: 100%;
  height: min(72vh, 760px);
  object-fit: contain;
  object-position: center;
}

.artist-detail__image--base {
  opacity: var(--artist-image-base-opacity, 0.42);
}

.artist-detail__image-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: none;
}

.artist-detail__image-layer--top {
  clip-path: polygon(
    0 0,
    100% 0,
    100% calc(var(--artist-image-split-right, 50%) - var(--artist-image-gap, 3%)),
    0 calc(var(--artist-image-split-left, 50%) - var(--artist-image-gap, 3%))
  );
  transform: translateX(var(--artist-image-shift-top, -14px));
}

.artist-detail__image-layer--bottom {
  clip-path: polygon(
    0 calc(var(--artist-image-split-left, 50%) + var(--artist-image-gap, 3%)),
    100% calc(var(--artist-image-split-right, 50%) + var(--artist-image-gap, 3%)),
    100% 100%,
    0 100%
  );
  transform: translateX(var(--artist-image-shift-bottom, 14px));
}

.artist-detail__text {
  position: absolute;
  z-index: 2;
  bottom: 0;
  left: max(calc(-1 * var(--artist-detail-x) + 12vw), 36px);
  width: min(72vw, 980px);
  margin: 0;
  text-align: left;
  transition: opacity 0.22s ease;
}

.artist-detail__media--transitioning .artist-detail__figure,
.artist-detail__media--transitioning .artist-detail__text {
  opacity: 0;
}

.artist-detail__lineup {
  position: fixed;
  inset: 0;
  z-index: 4;
  background: #fff;
}

.artist-detail__lineup--closing {
  pointer-events: none;
}

.artist-detail__lineup .home-text__menu {
  opacity: 1;
  transition: opacity 0.28s ease;
}

.artist-detail__lineup--closing .home-text__menu {
  opacity: 0;
}

.artist-detail__bio {
  display: inline;
  margin: 0;
  color: rgba(10, 10, 10, 0.82);
  font-size: 1rem;
  line-height: 1.42;
  letter-spacing: 0.006em;
  text-align: left;
  white-space: pre-line;
  word-break: keep-all;
  overflow-wrap: break-word;
  filter: blur(0.22px) contrast(1.08);
  -webkit-font-smoothing: subpixel-antialiased;
  text-shadow:
    0 0 0.7px rgba(10, 10, 10, 0.42),
    0.42px 0.24px 0 rgba(10, 10, 10, 0.2),
    -0.28px -0.12px 0 rgba(10, 10, 10, 0.12);
}

.artist-detail__bio-text {
  background: #fff;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
  padding: 0 0.12em;
  white-space: pre-line;
}

.artist-detail__more {
  display: inline-block;
  margin-left: 0.35em;
  padding: 0;
  border: 0;
  background: #fff;
  color: inherit;
  cursor: pointer;
  font: inherit;
  font-size: 0.72em;
  vertical-align: baseline;
}

.artist-detail__more .home-text__en {
  font-family: var(--font-home-en);
  font-weight: var(--font-home-en-weight);
  letter-spacing: 0.055em;
}

.artist-detail__more:hover .home-text__split-ghost,
.artist-detail__more:focus-visible .home-text__split-ghost {
  opacity: 1;
}

.artist-detail__more:hover .home-text__split-half,
.artist-detail__more:focus-visible .home-text__split-half {
  opacity: 0;
}

.artist-detail__more:hover .home-text__split::after,
.artist-detail__more:focus-visible .home-text__split::after {
  opacity: 1;
}

.artist-detail__more:focus-visible {
  outline: 1px solid currentColor;
  outline-offset: 0.15em;
}

.artist-detail__website {
  display: block;
  width: fit-content;
  margin: 0.45rem 0 0;
  padding: 0 0.18em 0.02em;
  background: rgb(0, 0, 255);
  color: #fff;
  font-size: 0.82em;
  text-decoration: none;
}

.artist-detail__website .home-text__en {
  font-family: var(--font-home-en);
  font-weight: var(--font-home-en-weight);
  letter-spacing: 0.055em;
}

.artist-detail__website:hover .home-text__split-ghost,
.artist-detail__website:focus-visible .home-text__split-ghost {
  opacity: 1;
}

.artist-detail__website:hover .home-text__split-half,
.artist-detail__website:focus-visible .home-text__split-half {
  opacity: 0;
}

.artist-detail__website:hover .home-text__split::after,
.artist-detail__website:focus-visible .home-text__split::after {
  opacity: 1;
}

.artist-detail__website:focus-visible {
  outline: 1px solid rgb(0, 0, 255);
  outline-offset: 0.15em;
}

.artist-detail__bio--en {
  font-family: var(--font-home-en);
  font-weight: 100;
}

.artist-detail__bio--ko {
  font-family: var(--font-home-ko);
  font-weight: 100;
}

@media (max-width: 768px) {
  .artist-detail {
    --artist-detail-x: 20px;
    padding: 72px var(--artist-detail-x) 48px;
  }

  .artist-detail__title {
    margin: 0 0.55em 0 0;
    text-align: left;
  }

  .artist-detail__media {
    display: flex;
    flex-direction: column;
  }

  .artist-detail__figure {
    order: 1;
    width: 100%;
    margin: 0 auto;
  }

  .artist-detail__image-split {
    margin: 0 auto;
  }

  .artist-detail__image {
    width: 100%;
    max-width: 100%;
    height: auto;
  }

  .artist-detail__text {
    position: static;
    order: 2;
    width: 100%;
    margin: 18px 0 0;
  }

  .artist-detail__bio {
    display: inline;
  }

  .artist-detail--bio-expanded .artist-detail__media {
    position: relative;
  }

  .artist-detail--bio-expanded .artist-detail__text {
    position: absolute;
    z-index: 3;
    top: 0;
    left: 0;
    width: 100%;
    margin: 0;
  }
}

.home-text {
  --home-split-merge-duration: 0.35s;
  --home-split-merge-easing: cubic-bezier(0.45, 0, 0.2, 1);
  min-height: calc(var(--app-vh, 1vh) * 100);
  box-sizing: border-box;
  padding: clamp(24px, 6vw, 48px);
  background: #fff;
  color: #0a0a0a;
  font-size: 1rem;
  line-height: 1.65;
  word-break: keep-all;
  overflow-wrap: break-word;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.home-text__menu {
  margin: 0;
  text-align: center;
  font-family: var(--font-home-en);
  font-weight: var(--font-home-en-weight);
}

.artist-detail__title,
.artist-detail__bio,
.home-text__menu {
  color: rgba(10, 10, 10, 0.82);
  filter: blur(0.22px) contrast(1.08);
  -webkit-font-smoothing: subpixel-antialiased;
  text-shadow:
    0 0 0.7px rgba(10, 10, 10, 0.42),
    0.42px 0.24px 0 rgba(10, 10, 10, 0.2),
    -0.28px -0.12px 0 rgba(10, 10, 10, 0.12);
}

@media (max-width: 768px), (hover: none), (pointer: coarse) {
  .artist-detail__title,
  .artist-detail__bio,
  .home-text__menu {
    filter: blur(0.13px) contrast(1.05);
    text-shadow:
      0 0 0.35px rgba(10, 10, 10, 0.28),
      0.2px 0.12px 0 rgba(10, 10, 10, 0.12);
  }
}

.home-text__sep {
  user-select: none;
  font-size: 1.14em;
  vertical-align: 0.02em;
}

.home-text__split {
  position: relative;
  display: inline-block;
  vertical-align: baseline;
}

.home-text__split::after {
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
  transition: opacity var(--home-split-merge-duration) var(--home-split-merge-easing);
}

.home-text__split-ghost {
  opacity: 0;
  pointer-events: none;
  user-select: none;
  transition: opacity var(--home-split-merge-duration) var(--home-split-merge-easing);
}

.home-text__split-half {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  user-select: none;
  transition: opacity var(--home-split-merge-duration) var(--home-split-merge-easing);
}

.home-text__split-half--top {
  clip-path: inset(0 0 50% 0);
  transform: translateX(var(--home-split-shift-top, -1.5px));
}

.home-text__split-half--bottom {
  clip-path: inset(50% 0 0 0);
  transform: translateX(var(--home-split-shift-bottom, 1.5px));
}

@media (prefers-reduced-motion: reduce) {
  .home-text__split-ghost,
  .home-text__split-half {
    transition: none;
  }

  .home-text__en,
  .home-text__ko,
  .home-text__gap,
  .artists-list__cc {
    transition: none;
  }

  .home-text__split-ghost {
    opacity: 1;
  }

  .home-text__split-half {
    display: none;
  }
}

.home-text__en {
  font-family: var(--font-home-en);
  font-weight: var(--font-home-en-weight);
  letter-spacing: 0.055em;
  transition: text-shadow var(--home-split-merge-duration) var(--home-split-merge-easing);
}

.home-text__ko {
  font-family: var(--font-home-ko);
  font-weight: var(--font-home-ko-weight);
  transition: text-shadow var(--home-split-merge-duration) var(--home-split-merge-easing);
}

.home-text__gap {
  display: inline-block;
  font-family: var(--font-home-en);
  margin: 0 0.2em;
  white-space: pre;
  transition: text-shadow var(--home-split-merge-duration) var(--home-split-merge-easing);
}

/* 국가코드: 영문 산세리프, 한 줄에서 살짝 작게 */
.artists-list__cc {
  font-family: var(--font-home-en);
  font-weight: var(--font-home-en-weight);
  font-size: 0.72em;
  letter-spacing: 0.06em;
  font-variant-caps: all-small-caps;
  vertical-align: 0.06em;
  transition: text-shadow var(--home-split-merge-duration) var(--home-split-merge-easing);
}

.home-text__link {
  display: inline-block;
  color: inherit;
  text-decoration: none;
}

.home-text__current-artist {
  display: inline-block;
  text-decoration: line-through;
  text-decoration-thickness: 0.08em;
  text-decoration-color: currentColor;
  text-underline-offset: 0.12em;
}

.home-text__link:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 0.2em;
  border-radius: 2px;
}

.home-text__link:hover .home-text__en,
.home-text__link:focus-visible .home-text__en,
.home-text__link:hover .home-text__gap,
.home-text__link:focus-visible .home-text__gap,
.home-text__link:hover .artists-list__cc,
.home-text__link:focus-visible .artists-list__cc {
  text-shadow:
    0.016em 0 0 currentColor,
    -0.016em 0 0 currentColor;
}

.home-text__link:hover .home-text__ko,
.home-text__link:focus-visible .home-text__ko {
  text-shadow:
    0.012em 0 0 currentColor,
    -0.012em 0 0 currentColor;
}

.home-text__link:hover .home-text__split-ghost,
.home-text__link:focus-visible .home-text__split-ghost {
  opacity: 1;
}

.home-text__link:hover .home-text__split-half,
.home-text__link:focus-visible .home-text__split-half {
  opacity: 0;
}

.home-text__link:hover .home-text__split::after,
.home-text__link:focus-visible .home-text__split::after {
  opacity: 1;
}
</style>
