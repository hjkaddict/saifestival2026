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
      muted
      playsinline
      webkit-playsinline
      disablepictureinpicture
      preload="auto"
      @playing="onPlaying"
      @loadeddata="onLoadedData"
      @waiting="onWaiting"
      @stalled="onStalled"
      @error="onVideoError"
    ></video>
  </main>
</template>

<script>
import { localeStore } from '@/store/locale.js'

const STREAM_M3U8 = 'https://live.saifestival.com/live/stream/index.m3u8'
const RETRY_MS = 1400
const PLAYLIST_POLL_MS = 700
const START_WATCHDOG_MS = 7000
const STALL_WATCHDOG_MS = 5000

let hlsModulePromise = null

function loadHlsModule() {
  if (!hlsModulePromise) {
    hlsModulePromise = import('hls.js')
  }
  return hlsModulePromise
}

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
      watchdogTimer: null,
      stallTimer: null,
      startGeneration: 0,
      destroyed: false,
      hasFrame: false,
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
      return !this.loading && !this.needsTap && this.hasFrame
    },
    audioToggleLabel() {
      if (this.isMuted) {
        return this.locale.lang === 'kr' ? '소리 켜기' : 'Unmute'
      }
      return this.locale.lang === 'kr' ? '소리 끄기' : 'Mute'
    },
  },
  mounted() {
    document.addEventListener('visibilitychange', this.onVisibilityChange)
    // Warm HLS chunk for Chromium/Firefox while native iOS skips it.
    loadHlsModule().catch(() => {})
    this.initStream()
  },
  beforeUnmount() {
    this.destroyed = true
    document.removeEventListener('visibilitychange', this.onVisibilityChange)
    this.teardownStream()
  },
  methods: {
    videoEl() {
      return this.$refs.video
    },
    streamUrl() {
      // Bust CDN / browser cache of a failed or empty playlist.
      return `${STREAM_M3U8}?t=${Date.now()}`
    },
    supportsNativeHls(video) {
      return video.canPlayType('application/vnd.apple.mpegurl') !== ''
    },
    async waitForPlaylist(url, maxAttempts = 8) {
      for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        if (this.destroyed) return false
        try {
          const response = await fetch(url, {
            cache: 'no-store',
            mode: 'cors',
          })
          if (response.ok) {
            const body = await response.text()
            if (body.includes('#EXTM3U')) return true
          }
        } catch {
          // keep polling
        }
        await new Promise((resolve) => {
          window.setTimeout(resolve, PLAYLIST_POLL_MS)
        })
      }
      return false
    },
    async initStream({ waitForReady = false } = {}) {
      const video = this.videoEl()
      if (!video || this.destroyed) return

      const generation = ++this.startGeneration
      this.loading = true
      this.needsTap = false
      this.hasFrame = false
      this.clearWatchdogs()

      video.autoplay = true
      video.muted = true
      video.defaultMuted = true
      video.playsInline = true
      video.setAttribute('playsinline', '')
      video.setAttribute('webkit-playsinline', '')
      video.controls = false

      const url = this.streamUrl()
      // First visit: start immediately. Retries: poll until playlist exists.
      if (waitForReady) {
        const ready = await this.waitForPlaylist(url)
        if (this.destroyed || generation !== this.startGeneration) return
        if (!ready) {
          this.scheduleRetry()
          return
        }
      }

      this.armStartWatchdog(generation)

      if (this.supportsNativeHls(video)) {
        video.src = url
        await this.tryPlay(false)
        return
      }

      try {
        const { default: Hls } = await loadHlsModule()
        if (this.destroyed || generation !== this.startGeneration) return

        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            startFragPrefetch: true,
            backBufferLength: 30,
            // Join closer to live edge for quicker first frame.
            liveSyncDurationCount: 2,
            liveMaxLatencyDurationCount: 8,
            maxBufferLength: 12,
            maxMaxBufferLength: 24,
            manifestLoadingTimeOut: 8000,
            manifestLoadingMaxRetry: 4,
            levelLoadingTimeOut: 8000,
            levelLoadingMaxRetry: 4,
            fragLoadingTimeOut: 8000,
            fragLoadingMaxRetry: 4,
          })
          this.hls = hls

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            if (!this.destroyed && generation === this.startGeneration) {
              this.tryPlay(false)
            }
          })
          hls.on(Hls.Events.ERROR, (_, data) => {
            if (this.destroyed || generation !== this.startGeneration) return
            if (!data.fatal) {
              if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                hls.startLoad()
              } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                hls.recoverMediaError()
              }
              return
            }
            this.scheduleRetry()
          })
          hls.attachMedia(video)
          hls.loadSource(url)
          return
        }
      } catch {
        // fall through to native assignment
      }

      if (this.destroyed || generation !== this.startGeneration) return
      video.src = url
      await this.tryPlay(false)
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
          // browsers often block unmuted autoplay
        }
      }

      video.muted = true
      this.isMuted = true
      try {
        await video.play()
        this.needsTap = false
      } catch {
        this.needsTap = true
        this.loading = false
        this.clearWatchdogs()
      }
    },
    markStarted() {
      const video = this.videoEl()
      if (!video || this.destroyed) return
      if (video.videoWidth > 0 || video.readyState >= 2) {
        this.hasFrame = true
        this.loading = false
        this.needsTap = false
        this.clearWatchdogs()
      }
    },
    onPlaying() {
      this.markStarted()
    },
    onLoadedData() {
      this.markStarted()
    },
    onWaiting() {
      if (!this.hasFrame || this.destroyed) return
      this.armStallWatchdog()
    },
    onStalled() {
      if (this.destroyed) return
      this.armStallWatchdog()
    },
    onVideoError() {
      if (this.destroyed) return
      this.scheduleRetry()
    },
    onVisibilityChange() {
      if (this.destroyed || document.visibilityState !== 'visible') return
      const video = this.videoEl()
      if (!video) return
      if (video.paused || video.readyState < 2 || video.videoWidth === 0) {
        this.scheduleRetry(400)
      } else {
        video.play().catch(() => {})
      }
    },
    armStartWatchdog(generation) {
      this.clearStartWatchdog()
      this.watchdogTimer = window.setTimeout(() => {
        this.watchdogTimer = null
        if (this.destroyed || generation !== this.startGeneration) return
        if (!this.hasFrame) this.scheduleRetry(0)
      }, START_WATCHDOG_MS)
    },
    armStallWatchdog() {
      this.clearStallWatchdog()
      this.stallTimer = window.setTimeout(() => {
        this.stallTimer = null
        if (this.destroyed) return
        const video = this.videoEl()
        if (!video || video.paused) return
        // Still waiting / no dimensions after stall window → full reconnect.
        if (video.readyState < 3 || video.videoWidth === 0) {
          this.loading = true
          this.hasFrame = false
          this.scheduleRetry(0)
        }
      }, STALL_WATCHDOG_MS)
    },
    clearStartWatchdog() {
      if (this.watchdogTimer) {
        clearTimeout(this.watchdogTimer)
        this.watchdogTimer = null
      }
    },
    clearStallWatchdog() {
      if (this.stallTimer) {
        clearTimeout(this.stallTimer)
        this.stallTimer = null
      }
    },
    clearWatchdogs() {
      this.clearStartWatchdog()
      this.clearStallWatchdog()
    },
    toggleAudio() {
      const video = this.videoEl()
      if (!video || this.destroyed) return

      const nextMuted = !video.muted
      video.muted = nextMuted
      if (!nextMuted) video.volume = 1
      this.isMuted = nextMuted
      video.play().catch(() => {})
    },
    async startFromTap() {
      this.needsTap = false
      this.loading = true
      await this.tryPlay(true)
      if (this.videoEl()?.paused) {
        this.needsTap = true
        this.loading = false
      }
    },
    scheduleRetry(delay = RETRY_MS) {
      if (this.destroyed) return
      if (this.retryTimer) clearTimeout(this.retryTimer)
      this.retryTimer = window.setTimeout(() => {
        this.retryTimer = null
        if (this.destroyed) return
        this.loading = true
        this.needsTap = false
        this.hasFrame = false
        this.isMuted = true
        this.teardownStream({ keepRetry: true })
        this.initStream({ waitForReady: true })
      }, delay)
    },
    teardownStream({ keepRetry = false } = {}) {
      this.clearWatchdogs()
      if (!keepRetry && this.retryTimer) {
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
