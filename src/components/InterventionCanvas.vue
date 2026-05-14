<template>
  <canvas
    ref="canvasRef"
    class="fg-canvas"
    :class="canvasClass"
    :style="canvasStyle"
  ></canvas>
</template>

<script>
import { getVisibleViewportHeight } from '@/utils/viewport.js'

export default {
  name: 'InterventionCanvas',
  props: {
    contained: {
      type: Boolean,
      default: false,
    },
    blendMode: {
      type: String,
      default: 'difference',
    },
    strokeColor: {
      type: String,
      default: 'rgb(255, 255, 255)',
    },
    linesKey: {
      type: [String, Number],
      default: null,
    },
    clipTarget: {
      type: Object,
      default: null,
    },
    stack: {
      type: String,
      default: 'overlay',
      validator: (v) => ['under', 'overlay'].includes(v),
    },
  },
  data() {
    return {
      ctx: null,
      timer: null,
      lines: [],
    }
  },
  computed: {
    canvasClass() {
      return {
        'fg-canvas--contained': this.contained,
        'fg-canvas--under': this.stack === 'under',
        'fg-canvas--overlay': this.stack === 'overlay',
      }
    },
    canvasStyle() {
      return {
        mixBlendMode: this.blendMode,
      }
    },
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
    linesKey() {
      this.generateLines()
      this.render()
    },
    clipTarget: {
      immediate: true,
      handler() {
        this.$nextTick(() => this.updateClipPath())
      },
    },
  },
  mounted() {
    this.ctx = this.$refs.canvasRef.getContext('2d')
    window.addEventListener('resize', this.handleResize)
    window.addEventListener('app-vh-change', this.handleResize)
    window.addEventListener('scroll-canvas', this.onScrollCanvas)
    window.addEventListener('scroll', this.updateClipPath, { passive: true })
    window.addEventListener('menu-hover-start', this.pauseAnimation)
    window.addEventListener('menu-hover-end', this.resumeFromHover)

    this.$nextTick(() => {
      this.handleResize()
      if (this.contained && typeof ResizeObserver !== 'undefined') {
        const parent = this.$refs.canvasRef?.parentElement
        if (parent) {
          this._resizeObserver = new ResizeObserver(() => this.handleResize())
          this._resizeObserver.observe(parent)
        }
      }
      if (this.clipTarget && typeof ResizeObserver !== 'undefined') {
        this._clipObserver = new ResizeObserver(() => this.updateClipPath())
        this._clipObserver.observe(this.clipTarget)
      }
      if (this.contained && this.linesKey != null) {
        this.startOffsetTracking()
      }
      this.updateClipPath()
    })

    if (this.$route.path === '/') {
      this.startAnimation()
    }
  },
  beforeUnmount() {
    this.pauseAnimation()
    this._resizeObserver?.disconnect()
    this._resizeObserver = null
    this._clipObserver?.disconnect()
    this._clipObserver = null
    this.stopOffsetTracking()
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('app-vh-change', this.handleResize)
    window.removeEventListener('scroll-canvas', this.onScrollCanvas)
    window.removeEventListener('scroll', this.updateClipPath)
    window.removeEventListener('menu-hover-start', this.pauseAnimation)
    window.removeEventListener('menu-hover-end', this.resumeFromHover)
  },
  methods: {
    onScrollCanvas() {
      this.render()
      this.updateClipPath()
    },
    resumeFromHover() {
      if (this.$route.path === '/') {
        this.startAnimation()
      }
    },
    hashKey(key) {
      const s = String(key)
      let h = 2166136261
      for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i)
        h = Math.imul(h, 16777619)
      }
      return h >>> 0
    },
    createSeededRandom(seed) {
      let state = seed >>> 0
      return () => {
        state |= 0
        state = (state + 0x6d2b79f5) | 0
        let t = Math.imul(state ^ (state >>> 15), 1 | state)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
      }
    },
    randomFn() {
      if (this.linesKey == null) return Math.random
      if (!this._seededRandom || this._seededRandomKey !== this.linesKey) {
        this._seededRandomKey = this.linesKey
        this._seededRandom = this.createSeededRandom(this.hashKey(this.linesKey))
      }
      return this._seededRandom
    },
    generateLines() {
      const rand = this.randomFn()
      let w
      let h
      const useViewportLines = this.linesKey != null || !this.contained
      if (!useViewportLines && this.$refs.canvasRef) {
        w = Math.max(1, this.$refs.canvasRef.width)
        h = Math.max(1, this.$refs.canvasRef.height)
      } else {
        w = window.innerWidth
        h = getVisibleViewportHeight()
      }
      const centerX = w / 2
      const centerY = h / 2
      const lineCount = 3 + Math.floor(rand() * 5)
      this.lines = []

      for (let i = 0; i < lineCount; i++) {
        const angleRad = (rand() * 80 - 40) * (Math.PI / 180)
        const lineLength = Math.max(w, h) * (rand() < 0.4 ? 0.4 : 2)
        const targetX = centerX + (rand() * 400 - 200)
        const targetY = centerY + (rand() * 400 - 200)

        this.lines.push({
          startX: targetX - Math.sin(angleRad) * (lineLength / 2),
          startY: targetY - Math.cos(angleRad) * (lineLength / 2),
          angleRad,
          length: lineLength,
          lineWidth: 1 + rand() * 15,
          speedFactor: 0.5 + rand() * 2,
          direction: rand() > 0.5 ? 1 : -1,
          wobbleSeed: rand() * 500,
          wobbleAmp: 4 + rand() * 16,
          wobbleFreq: 1.5 + rand() * 4,
        })
      }
    },
    updateClipPath() {
      const canvas = this.$refs.canvasRef
      if (!canvas) return
      const el = this.clipTarget
      if (!el) {
        canvas.style.clipPath = ''
        return
      }
      const rect = el.getBoundingClientRect()
      const top = Math.max(0, rect.top)
      const right = Math.max(0, window.innerWidth - rect.right)
      const bottom = Math.max(0, window.innerHeight - rect.bottom)
      const left = Math.max(0, rect.left)
      canvas.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px)`
    },
    getContainedOffset() {
      const parent = this.$refs.canvasRef?.parentElement
      if (!parent) return { x: 0, y: 0 }
      const rect = parent.getBoundingClientRect()
      return { x: rect.left, y: rect.top }
    },
    startOffsetTracking() {
      this.stopOffsetTracking()
      const tick = () => {
        const parent = this.$refs.canvasRef?.parentElement
        if (parent) {
          const rect = parent.getBoundingClientRect()
          const key = `${rect.left}|${rect.top}|${rect.width}|${rect.height}`
          if (key !== this._offsetKey) {
            this._offsetKey = key
            this.render()
          }
        }
        this._offsetRaf = requestAnimationFrame(tick)
      }
      tick()
    },
    stopOffsetTracking() {
      if (this._offsetRaf) {
        cancelAnimationFrame(this._offsetRaf)
        this._offsetRaf = null
      }
      this._offsetKey = null
    },
    handleResize() {
      if (!this.$refs.canvasRef) return
      const canvas = this.$refs.canvasRef
      if (this.contained) {
        const parent = canvas.parentElement
        if (!parent) return
        canvas.width = Math.max(1, parent.clientWidth)
        canvas.height = Math.max(1, parent.clientHeight)
        if (this.linesKey == null) {
          this.generateLines()
        }
      } else {
        canvas.width = window.innerWidth
        canvas.height = getVisibleViewportHeight()
      }
      this.updateClipPath()
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

      const offset = this.contained && this.linesKey != null ? this.getContainedOffset() : { x: 0, y: 0 }
      const motionW = this.contained && this.linesKey != null ? window.innerWidth : w

      this.lines.forEach((line) => {
        this.ctx.lineWidth = line.lineWidth
        this.ctx.strokeStyle = this.strokeColor

        const moveX = motionW * 0.2 * progress * line.speedFactor * line.direction
        const stretchDir = line.speedFactor > 1.2 ? 1 : -1
        const lengthVariation = line.length * (progress * 0.8) * stretchDir
        const currentLength = line.length + lengthVariation

        const sX = line.startX + moveX - offset.x
        const sY = line.startY - offset.y
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
}
.fg-canvas--under {
  z-index: 8;
}
.fg-canvas--overlay {
  z-index: 12;
}
.fg-canvas--contained {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}
</style>
