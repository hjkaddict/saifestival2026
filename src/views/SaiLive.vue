<template>
  <main class="sai-live-page" aria-label="SA–I CCTV">
    <iframe
      class="sai-live-page__frame"
      :src="streamSrc"
      title="SA–I CCTV"
      allow="autoplay; fullscreen"
      referrerpolicy="no-referrer"
    ></iframe>
  </main>
</template>

<script>
const STREAM_BASE = 'https://live.saifestival.com/live/stream/'

export default {
  name: 'SaiLive',
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

.sai-live-page__frame {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
