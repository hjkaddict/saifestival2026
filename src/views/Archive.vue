<template>
  <main
    class="archive-page app-min-vh"
    :class="locale.lang === 'kr' ? 'archive-page--ko' : 'archive-page--en'"
  >
    <header class="archive-page__header">
      <nav class="archive-page__tabs" aria-label="Archive sections">
        <template v-for="(section, idx) in sections" :key="section.id">
          <button
            type="button"
            class="archive-page__tab"
            :class="{ 'archive-page__tab--active': activeSection === section.id }"
            @click="activeSection = section.id"
          >
            <span class="archive-page__split" :style="sectionSplitStyle(section)">
              <span class="archive-page__split-ghost">
                <span :class="sectionTextClass">{{ sectionLabel(section) }}</span>
              </span>
              <span class="archive-page__split-half archive-page__split-half--top" aria-hidden="true">
                <span :class="sectionTextClass">{{ sectionLabel(section) }}</span>
              </span>
              <span
                class="archive-page__split-half archive-page__split-half--bottom"
                aria-hidden="true"
              >
                <span :class="sectionTextClass">{{ sectionLabel(section) }}</span>
              </span>
            </span>
          </button>
          <span
            v-if="idx < sections.length - 1"
            class="archive-page__sep"
            aria-hidden="true"
          >·</span>
        </template>
      </nav>

      <div v-if="activeSection !== 'festival'" class="archive-page__filters">
        <div
          class="archive-page__artist"
          :class="{ 'archive-page__artist--open': artistMenuOpen }"
        >
          <button
            type="button"
            class="archive-page__artist-trigger"
            :aria-expanded="artistMenuOpen ? 'true' : 'false'"
            aria-haspopup="listbox"
            :aria-controls="'archive-artist-menu'"
            :disabled="!availableArtistNames.length"
            @click="toggleArtistMenu"
          >
            <span class="archive-page__artist-trigger-label">{{ artistFilterLabel }}</span>
            <span class="archive-page__artist-caret" aria-hidden="true" />
          </button>
          <ul
            v-show="artistMenuOpen"
            id="archive-artist-menu"
            class="archive-page__artist-menu"
            role="listbox"
            :aria-label="artistFilterLabel"
          >
            <li
              v-for="name in availableArtistNames"
              :key="name"
              role="option"
            >
              <button
                type="button"
                class="archive-page__artist-option"
                @click="pickArtist(name)"
              >
                {{ name }}
              </button>
            </li>
          </ul>
        </div>
        <template v-for="(name, idx) in selectedArtists" :key="name">
          <span
            v-if="idx > 0"
            class="archive-page__artist-or"
            aria-hidden="true"
          >or</span>
          <button
            type="button"
            class="archive-page__artist-clear"
            @click="removeArtist(name)"
          >
            {{ name }} ×
          </button>
        </template>
        <label v-if="selectedArtists.length" class="archive-page__main-only">
          <input v-model="mainOnly" type="checkbox" class="archive-page__main-only-input" />
          <span>{{ mainOnlyLabel }}</span>
        </label>
        <span class="archive-page__count">{{ photoCountLabel }}</span>
      </div>
      <p
        v-if="activeSection !== 'festival'"
        class="archive-page__filter-hint"
      >
        {{ artistFilterHint }}
      </p>
      <div v-else class="archive-page__filters">
        <span class="archive-page__count">{{ photoCountLabel }}</span>
      </div>
    </header>

    <div v-if="groupedPhotos.length" class="archive-page__body">
      <section
        v-for="group in groupedPhotos"
        :key="group.dateKey"
        class="archive-page__day"
      >
        <h2 class="archive-page__day-title">
          <button
            type="button"
            class="archive-page__day-toggle"
            :aria-expanded="!isDayCollapsed(group.dateKey) ? 'true' : 'false'"
            @click="toggleDay(group.dateKey)"
          >
            <span
              class="archive-page__day-caret"
              :class="{ 'archive-page__day-caret--collapsed': isDayCollapsed(group.dateKey) }"
              aria-hidden="true"
            />
            <template v-if="group.dateLabel.day">
              <span class="archive-page__day-badge archive-page__day-badge--day">{{ group.dateLabel.day }}</span>
              <span class="archive-page__day-date">{{ group.dateLabel.date }}</span>
            </template>
            <span v-else class="archive-page__day-badge">{{ group.dateLabel.text }}</span>
            <span class="archive-page__day-count">{{ dayPhotoCountLabel(group.photos.length) }}</span>
          </button>
        </h2>
        <div v-show="!isDayCollapsed(group.dateKey)" class="archive-page__grid">
          <button
            v-for="photo in group.photos"
            :key="photo.src"
            type="button"
            class="archive-page__thumb"
            :class="{ 'archive-page__thumb--last': photo.src === lastViewedSrc }"
            :aria-label="photoMains(photo)[0] || photo.id"
            @click="openLightbox(photo)"
          >
            <img
              class="archive-page__thumb-img"
              :src="thumbSrc(photo)"
              alt=""
              loading="lazy"
              decoding="async"
            />
          </button>
        </div>
      </section>
    </div>
    <p v-else class="archive-page__empty">{{ emptyMessage }}</p>

    <Teleport to="body">
      <div
        v-if="lightboxPhoto"
        class="archive-lightbox"
        role="dialog"
        aria-modal="true"
        :aria-label="locale.lang === 'kr' ? '사진 보기' : 'View photo'"
        @click.self="closeLightbox"
        @mousemove="onLightboxMouseMove"
        @mouseleave="onLightboxMouseLeave"
      >
        <div class="archive-lightbox__stage" @click.self="closeLightbox">
          <button
            type="button"
            class="archive-lightbox__nav archive-lightbox__nav--prev"
            :aria-label="locale.lang === 'kr' ? '이전 사진' : 'Previous photo'"
            @click.stop="showPrevLightboxPhoto"
          >
            <span aria-hidden="true">‹</span>
          </button>

          <div class="archive-lightbox__frame">
            <button
              type="button"
              class="archive-lightbox__image-btn"
              :aria-label="locale.lang === 'kr' ? '닫기' : 'Close'"
              @click.stop="closeLightbox"
            >
              <img
                class="archive-lightbox__img"
                :src="lightboxPhoto.src"
                alt=""
              />
              <span class="archive-lightbox__x archive-lightbox__x--static" aria-hidden="true">×</span>
            </button>

            <div v-if="lightboxCaption || lightboxMetaParts" class="archive-lightbox__meta">
              <p v-if="lightboxCaption" class="archive-lightbox__caption">
                {{ lightboxCaption }}
              </p>
              <p v-if="lightboxMetaParts" class="archive-lightbox__info">
                <template v-if="lightboxMetaParts.day">
                  <span class="archive-page__day-badge archive-page__day-badge--day">{{ lightboxMetaParts.day }}</span>
                  <span class="archive-page__day-date">{{ lightboxMetaParts.date }}</span>
                </template>
                <span v-else class="archive-page__day-badge">{{ lightboxMetaParts.text }}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            class="archive-lightbox__nav archive-lightbox__nav--next"
            :aria-label="locale.lang === 'kr' ? '다음 사진' : 'Next photo'"
            @click.stop="showNextLightboxPhoto"
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>

        <span
          class="archive-lightbox__x archive-lightbox__x--follow"
          :class="{
            'archive-lightbox__x--on': lightboxCursor.on,
            'archive-lightbox__x--on-photo': lightboxCursor.onPhoto,
          }"
          :style="lightboxCursorStyle"
          aria-hidden="true"
        >×</span>
      </div>
    </Teleport>
  </main>
