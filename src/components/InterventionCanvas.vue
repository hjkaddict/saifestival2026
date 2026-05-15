<template>
  <canvas ref="canvasRef" class="fg-canvas" :class="canvasClass" :style="canvasStyle"></canvas>
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
      lines: [],
      _animRafId: null,
      /** 멈춘 순간의 논리 애니 시간(초). 재개 시 offset과 맞춰 연속으로 이어짐 */
      _pauseAnimT: null,
      /** 논리 시간 t = performance.now()/1000 - _animClockOffset */
      _animClockOffset: 0,
      _homeStartTimer: null,
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
      handler(newPath, oldPath) {
        const contained = this.contained
        if (newPath === '/') {
          if (!contained) this.generateLines()
          if (oldPath != null && oldPath !== '/') {
            this._pauseAnimT = null
            this._animClockOffset = 0
          }
          this.scheduleHomeAnimation()
        } else {
          this.cancelHomeAnimationSchedule()
          this.pauseAnimation()
          if (!contained && this.lines.length === 0) {
            this.generateLines()
          } else if (contained && this.lines.length === 0) {
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
      this.scheduleHomeAnimation()
    }
  },
  beforeUnmount() {
    this.cancelHomeAnimationSchedule()
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
    isMobileViewport() {
      return window.innerWidth < 768
    },
    homeIntroDelayMs() {
      /* 모바일: 샤드 펼침과 같이 시작(메뉴·3D 부하는 1.5s 뒤로 분리) */
      return this.isMobileViewport() ? 80 : 0
    },
    scheduleHomeAnimation() {
      this.cancelHomeAnimationSchedule()
      if (this.$route.path !== '/' || this.contained) return
      const delay = this.homeIntroDelayMs()
      if (delay === 0) {
        this.startAnimation()
        return
      }
      this._homeStartTimer = setTimeout(() => {
        this._homeStartTimer = null
        if (this.$route.path === '/') this.startAnimation()
      }, delay)
    },
    cancelHomeAnimationSchedule() {
      if (this._homeStartTimer != null) {
        clearTimeout(this._homeStartTimer)
        this._homeStartTimer = null
      }
    },
    onScrollCanvas() {
      this.render()
      this.updateClipPath()
    },
    resumeFromHover() {
      if (this.$route.path === '/') {
        this.scheduleHomeAnimation()
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
      const lineCount = 3 + Math.floor(rand() * 3)
      this.lines = []

      for (let i = 0; i < lineCount; i++) {
        const angleBase = (rand() * 80 - 40) * (Math.PI / 180)
        const lengthBase = Math.max(w, h) * (rand() < 0.4 ? 0.4 : 2)
        const targetX = centerX + (rand() * 400 - 200)
        const targetY = centerY + (rand() * 400 - 200)

        const widthBase = 1 + rand() * 15
        const wobbleAmpBase = 4 + rand() * 16

        this.lines.push({
          centerX: targetX,
          centerY: targetY,
          angleBase,
          lengthBase,
          widthBase,
          wobbleAmpBase,
          lengthAmp: lengthBase * (0.06 + rand() * 0.14),
          lengthOmega: (2 * Math.PI) / (10 + rand() * 18),
          lengthPhase: rand() * Math.PI * 2,
          widthAmp: 1.2 + rand() * 7,
          widthOmega: (2 * Math.PI) / (4 + rand() * 10),
          widthPhase: rand() * Math.PI * 2,
          widthMin: 0.6,
          widthMax: Math.min(24, widthBase + 8),
          angleAmp: ((rand() * 24 - 12) * Math.PI) / 180,
          angleOmega: (2 * Math.PI) / (6 + rand() * 14),
          anglePhase: rand() * Math.PI * 2,
          wobbleAmpMod: 0.35 + rand() * 0.45,
          wobbleAmpOmega: (2 * Math.PI) / (7 + rand() * 14),
          wobbleAmpPhase: rand() * Math.PI * 2,
          driftAmp: 3 + rand() * 10,
          driftOmega: (2 * Math.PI) / (20 + rand() * 25),
          driftPhase: rand() * Math.PI * 2,
          driftAngle: rand() * Math.PI * 2,
          speedFactor: 0.5 + rand() * 2,
          direction: rand() > 0.5 ? 1 : -1,
          wobbleSeed: rand() * 500,
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
        if (this.lines.length === 0 || this.$route.path === '/') {
          this.generateLines()
        }
      }
      this.updateClipPath()
      this.render()
    },
    startAnimation() {
      if (this._animRafId != null) return
      if (this.lines.length === 0) {
        this.generateLines()
      }
      if (this._pauseAnimT != null) {
        this._animClockOffset = performance.now() * 0.001 - this._pauseAnimT
      }
      const loop = () => {
        this._animRafId = requestAnimationFrame(loop)
        this.render()
      }
      this._animRafId = requestAnimationFrame(loop)
    },
    pauseAnimation() {
      if (this._animRafId != null) {
        this._pauseAnimT = performance.now() * 0.001 - this._animClockOffset
        cancelAnimationFrame(this._animRafId)
        this._animRafId = null
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
    strokeGlowRgba(color, alpha) {
      const c = color
      if (typeof c !== 'string') return `rgba(255,255,255,${alpha})`
      const rgba = c.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i)
      if (rgba) {
        return `rgba(${rgba[1]},${rgba[2]},${rgba[3]},${alpha})`
      }
      const hex = c.match(/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i)
      if (hex) {
        return `rgba(${parseInt(hex[1], 16)},${parseInt(hex[2], 16)},${parseInt(hex[3], 16)},${alpha})`
      }
      const m = c.match(/\d+/g)
      if (m && m.length >= 3) {
        return `rgba(${Number(m[0])},${Number(m[1])},${Number(m[2])},${alpha})`
      }
      return `rgba(255,255,255,${alpha})`
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

      const step = Math.max(5, Math.min(12, line.lineWidth * 1.35))
      const segments = Math.max(2, Math.ceil(len / step))
      const amp = (line.wobbleAmp ?? 10) * (0.55 + line.lineWidth / 18)
      const seed = line.wobbleSeed ?? 0
      const freq = line.wobbleFreq ?? 2.5

      const path = new Path2D()
      for (let i = 0; i <= segments; i++) {
        const segT = i / segments
        const bx = sX + ux * len * segT
        const by = sY + uy * len * segT
        const wobble = this.organicNoise(segT, seed, freq)
        const x = bx + perpX * wobble * amp
        const y = by + perpY * wobble * amp
        if (i === 0) path.moveTo(x, y)
        else path.lineTo(x, y)
      }

      const lw = line.lineWidth
      const stroke = line.strokeColor ?? this.strokeColor

      this.ctx.save()
      this.ctx.lineJoin = 'round'
      this.ctx.lineCap = 'round'
      this.ctx.shadowBlur = 0
      this.ctx.strokeStyle = stroke
      this.ctx.lineWidth = lw

      if (!this.isMobileViewport()) {
        const glow = (a) => this.strokeGlowRgba(stroke, a)
        this.ctx.strokeStyle = glow(0.13)
        this.ctx.lineWidth = lw * 1.75
        this.ctx.shadowBlur = Math.min(14, 5 + lw * 0.5)
        this.ctx.shadowColor = glow(0.36)
        this.ctx.stroke(path)

        this.ctx.strokeStyle = glow(0.26)
        this.ctx.lineWidth = lw * 1.12
        this.ctx.shadowBlur = Math.min(5, 1.5 + lw * 0.22)
        this.ctx.shadowColor = glow(0.28)
        this.ctx.stroke(path)

        this.ctx.shadowBlur = 0
        this.ctx.strokeStyle = stroke
        this.ctx.lineWidth = lw
      }

      this.ctx.stroke(path)
      this.ctx.restore()
    },
    render() {
      const canvas = this.$refs.canvasRef
      if (!canvas || !this.ctx) return
      const w = canvas.width
      const h = canvas.height
      const progress = window.aboutScrollProgress || 0

      this.ctx.clearRect(0, 0, w, h)

      const offset =
        this.contained && this.linesKey != null ? this.getContainedOffset() : { x: 0, y: 0 }
      const motionW = this.contained && this.linesKey != null ? window.innerWidth : w

      const animActive = this._animRafId != null
      const t = animActive
        ? performance.now() * 0.001 - this._animClockOffset
        : (this._pauseAnimT ?? 0)

      this.lines.forEach((line) => {
        const len =
          line.lengthBase + Math.sin(t * line.lengthOmega + line.lengthPhase) * line.lengthAmp
        const angle =
          line.angleBase + Math.sin(t * line.angleOmega + line.anglePhase) * line.angleAmp
        const lw = Math.max(
          line.widthMin,
          Math.min(
            line.widthMax,
            line.widthBase + Math.sin(t * line.widthOmega + line.widthPhase) * line.widthAmp,
          ),
        )
        const wobbleAmp =
          line.wobbleAmpBase *
          (1 + Math.sin(t * line.wobbleAmpOmega + line.wobbleAmpPhase) * line.wobbleAmpMod)

        const driftX = Math.sin(t * line.driftOmega + line.driftPhase) * line.driftAmp
        const driftY = Math.cos(t * line.driftOmega * 0.9 + line.driftAngle) * line.driftAmp * 0.65

        this.ctx.lineWidth = lw

        const moveX = motionW * 0.2 * progress * line.speedFactor * line.direction
        const stretchDir = line.speedFactor > 1.2 ? 1 : -1
        const scrollStretch = len * progress * 0.12 * stretchDir
        const currentLength = len + scrollStretch

        const half = currentLength * 0.5
        const ux = Math.sin(angle)
        const uy = Math.cos(angle)
        const cx = line.centerX + moveX + driftX - offset.x
        const cy = line.centerY + driftY - offset.y
        const sX = cx - ux * half
        const sY = cy - uy * half
        const eX = cx + ux * half
        const eY = cy + uy * half

        this.strokeWobblyLine(sX, sY, eX, eY, { ...line, lineWidth: lw, wobbleAmp })
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
