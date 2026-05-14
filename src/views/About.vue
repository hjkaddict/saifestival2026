<template>
  <div class="about-container">
    <article class="about-text-wrapper" :key="locale.lang">
      <div class="description-text" v-html="aboutContent"></div>
    </article>
  </div>
</template>

<script>
import { localeStore } from '@/store/locale.js'
import { aboutData } from '@/assets/data/about.js'

export default {
  name: 'AboutView',
  data() {
    return {
      locale: localeStore,
      _scrollRafId: null,
    }
  },
  computed: {
    aboutContent() {
      return aboutData[this.locale.lang]
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
.about-container {
  width: 100%;
  min-height: calc(var(--app-vh, 1vh) * 100);
  padding: 20vh 10vw;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 10;
  /* 배경이 투명하면 반전이 일어나지 않으므로 흰색 지정 */
  background-color: #fff;
}

.about-text-wrapper {
  width: 100%;
  max-width: 42rem;
  margin: 0 auto;
}

.description-text {
  font-size: 1rem;
  line-height: 1.5;
  color: #000;
  white-space: pre-wrap;
  word-break: keep-all;
  font-weight: 400;
  text-align: center;
}
</style>