</template>

<script>
import { archivePhotos } from '@/assets/data/archivePhotos.js'
import { localeStore } from '@/store/locale.js'
import { SPLIT_SCALE_KO, SPLIT_SCALE_LATIN, splitShiftPx } from '@/utils/splitShift.js'

const ARCHIVE_SECTIONS = [
  { id: 'festival', name: 'Overview', koName: '페스티벌 전경' },
  { id: 'exhibition', name: 'Exhibition', koName: '전시' },
  { id: 'performance', name: 'Performance', koName: '퍼포먼스' },
  { id: 'workshop', name: 'Workshop/Lecture', koName: '워크숍/강연' },
]

function dateSortKey(date) {
  if (!date) return '9999-99-99'
  if (date === 'before') return '0000-00-00'
  if (date === 'after') return '9998-99-99'
  return date
}

/** Stable pseudo-random order within a day — does not reshuffle on filter toggles. */
function orderPhotos(list) {
  return list.slice().sort((a, b) => {
    const ha = archivePathHash(a.src || a.id || '')
    const hb = archivePathHash(b.src || b.id || '')
    if (ha !== hb) return ha - hb
    return String(a.src || '').localeCompare(String(b.src || ''))
  })
}

function photoMains(photo) {
  if (Array.isArray(photo.mains) && photo.mains.length) return photo.mains.filter(Boolean)
  return photo.main ? [photo.main] : []
}

function collectArtistNames(photos) {
  const names = new Set()
  for (const photo of photos) {
    for (const artist of photoMains(photo)) names.add(artist)
    for (const artist of photo.artists || []) {
      if (artist) names.add(artist)
    }
  }
  return [...names].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
}

function archivePathHash(s) {
  return s.split('').reduce((a, c) => ((Math.imul(a, 31) + c.charCodeAt(0)) | 0) >>> 0, 5381) >>> 0
}

