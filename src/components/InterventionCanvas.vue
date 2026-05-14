<template>
  <canvas ref="canvasRef" class="fg-canvas"></canvas>
</template>

<script>
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
      const h = window.innerHeight
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
        })
      }
    },
    handleResize() {
      if (!this.$refs.canvasRef) return
      this.$refs.canvasRef.width = window.innerWidth
      this.$refs.canvasRef.height = window.innerHeight
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
    render() {
      const canvas = this.$refs.canvasRef
      if (!canvas || !this.ctx) return
      const w = canvas.width
      const h = canvas.height
      const progress = window.aboutScrollProgress || 0

      this.ctx.clearRect(0, 0, w, h)

      this.lines.forEach((line) => {
        this.ctx.beginPath()
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

        this.ctx.moveTo(sX, sY)
        this.ctx.lineTo(eX, eY)
        this.ctx.stroke()
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
  z-index: 999;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  mix-blend-mode: difference !important;
}
</style>
