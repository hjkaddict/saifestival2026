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
    window.addEventListener('scroll', this.render)
    window.addEventListener('scroll-canvas', this.render)
    this.handleResize()

    if (this.$route.path === '/') {
      this.startAnimation()
    }
  },
  beforeUnmount() {
    this.pauseAnimation()
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('scroll', this.render)
    window.removeEventListener('scroll-canvas', this.render)
  },
  methods: {
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
          angleRad: angleRad,
          length: lineLength,
          lineWidth: 1 + Math.random() * 12,
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
      this.timer = setInterval(() => {
        this.generateLines()
        this.render()
      }, 300)
    },
    pauseAnimation() {
      if (this.timer) {
        clearInterval(this.timer)
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

        // 🔥 반전 효과의 핵심: 흰색으로 그립니다.
        // difference 모드에 의해 흰 배경에서는 검은색으로 반전됩니다.
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
  width: 100vw;
  height: 100vh;
  /* 🔥 z-index를 router-stage(10)보다 높게 설정 */
  z-index: 999;
  pointer-events: none;
  /* 🔥 핵심: 아래 요소들과 색상을 반전시킴 */
  mix-blend-mode: difference !important;
}
</style>