export default {
  name: 'Archive',
  data() {
    return {
      locale: localeStore,
      sections: ARCHIVE_SECTIONS,
      activeSection: 'festival',
      selectedArtists: [],
      artistMenuOpen: false,
      mainOnly: false,
      lightboxPhoto: null,
      lightboxIndex: -1,
      lightboxCursor: { on: false, x: 0, y: 0, onPhoto: false },
      lastViewedSrc: '',
      groupedPhotos: [],
      viewPhotos: [],
      collapsedDays: {},
      syncingQuery: false,
      allPhotos: archivePhotos,
      artistNames: collectArtistNames(archivePhotos),
    }
  },
  created() {
    this.applyQueryFromRoute(this.$route.query)
  },
  computed: {
    isKo() {
      return this.locale.lang === 'kr'
    },
    sectionTextClass() {
      return this.isKo ? 'archive-page__ko' : 'archive-page__en'
    },
    artistFilterLabel() {
      return this.isKo ? '아티스트 선택' : 'Select Artists'
    },
    mainOnlyLabel() {
      if (this.selectedArtists.length >= 2) {
        return this.isKo ? '이 아티스트들만' : 'these artists only'
      }
      return this.isKo ? '이 아티스트만' : 'this artist only'
    },
    artistFilterHint() {
      if (this.isKo) {
        const focus =
          this.selectedArtists.length >= 2 ? '이 아티스트들만' : '이 아티스트만'
        return `검색 결과는 해당 아티스트의 작업물이 들어 있는 모든 사진을 포함할 수 있습니다. 해당 아티스트의 작업이 중심인 사진을 보고 싶다면 「${focus}」을 체크하세요.`
      }
      const focus =
        this.selectedArtists.length >= 2 ? 'these artists only' : 'this artist only'
      return `Search results may include all photos in which the selected artist’s work appears. To see only photos where their work is the main subject, check “${focus}”.`
    },
    availableArtistNames() {
      return this.artistNames.filter((name) => !this.selectedArtists.includes(name))
    },
    emptyMessage() {
      return this.isKo
        ? '조건에 맞는 사진이 없습니다.'
        : 'No photos match these filters.'
    },
    filteredPhotos() {
      return this.allPhotos.filter((photo) => {
        if (this.activeSection === 'festival') {
          return !!photo.festivalView
        }

        if (photo.type !== this.activeSection) {
          return false
        }

        if (this.selectedArtists.length) {
          const mains = photoMains(photo)
          if (this.mainOnly) {
            // Show if any selected artist is tagged as Main (multiple Mains allowed).
            if (!this.selectedArtists.some((name) => mains.includes(name))) return false
          } else {
            const tagged = new Set([...(photo.artists || []), ...mains].filter(Boolean))
            if (!this.selectedArtists.some((name) => tagged.has(name))) return false
          }
        }

        return true
      })
    },
    photoCountLabel() {
      const n = this.viewPhotos.length
      return this.isKo ? `전체 ${n}장` : `Total ${n} photos`
    },
    lightboxCaption() {
      const photo = this.lightboxPhoto
      if (!photo) return ''
      return (photo.caption || '').trim()
    },
    lightboxMetaParts() {
      const photo = this.lightboxPhoto
      if (!photo?.date) return null
      return this.formatDateParts(photo.date)
    },
    lightboxCursorStyle() {
      if (!this.lightboxCursor.on) return undefined
      return {
        left: `${this.lightboxCursor.x}px`,
        top: `${this.lightboxCursor.y}px`,
      }
    },
  },
  watch: {
    filteredPhotos: {
      immediate: true,
      handler() {
        this.rebuildView()
      },
    },
    lightboxPhoto(photo) {
      document.body.style.overflow = photo ? 'hidden' : ''
    },
    activeSection() {
      this.closeLightbox()
      this.closeArtistMenu()
      this.syncQueryToRoute()
    },
    selectedArtists() {
      this.closeLightbox()
      if (!this.selectedArtists.length && this.mainOnly) {
        this.mainOnly = false
      }
      this.syncQueryToRoute()
    },
    mainOnly() {
      this.closeLightbox()
      this.syncQueryToRoute()
    },
    '$route.query'(query) {
      if (this.syncingQuery) return
      this.applyQueryFromRoute(query)
    },
    'locale.lang'() {
      this.groupedPhotos = this.groupedPhotos.map((group) => ({
        ...group,
        dateLabel: this.formatDateParts(group.dateKey),
      }))
    },
  },
  mounted() {
    window.addEventListener('keydown', this.onKeydown)
    document.addEventListener('pointerdown', this.onArtistMenuPointerDown, true)
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.onKeydown)
    document.removeEventListener('pointerdown', this.onArtistMenuPointerDown, true)
    document.body.style.overflow = ''
  },
  methods: {
    photoMains,
    dayPhotoCountLabel(n) {
      return this.isKo ? `(${n}장)` : `(${n} photos)`
    },
    isDayCollapsed(dateKey) {
      return !!this.collapsedDays[dateKey]
    },
    toggleDay(dateKey) {
      this.collapsedDays = {
        ...this.collapsedDays,
        [dateKey]: !this.collapsedDays[dateKey],
      }
    },
    parseArtistsQuery(raw) {
      const value = Array.isArray(raw) ? raw.join(',') : raw || ''
      if (!value) return []
      return value
        .split(',')
        .map((part) => {
          try {
            return decodeURIComponent(part.trim())
          } catch {
            return part.trim()
          }
        })
        .filter((name) => name && this.artistNames.includes(name))
    },
    buildArchiveQuery() {
      const query = {}
      if (this.activeSection !== 'festival') {
        query.section = this.activeSection
      }
      if (this.selectedArtists.length) {
        query.artists = this.selectedArtists.join(',')
      }
      if (this.mainOnly && this.selectedArtists.length) {
        query.main = '1'
      }
      return query
    },
    queriesMatch(a, b) {
      return (
        (a.section || undefined) === (b.section || undefined) &&
        (a.artists || undefined) === (b.artists || undefined) &&
        (a.main || undefined) === (b.main || undefined)
      )
    },
    applyQueryFromRoute(query = {}) {
      const sectionIds = new Set(ARCHIVE_SECTIONS.map((section) => section.id))
      const nextSection = sectionIds.has(query.section) ? query.section : 'festival'
      const nextArtists = this.parseArtistsQuery(query.artists)
      const nextMain = (query.main === '1' || query.main === 'true') && nextArtists.length > 0

      if (
        this.activeSection === nextSection &&
        this.mainOnly === nextMain &&
        this.selectedArtists.length === nextArtists.length &&
        this.selectedArtists.every((name, idx) => name === nextArtists[idx])
      ) {
        return
      }

      this.syncingQuery = true
      this.activeSection = nextSection
      this.selectedArtists = nextArtists
      this.mainOnly = nextMain
      this.$nextTick(() => {
        this.syncingQuery = false
      })
    },
    syncQueryToRoute() {
      if (this.syncingQuery) return
      const query = this.buildArchiveQuery()
      if (this.queriesMatch(this.$route.query, query)) return
      this.syncingQuery = true
      this.$router
        .replace({ name: 'Archive', query })
        .catch(() => {})
        .finally(() => {
          this.$nextTick(() => {
            this.syncingQuery = false
          })
        })
    },
    toggleArtistMenu() {
      if (!this.availableArtistNames.length) return
      this.artistMenuOpen = !this.artistMenuOpen
    },
    closeArtistMenu() {
      this.artistMenuOpen = false
    },
    pickArtist(name) {
      if (!name || this.selectedArtists.includes(name)) return
      this.selectedArtists = [...this.selectedArtists, name]
      this.closeArtistMenu()
    },
    onArtistMenuPointerDown(event) {
      if (!this.artistMenuOpen) return
      const root = this.$el?.querySelector?.('.archive-page__artist')
      if (root && !root.contains(event.target)) {
        this.closeArtistMenu()
      }
    },
    rebuildView() {
      const groups = new Map()
      for (const photo of this.filteredPhotos) {
        const dateKey = photo.date || 'undated'
        if (!groups.has(dateKey)) groups.set(dateKey, [])
        groups.get(dateKey).push(photo)
      }

      const grouped = [...groups.entries()]
        .sort((a, b) => dateSortKey(a[0]).localeCompare(dateSortKey(b[0])))
        .map(([dateKey, photos]) => ({
          dateKey,
          dateLabel: this.formatDateParts(dateKey),
          photos: orderPhotos(photos),
        }))

      this.groupedPhotos = grouped
      this.viewPhotos = grouped.flatMap((group) => group.photos)

      if (this.lightboxPhoto) {
        const nextIndex = this.viewPhotos.findIndex(
          (photo) => photo.src === this.lightboxPhoto.src,
        )
        if (nextIndex < 0) {
          this.closeLightbox()
        } else {
          this.lightboxIndex = nextIndex
          this.lightboxPhoto = this.viewPhotos[nextIndex]
        }
      }
    },
    removeArtist(name) {
      this.selectedArtists = this.selectedArtists.filter((artist) => artist !== name)
    },
    sectionLabel(section) {
      return this.isKo ? section.koName : section.name
    },
    thumbSrc(photo) {
      const src = photo.src || ''
      const slash = src.lastIndexOf('/')
      if (slash < 0) return src
      return `${src.slice(0, slash)}/thumbs/${src.slice(slash + 1)}`
    },
    splitShiftVars(seedStr, scale) {
      const key = archivePathHash(seedStr)
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
      return {
        '--archive-split-shift-top': splitShiftPx(signTop * base * topJitter * scale),
        '--archive-split-shift-bottom': splitShiftPx(signBot * base * botJitter * scale),
      }
    },
    sectionSplitStyle(section) {
      const label = this.sectionLabel(section)
      const scale = this.isKo ? SPLIT_SCALE_KO : SPLIT_SCALE_LATIN
      return this.splitShiftVars(`${section.id}\0${this.locale.lang}\0${label}`, scale)
    },
    formatDateParts(dateKey) {
      const isKo = this.isKo
      if (!dateKey || dateKey === 'undated') {
        return { text: isKo ? '날짜 미정' : 'Undated' }
      }
      if (dateKey === 'before') {
        return { text: isKo ? '페스티벌 시작 전' : 'Before the festival' }
      }
      if (dateKey === 'after') {
        return { text: isKo ? '페스티벌 종료 후' : 'After the festival' }
      }
      const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey)
      if (!match) return { text: dateKey }
      const year = Number(match[1])
      const month = Number(match[2])
      const day = Number(match[3])
      const start = Date.UTC(2026, 6, 10)
      const current = Date.UTC(year, month - 1, day)
      const festivalDay = Math.round((current - start) / 86400000) + 1
      const datePart = isKo
        ? `${month}월 ${day}일`
        : `${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][month - 1]} ${day}`
      return {
        day: `Day ${festivalDay}`,
        date: datePart,
      }
    },
    openLightbox(photo) {
      const index = this.viewPhotos.findIndex((item) => item.src === photo.src)
      this.lightboxIndex = index
      this.lightboxPhoto = index >= 0 ? this.viewPhotos[index] : photo
      this.lastViewedSrc = this.lightboxPhoto?.src || ''
    },
    showNextLightboxPhoto() {
      if (!this.viewPhotos.length || this.lightboxIndex < 0) return
      const nextIndex = (this.lightboxIndex + 1) % this.viewPhotos.length
      this.lightboxIndex = nextIndex
      this.lightboxPhoto = this.viewPhotos[nextIndex]
      this.lastViewedSrc = this.lightboxPhoto.src
    },
    showPrevLightboxPhoto() {
      if (!this.viewPhotos.length || this.lightboxIndex < 0) return
      const prevIndex =
        (this.lightboxIndex - 1 + this.viewPhotos.length) % this.viewPhotos.length
      this.lightboxIndex = prevIndex
      this.lightboxPhoto = this.viewPhotos[prevIndex]
      this.lastViewedSrc = this.lightboxPhoto.src
    },
    closeLightbox() {
      if (this.lightboxPhoto?.src) {
        this.lastViewedSrc = this.lightboxPhoto.src
      }
      this.lightboxPhoto = null
      this.lightboxIndex = -1
      this.lightboxCursor = { on: false, x: 0, y: 0, onPhoto: false }
    },
    onLightboxMouseMove(event) {
      if (event.target.closest('.archive-lightbox__nav')) {
        this.lightboxCursor = { on: false, x: 0, y: 0, onPhoto: false }
        return
      }
      this.lightboxCursor = {
        on: true,
        x: event.clientX,
        y: event.clientY,
        onPhoto: !!event.target.closest('.archive-lightbox__image-btn'),
      }
    },
    onLightboxMouseLeave() {
      this.lightboxCursor = { on: false, x: 0, y: 0, onPhoto: false }
    },
    onKeydown(event) {
      if (event.key === 'Escape' && this.artistMenuOpen) {
        this.closeArtistMenu()
        return
      }
      if (!this.lightboxPhoto) return
      if (event.key === 'Escape') {
        this.closeLightbox()
        return
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        this.showNextLightboxPhoto()
        return
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        this.showPrevLightboxPhoto()
      }
    },
  },
}
</script>

