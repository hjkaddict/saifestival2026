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
    <button
      v-if="needsTap"
      type="button"
      class="sai-live-page__tap"
      @click="startFromTap"
    >
      {{ tapLabel }}
    </button>
    <button
      v-if="showAudioToggle"
      type="button"
      class="sai-live-page__audio-toggle"
      :aria-pressed="!isMuted"
      @click="toggleAudio"
    >
      {{ audioToggleLabel }}
    </button>
    <video
      ref="video"
      class="sai-live-page__video"
      autoplay
      playsinline
      disablepictureinpicture
      @playing="onPlaying"
    ></video>
  </main>
</template>

<script>
import { localeStore } from '@/store/locale.js'

const STREAM_M3U8 = 'https://live.saifestival.com/live/stream/index.m3u8'
const RETRY_MS = 2000

export default {
  name: 'SaiLive',
  data() {
    return {
      locale: localeStore,
      loading: true,
      needsTap: false,
      isMuted: true,
      hls: null,
      retryTimer: null,
      destroyed: false,
    }
  },
  computed: {
    loadingLabel() {
      return this.locale.lang === 'kr' ? '로딩 중' : 'Loading'
    },
    tapLabel() {
      return this.locale.lang === 'kr' ? '탭하여 재생' : 'Tap to play'
    },
    showAudioToggle() {
      return !this.loading && !this.needsTap
    },
    audioToggleLabel() {
      if (this.isMuted) {
        return this.locale.lang === 'kr' ? '소리 켜기' : 'Unmute'
      }
      return this.locale.lang === 'kr' ? '소리 끄기' : 'Mute'
    },
  },
  mounted() {
    this.initStream()
  },
  beforeUnmount() {
    this.destroyed = true
    this.teardownStream()
  },
  methods: {
    videoEl() {
      return this.$refs.video
    },
    supportsNativeHls(video) {
      return video.canPlayType('application/vnd.apple.mpegurl') !== ''
    },
    async initStream() {
      const video = this.videoEl()
      if (!video || this.destroyed) return

      video.autoplay = true
      video.playsInline = true
      video.controls = false

      if (this.supportsNativeHls(video)) {
        try {
          await fetch(STREAM_M3U8)
        } catch {
          // playlist may still become available; try playback anyway
        }
        if (this.destroyed) return
        video.src = STREAM_M3U8
        await this.tryPlay(true)
        return
      }

      const { default: Hls } = await import('hls.js')
      if (this.destroyed) return

      if (Hls.isSupported()) {
        const hls = new Hls()
        this.hls = hls
        hls.on(Hls.Events.MANIFEST_LOADED, () => {
          if (!this.destroyed) this.tryPlay(true)
        })
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal && !this.destroyed) this.scheduleRetry()
        })
        hls.attachMedia(video)
        hls.loadSource(STREAM_M3U8)
        return
      }

      video.src = STREAM_M3U8
      await this.tryPlay(true)
    },
    async tryPlay(withAudio = false) {
      const video = this.videoEl()
      if (!video || this.destroyed) return

      if (withAudio) {
        video.muted = false
        video.volume = 1
        try {
          await video.play()
          this.needsTap = false
          this.isMuted = false
          return
        } catch {
          // iOS and some browsers block unmuted autoplay; fall back to muted.
        }
      }

      video.muted = true
      try {
        await video.play()
        this.needsTap = false
        this.isMuted = true
      } catch {
        this.needsTap = true
        this.isMuted = true
        this.loading = false
      }
    },
    toggleAudio() {
      const video = this.videoEl()
      if (!video || this.destroyed) return

      const nextMuted = !video.muted
      video.muted = nextMuted
      if (!nextMuted) {
        video.volume = 1
      }
      this.isMuted = nextMuted
      video.play().catch(() => {})
    },
    async startFromTap() {
      this.needsTap = false
      this.loading = true
      await this.tryPlay(true)
      if (this.videoEl()?.paused) {
        this.needsTap = true
      }
    },
    onPlaying() {
      this.loading = false
      this.needsTap = false
    },
    scheduleRetry() {
      if (this.retryTimer || this.destroyed) return
      this.retryTimer = window.setTimeout(() => {
        this.retryTimer = null
        if (this.destroyed) return
        this.loading = true
        this.needsTap = false
        this.isMuted = true
        this.teardownStream()
        this.initStream()
      }, RETRY_MS)
    },
    teardownStream() {
      if (this.retryTimer) {
        clearTimeout(this.retryTimer)
        this.retryTimer = null
      }
      if (this.hls) {
        this.hls.destroy()
        this.hls = null
      }
      const video = this.videoEl()
      if (video) {
        video.pause()
        video.removeAttribute('src')
        video.load()
      }
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
  background: rgb(30, 30, 30);
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

.sai-live-page__tap {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border: 0;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-family: var(--font-home-en);
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.sai-live-page__audio-toggle {
  position: absolute;
  right: 1rem;
  bottom: max(1rem, env(safe-area-inset-bottom, 0px));
  z-index: 2;
  margin: 0;
  padding: 0.55rem 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-family: var(--font-home-en);
  font-size: 0.8125rem;
  font-weight: 400;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
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

.sai-live-page__video {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: rgb(30, 30, 30);
}
</style>
