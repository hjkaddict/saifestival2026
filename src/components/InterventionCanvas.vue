<template>
  <canvas ref="canvasRef" class="fg-canvas"></canvas>
</template>

<script>
import { getVisibleViewportHeight } from '@/utils/viewport.js'

export default {
  name: 'InterventionCanvas',
  data() {
    return {
      ctx: null,
      timer: null,
      lines: [],
    }
  },
  watch: {
    '$route.path': {
      immediate: true,
      handler(newPath) {
        if (newPath === '/') {
          this.startAnimation()
        } else {
          this.pauseAnimation()
          if (this.lines.length === 0) {
            this.generateLines()
          }
          this.render()
        }
      },
    },
  },
  mounted() {
    this.ctx = this.$refs.canvasRef.getContext('2d')
    window.addEventListener('resize', this.handleResize)
    window.addEventListener('app-vh-change', this.handleResize)
    // 스크롤 연동은 aboutScrollProgress를 갱신하는 화면에서 scroll-canvas만 보냄 (중복 render 방지)
    window.addEventListener('scroll-canvas', this.render)
    window.addEventListener('menu-hover-start', this.pauseAnimation)
    window.addEventListener('menu-hover-end', this.resumeFromHover)

    this.handleResize()

    if (this.$route.path === '/') {
      this.startAnimation()
    }
  },
  beforeUnmount() {
    this.pauseAnimation()
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('app-vh-change', this.handleResize)
    window.removeEventListener('scroll-canvas', this.render)
    window.removeEventListener('menu-hover-start', this.pauseAnimation)
    window.removeEventListener('menu-hover-end', this.resumeFromHover)
  },
  methods: {
    resumeFromHover() {
      if (this.$route.path === '/') {
        this.startAnimation()
      }
    },
    generateLines() {
      const w = window.innerWidth
      const h = getVisibleViewportHeight()
      const centerX = w / 2
      const centerY = h / 2
      const lineCount = 3 + Math.floor(Math.random() * 5)
      this.lines = []

      for (let i = 0; i < lineCount; i++) {
        const angleRad = (Math.random() * 80 - 40) * (Math.PI / 180)
        const lineLength = Math.max(w, h) * (Math.random() < 0.4 ? 0.4 : 2)
        const targetX = centerX + (Math.random() * 400 - 200)
        const targetY = centerY + (Math.random() * 400 - 200)

        this.lines.push({
          startX: targetX - Math.sin(angleRad) * (lineLength / 2),
          startY: targetY - Math.cos(angleRad) * (lineLength / 2),
          angleRad,
          length: lineLength,
          lineWidth: 1 + Math.random() * 15,
          speedFactor: 0.5 + Math.random() * 2,
          direction: Math.random() > 0.5 ? 1 : -1,
          wobbleSeed: Math.random() * 500,
          wobbleAmp: 4 + Math.random() * 16,
          wobbleFreq: 1.5 + Math.random() * 4,
        })
      }
    },
    handleResize() {
      if (!this.$refs.canvasRef) return
      this.$refs.canvasRef.width = window.innerWidth
      this.$refs.canvasRef.height = getVisibleViewportHeight()
      this.render()
    },
    startAnimation() {
      if (this.timer) return

      const loop = () => {
        this.generateLines()
        this.render()
        const randomDelay = Math.random() * (400 - 10) + 10
        this.timer = setTimeout(loop, randomDelay)
      }

      loop()
    },
    pauseAnimation() {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
    },
    hash1d(n, seed) {
      const x = Math.sin(n * 12.9898 + seed * 78.233) * 43758.5453
      return x - Math.floor(x)
    },
    noise1d(x, seed) {
      const i = Math.floor(x)
      const f = x - i
      const u = f * f * (3 - 2 * f)
      return this.hash1d(i, seed) * (1 - u) + this.hash1d(i + 1, seed) * u
    },
    /** -1 ~ 1, 저·고주파를 섞어 torn edge 느낌 */
    organicNoise(t, seed, freq) {
      let v = 0
      let amp = 1
      let f = freq
      for (let o = 0; o < 3; o++) {
        v += this.noise1d(t * f + seed, seed + o * 19.17) * amp
        amp *= 0.48
        f *= 2.15
      }
      const micro = this.noise1d(t * freq * 11 + seed * 1.7, seed + 91) * 0.35
      return (v + micro) * 2 - 1
    },
    strokeWobblyLine(sX, sY, eX, eY, line) {
      const dx = eX - sX
      const dy = eY - sY
      const len = Math.hypot(dx, dy)
      if (len < 1) return

      const ux = dx / len
      const uy = dy / len
      const perpX = -uy
      const perpY = ux

      const step = Math.max(4, Math.min(10, line.lineWidth * 1.2))
      const segments = Math.max(2, Math.ceil(len / step))
      const amp = (line.wobbleAmp ?? 10) * (0.55 + line.lineWidth / 18)
      const seed = line.wobbleSeed ?? 0
      const freq = line.wobbleFreq ?? 2.5

      this.ctx.beginPath()
      for (let i = 0; i <= segments; i++) {
        const t = i / segments
        const bx = sX + ux * len * t
        const by = sY + uy * len * t
        const wobble = this.organicNoise(t, seed, freq)
        const x = bx + perpX * wobble * amp
        const y = by + perpY * wobble * amp
        if (i === 0) this.ctx.moveTo(x, y)
        else this.ctx.lineTo(x, y)
      }
      this.ctx.lineJoin = 'round'
      this.ctx.lineCap = 'butt'
      this.ctx.stroke()
    },
    render() {
      const canvas = this.$refs.canvasRef
      if (!canvas || !this.ctx) return
      const w = canvas.width
      const h = canvas.height
      const progress = window.aboutScrollProgress || 0

      this.ctx.clearRect(0, 0, w, h)

      this.lines.forEach((line) => {
        this.ctx.lineWidth = line.lineWidth
        this.ctx.strokeStyle = 'rgb(255, 255, 255)'

        const moveX = w * 0.2 * progress * line.speedFactor * line.direction
        const stretchDir = line.speedFactor > 1.2 ? 1 : -1
        const lengthVariation = line.length * (progress * 0.8) * stretchDir
        const currentLength = line.length + lengthVariation

        const sX = line.startX + moveX
        const sY = line.startY
        const eX = sX + Math.sin(line.angleRad) * currentLength
        const eY = sY + Math.cos(line.angleRad) * currentLength

        this.strokeWobblyLine(sX, sY, eX, eY, line)
      })
    },
  },
}
</script>

<style scoped>
.fg-canvas {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1900;
  width: 100vw;
  height: calc(var(--app-vh, 1vh) * 100);
  pointer-events: none;
  mix-blend-mode: difference !important;
}
</style>