<style scoped>
.archive-page {
  --archive-split-merge-duration: 0.35s;
  --archive-split-merge-easing: cubic-bezier(0.45, 0, 0.2, 1);
  --archive-text: rgba(10, 10, 10, 0.86);
  --archive-text-muted: rgba(10, 10, 10, 0.45);
  --archive-line: rgba(10, 10, 10, 0.1);

  box-sizing: border-box;
  width: 100%;
  min-height: inherit;
  padding:
    clamp(72px, 12vw, 132px)
    clamp(16px, 4vw, 48px)
    clamp(48px, 8vw, 80px);
  background: transparent;
  color: var(--archive-text);
  font-size: 1rem;
  line-height: 1.65;
}

@media (min-width: 900px) {
  .archive-page {
    padding-top: 0;
  }
}

.archive-page--en,
.archive-page--ko {
  font-family: var(--font-home-en);
  font-weight: var(--font-home-en-weight);
}

.archive-page__header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.75rem;
}

@media (min-width: 900px) {
  .archive-page__header {
    position: sticky;
    top: 0;
    z-index: 40;
    box-sizing: border-box;
    margin: 0 calc(-1 * clamp(16px, 4vw, 48px)) 1.25rem;
    padding: 5.25rem clamp(16px, 4vw, 48px) 0.75rem;
    background: #fff;
  }
}

