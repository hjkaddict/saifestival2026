<template>
  <div class="about-container">
    <article class="about-text-wrapper" :key="locale.lang">
      <div class="description-text">
        {{ aboutContent }}
      </div>
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
    window.aboutScrollProgress = 0
  },
  methods: {
    handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? scrollTop / docHeight : 0
      window.aboutScrollProgress = progress
      window.dispatchEvent(new Event('scroll-canvas'))
    },
  },
}
</script>

<style scoped>
.about-container {
  width: 100%;
  min-height: 100vh;
  padding: 20vh 10vw;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 10;
  /* 배경이 투명하면 반전이 일어나지 않으므로 흰색 지정 */
  background-color: #fff;
}

.description-text {
  font-size: 1rem;
  line-height: 1.5;
  color: #000; /* 검은색 글자 */
  white-space: pre-wrap;
  word-break: keep-all;
  font-weight: 400;
}
</style>
