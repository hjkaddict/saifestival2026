<template>
  <main class="sai-live-page" aria-label="SA–I LIVE">
    <div
      class="sai-live-page__loading"
      :class="{ 'sai-live-page__loading--hidden': !loading }"
      aria-live="polite"
      :aria-busy="loading"
    >
      <span class="sai-live-page__spinner" aria-hidden="true"></span>
      <span class="sai-live-page__loading-text">{{ loadingLabel }}</span>
    </div>
    <iframe
      class="sai-live-page__frame"
      :src="streamSrc"
      title="SA–I LIVE"
      allow="autoplay; fullscreen"
      referrerpolicy="no-referrer"
      @load="onFrameLoad"
    ></iframe>
  </main>
</template>

<script>
import { localeStore } from '@/store/locale.js'

const STREAM_BASE = 'https://live.saifestival.com/live/stream/'

export default {
  name: 'SaiLive',
  data() {
    return {
      locale: localeStore,
      loading: true,
    }
  },
  computed: {
    streamSrc() {
      const params = new URLSearchParams({
        controls: 'false',
        autoplay: 'true',
        playsinline: 'true',
        disablepictureinpicture: 'true',
        muted: 'false',
      })
      return `${STREAM_BASE}?${params.toString()}`
    },
    loadingLabel() {
      return this.locale.lang === 'kr' ? '로딩 중' : 'Loading'
    },
  },
  methods: {
    onFrameLoad() {
      this.loading = false
    },
  },
}
</script>

<style scoped>
.sai-live-page {
  position: fixed;
  inset: 0;
  width: 100%;
  height: calc(var(--app-vh, 1vh) * 100);
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: #ff0000;
}

.sai-live-page__loading {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: #ff0000;
  color: rgba(255, 255, 255, 0.88);
  transition: opacity 0.4s ease, visibility 0.4s ease;
}

.sai-live-page__loading--hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.sai-live-page__spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid rgba(255, 255, 255, 0.18);
  border-top-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  animation: sai-live-spin 0.85s linear infinite;
}

.sai-live-page__loading-text {
  font-family: var(--font-home-en);
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

@keyframes sai-live-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .sai-live-page__spinner {
    animation: none;
    border-top-color: rgba(255, 255, 255, 0.5);
  }

  .sai-live-page__loading {
    transition: none;
  }
}

.sai-live-page__frame {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