.archive-page__tabs {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.15rem 0;
}

.archive-page__tab {
  appearance: none;
  display: inline-block;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--archive-text-muted);
  font: inherit;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.archive-page__tab--active {
  color: var(--archive-text);
}

.archive-page__tab:hover,
.archive-page__tab:focus-visible,
.archive-page__tab--active {
  outline: none;
}

.archive-page__tab:hover .archive-page__en,
.archive-page__tab:focus-visible .archive-page__en,
.archive-page__tab--active .archive-page__en,
.archive-page__tab:hover .archive-page__ko,
.archive-page__tab:focus-visible .archive-page__ko,
.archive-page__tab--active .archive-page__ko {
  text-shadow:
    0.014em 0 0 currentColor,
    -0.014em 0 0 currentColor;
}

.archive-page__tab:hover .archive-page__split-ghost,
.archive-page__tab:focus-visible .archive-page__split-ghost,
.archive-page__tab--active .archive-page__split-ghost {
  opacity: 1;
}

.archive-page__tab:hover .archive-page__split-half,
.archive-page__tab:focus-visible .archive-page__split-half,
.archive-page__tab--active .archive-page__split-half {
  opacity: 0;
}

.archive-page__tab:hover .archive-page__split::after,
.archive-page__tab:focus-visible .archive-page__split::after,
.archive-page__tab--active .archive-page__split::after {
  opacity: 1;
}

