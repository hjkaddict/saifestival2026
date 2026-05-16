<template>
  <div class="home-text">
    <p class="home-text__menu" aria-label="Artists">
      <template v-for="(artist, idx) in artists" :key="artist.id">
        <router-link
          :to="artistPath(artist)"
          class="home-text__link"
          :aria-current="id === artistSlug(artist.name_en) ? 'page' : undefined"
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
    }
  },
  methods: {
    artistDisplayNameKr(artist) {
      const k = artist.name_kr
      return typeof k === 'string' && k.trim() !== '' ? k : artist.name_en
    },
    artistSlug(nameEn) {
      return nameEn.toLowerCase().trim().replace(/\s+/g, '-')
    },
    artistPath(artist) {
      return `/artists/${this.artistSlug(artist.name_en)}`
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
  },
}
</script>

<style scoped>
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
</style>