.archive-page__sep {
  user-select: none;
  font-family: var(--font-home-ko);
  font-size: 1.14em;
  vertical-align: 0.02em;
  margin: 0 0.45em;
  color: var(--archive-text-muted);
}

.archive-page__split {
  position: relative;
  display: inline-block;
  vertical-align: baseline;
}

.archive-page__split::after {
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
  transition: opacity var(--archive-split-merge-duration) var(--archive-split-merge-easing);
}

.archive-page__split-ghost {
  opacity: 0;
  pointer-events: none;
  user-select: none;
  transition: opacity var(--archive-split-merge-duration) var(--archive-split-merge-easing);
}

.archive-page__split-half {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  user-select: none;
  transition: opacity var(--archive-split-merge-duration) var(--archive-split-merge-easing);
}

.archive-page__split-half--top {
  clip-path: inset(0 0 50% 0);
  transform: translateX(var(--archive-split-shift-top, -1.5px));
}

.archive-page__split-half--bottom {
  clip-path: inset(50% 0 0 0);
  transform: translateX(var(--archive-split-shift-bottom, 1.5px));
}

.archive-page__en {
  font-family: var(--font-home-en);
  font-weight: var(--font-home-en-weight);
  letter-spacing: normal;
  transition: text-shadow var(--archive-split-merge-duration) var(--archive-split-merge-easing);
}

.archive-page__ko {
  font-family: var(--font-home-ko);
  font-weight: var(--font-home-ko-weight);
  transition: text-shadow var(--archive-split-merge-duration) var(--archive-split-merge-easing);
}

.archive-page__gap {
  display: inline-block;
  font-family: var(--font-home-en);
  margin: 0 0.15em;
  white-space: pre;
  transition: text-shadow var(--archive-split-merge-duration) var(--archive-split-merge-easing);
}

.archive-page__filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.55rem 0.85rem;
}

.archive-page__artist {
  position: relative;
  z-index: 5;
  display: inline-flex;
  align-items: center;
}

.archive-page__artist-trigger {
  appearance: none;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  margin: 0;
  padding: 0.15rem 0;
  border: 0;
  border-bottom: 1px solid #0a0a0a;
  background: transparent;
  color: #0a0a0a;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.archive-page__artist-trigger:disabled {
  opacity: 0.35;
  cursor: default;
}

.archive-page__artist-trigger-label {
  font-family: var(--font-home-en);
  font-size: 0.94rem;
  font-weight: var(--font-home-en-weight);
  line-height: 1.2;
}

.archive-page--ko .archive-page__artist-trigger-label {
  font-family: var(--font-home-ko);
  font-weight: var(--font-home-ko-weight);
}

.archive-page__artist-caret {
  width: 0.4rem;
  height: 0.4rem;
  border-right: 1px solid currentColor;
  border-bottom: 1px solid currentColor;
  transform: translateY(-0.1rem) rotate(45deg);
  transition: transform 0.2s ease;
}

.archive-page__artist--open .archive-page__artist-caret {
  transform: translateY(0.08rem) rotate(225deg);
}

.archive-page__artist-menu {
  position: absolute;
  top: calc(100% + 0.4rem);
  left: 0;
  z-index: 20;
  width: max(12rem, 100%);
  max-height: min(18rem, 50vh);
  margin: 0;
  padding: 0.25rem 0;
  overflow: auto;
  list-style: none;
  border: 1px solid #0a0a0a;
  background: #fff;
  overscroll-behavior: contain;
}

.archive-page__artist-option {
  appearance: none;
  display: block;
  width: 100%;
  margin: 0;
  padding: 0.4rem 0.75rem;
  border: 0;
  background: transparent;
  color: #0a0a0a;
  font-family: var(--font-home-en);
  font-size: 0.94rem;
  font-weight: var(--font-home-en-weight);
  line-height: 1.3;
  text-align: left;
  cursor: pointer;
}

.archive-page__artist-option:hover,
.archive-page__artist-option:focus-visible {
  background: #0a0a0a;
  color: #fff;
  outline: none;
}

@media (prefers-reduced-motion: reduce) {
  .archive-page__artist-caret {
    transition: none;
  }
}

.archive-page__artist-clear {
  appearance: none;
  margin: 0;
  padding: 0.22rem 0.7rem;
  border: 1px solid #0a0a0a;
  border-radius: 999px;
  background: #0a0a0a;
  color: #fff;
  font: inherit;
  font-size: 0.9rem;
  cursor: pointer;
}

.archive-page__artist-or {
  color: var(--archive-text-muted);
  font-family: var(--font-home-en);
  font-size: 0.86rem;
  line-height: 1;
  user-select: none;
}

.archive-page__main-only {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--archive-text-muted);
  font-size: 0.92rem;
  cursor: pointer;
  user-select: none;
}

.archive-page--ko .archive-page__main-only {
  font-family: var(--font-home-ko);
  font-weight: var(--font-home-ko-weight);
}

.archive-page__main-only-input {
  margin: 0;
  accent-color: #0a0a0a;
  cursor: pointer;
}

.archive-page__count {
  margin-left: auto;
  color: var(--archive-text-muted);
  font-size: 0.92rem;
}

.archive-page__filter-hint {
  margin: -0.15rem 0 0;
  max-width: 42rem;
  color: var(--archive-text-muted);
  font-family: var(--font-home-en);
  font-size: 0.82rem;
  font-weight: var(--font-home-en-weight);
  line-height: 1.45;
}

.archive-page--ko .archive-page__filter-hint {
  font-family: var(--font-home-ko);
  font-weight: var(--font-home-ko-weight);
}

.archive-page--ko .archive-page__count,
.archive-page--ko .archive-page__day-title,
.archive-page--ko .archive-page__empty {
  font-family: var(--font-home-ko);
  font-weight: var(--font-home-ko-weight);
}

.archive-page__day {
  margin: 0 0 1.75rem;
}

.archive-page__day:last-child {
  margin-bottom: 0;
}

.archive-page__day-title {
  margin: 0 0 0.55rem;
  color: var(--archive-text-muted);
  font-size: 0.94rem;
  font-weight: 400;
  line-height: 1.45;
}

.archive-page__day-toggle {
  appearance: none;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.4rem;
  width: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.archive-page__day-toggle:focus-visible {
  outline: 1px solid #0a0a0a;
  outline-offset: 2px;
}

.archive-page__day-caret {
  flex: 0 0 auto;
  width: 0;
  height: 0;
  margin-right: 0.25rem;
  border-left: 0.42em solid transparent;
  border-right: 0.42em solid transparent;
  border-top: 0.52em solid #0a0a0a;
  transform: translateY(0.08em);
  transition: transform 0.2s ease;
}

.archive-page__day-caret--collapsed {
  transform: translateY(0.05em) rotate(-90deg);
}

.archive-page__day-badge {
  display: inline-block;
  padding: 0.12em 0.5em;
  background: #0a0a0a;
  color: #fff;
  font-family: var(--font-home-en);
  font-size: 1.15em;
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: 0.02em;
}

.archive-page--ko .archive-page__day-badge:not(.archive-page__day-badge--day) {
  font-family: var(--font-home-ko);
  font-weight: var(--font-home-ko-weight);
}

.archive-page__day-date {
  color: var(--archive-text-muted);
  line-height: 1.2;
}

.archive-page__day-count {
  margin-left: auto;
  color: var(--archive-text-muted);
  font-family: var(--font-home-en);
  font-size: 0.88em;
  line-height: 1.2;
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .archive-page__day-caret {
    transition: none;
  }
}

.archive-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(7.5rem, 1fr));
  gap: 0.4rem;
}

.archive-page__thumb {
  position: relative;
  appearance: none;
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  margin: 0;
  padding: 0;
  border: 0;
  background: rgba(10, 10, 10, 0.04);
  cursor: pointer;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
}

.archive-page__thumb--last::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  box-shadow: inset 0 0 0 3px #0a0a0a;
  pointer-events: none;
}

.archive-page__thumb:focus-visible {
  outline: 1px solid #0a0a0a;
  outline-offset: 1px;
}

.archive-page__thumb-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: filter 0.35s ease;
}

.archive-page__thumb:hover .archive-page__thumb-img,
.archive-page__thumb:focus-visible .archive-page__thumb-img {
  filter: invert(1);
}

.archive-page__empty {
  margin: 3rem 0 0;
  color: var(--archive-text-muted);
}

.archive-lightbox {
  position: fixed;
  inset: 0;
  z-index: 20000;
  margin: 0;
  padding: 0;
  background: rgba(255, 255, 255, 0.96);
  cursor: none;
}

.archive-lightbox__stage {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 3vh 1.5vw;
  pointer-events: none;
}

.archive-lightbox__frame {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;
  max-width: min(92vw, calc(100vw - 6.5rem));
  max-height: 94vh;
  max-height: 94dvh;
  pointer-events: none;
}

.archive-lightbox__nav {
  position: absolute;
  top: 50%;
  z-index: 2;
  appearance: none;
  display: grid;
  place-items: center;
  width: 2.8rem;
  height: 2.8rem;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: rgba(10, 10, 10, 0.55);
  font-family: var(--font-home-en);
  font-size: 2.2rem;
  font-weight: 300;
  line-height: 1;
  transform: translateY(-50%);
  cursor: pointer;
  pointer-events: auto;
  -webkit-tap-highlight-color: transparent;
}

.archive-lightbox__nav--prev {
  left: 0.6rem;
}

.archive-lightbox__nav--next {
  right: 0.6rem;
}

.archive-lightbox__nav:hover,
.archive-lightbox__nav:focus-visible {
  color: #0a0a0a;
  outline: none;
}

@media (min-width: 900px) {
  .archive-lightbox__nav {
    width: 3.4rem;
    height: 3.4rem;
    color: #0a0a0a;
    font-size: 3.1rem;
    font-weight: 400;
  }

  .archive-lightbox__nav--prev {
    left: 1.1rem;
  }

  .archive-lightbox__nav--next {
    right: 1.1rem;
  }

  .archive-lightbox__nav:hover,
  .archive-lightbox__nav:focus-visible {
    opacity: 0.65;
  }
}

.archive-lightbox__image-btn {
  position: relative;
  appearance: none;
  display: block;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: none;
  pointer-events: auto;
}

.archive-lightbox__img {
  display: block;
  max-width: min(92vw, calc(100vw - 6.5rem));
  max-height: calc(94vh - 3.5rem);
  max-height: calc(94dvh - 3.5rem);
  width: auto;
  height: auto;
  margin: 0;
  object-fit: contain;
}

.archive-lightbox__x {
  z-index: 3;
  color: #0a0a0a;
  font-family: var(--font-home-en);
  font-size: 1.55rem;
  font-weight: 300;
  line-height: 1;
  pointer-events: none;
}

.archive-lightbox__x--follow {
  position: fixed;
  top: 0;
  left: 0;
  transform: translate(-50%, -50%);
  opacity: 0;
}

.archive-lightbox__x--follow.archive-lightbox__x--on {
  opacity: 1;
}

.archive-lightbox__x--follow.archive-lightbox__x--on-photo {
  color: #fff;
  text-shadow: 0 0 0.35em rgba(0, 0, 0, 0.65);
}

.archive-lightbox__x--static {
  display: none;
  position: absolute;
  top: 0.55rem;
  right: 0.7rem;
  color: #fff;
  text-shadow: 0 0 0.35em rgba(0, 0, 0, 0.65);
}

@media (hover: none) {
  .archive-lightbox {
    cursor: default;
  }

  .archive-lightbox__image-btn {
    cursor: pointer;
  }

  .archive-lightbox__x--follow {
    display: none;
  }

  .archive-lightbox__x--static {
    display: block;
  }
}

.archive-lightbox__meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  width: min(92vw, 40rem);
  margin: 0;
  text-align: center;
  pointer-events: none;
}

.archive-lightbox__caption {
  margin: 0;
  color: var(--archive-text);
  font-size: 0.96rem;
  line-height: 1.4;
}

.archive-lightbox__info {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: center;
  gap: 0.4rem;
  margin: 0;
  color: var(--archive-text-muted);
  font-size: 0.88rem;
}

@media (prefers-reduced-motion: reduce) {
  .archive-page__split-ghost,
  .archive-page__split-half {
    transition: none;
  }

  .archive-page__en,
  .archive-page__ko,
  .archive-page__gap {
    transition: none;
  }

  .archive-page__split-ghost {
    opacity: 1;
  }

  .archive-page__split-half {
    display: none;
  }
}

@media (max-width: 768px) {
  .archive-page {
    padding: calc(108px + env(safe-area-inset-top, 0px)) 16px 48px;
  }

  .archive-page__grid {
    grid-template-columns: repeat(auto-fill, minmax(5.5rem, 1fr));
    gap: 0.28rem;
  }

  .archive-page__count {
    width: 100%;
    margin-left: 0;
  }
}
</style>
