<template>
  <svg
    class="venue-sketch-map"
    viewBox="0 0 480 360"
    role="img"
    :aria-label="labels.venue"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <filter id="sketch-rough" x="-2%" y="-2%" width="104%" height="104%">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" />
      </filter>
    </defs>

    <!-- paper grain -->
    <rect width="100%" height="100%" fill="#f4f1ea" />

    <!-- river -->
    <path
      class="sketch-line sketch-line--soft"
      d="M 0 248 C 80 220, 140 280, 220 255 S 360 210, 480 240"
      fill="none"
    />
    <text class="sketch-label sketch-label--river" x="28" y="272">{{ labels.river }}</text>

    <!-- blocks / blocks -->
    <rect
      class="sketch-block"
      x="36"
      y="44"
      width="72"
      height="48"
      rx="2"
      transform="rotate(-2 72 68)"
    />
    <text class="sketch-label" x="44" y="74">{{ labels.station }}</text>

    <rect class="sketch-block sketch-block--light" x="300" y="52" width="56" height="40" rx="1" />
    <rect class="sketch-block sketch-block--light" x="368" y="48" width="48" height="44" rx="1" />

    <!-- walk path -->
    <path
      class="sketch-route"
      d="M 108 88 C 132 96, 148 118, 162 138
         S 188 168, 204 182
         C 218 194, 232 198, 248 208
         S 278 228, 298 238
         C 318 248, 338 252, 358 258"
      fill="none"
    />
    <path
      class="sketch-route-arrow"
      d="M 352 252 L 368 258 L 354 266"
      fill="none"
    />
    <text class="sketch-label sketch-label--route" x="118" y="108">{{ labels.route }}</text>

    <!-- alley -->
    <path
      class="sketch-line"
      d="M 168 142 L 178 158 L 172 174 L 186 188"
      fill="none"
    />
    <text class="sketch-label sketch-label--small" x="188" y="168">{{ labels.alley }}</text>

    <!-- courtyard -->
    <ellipse class="sketch-zone" cx="228" cy="218" rx="34" ry="22" />
    <text class="sketch-label sketch-label--small" x="206" y="224">{{ labels.courtyard }}</text>

    <!-- square -->
    <rect
      class="sketch-zone sketch-zone--square"
      x="268"
      y="228"
      width="64"
      height="48"
      rx="3"
      transform="rotate(1.5 300 252)"
    />
    <text class="sketch-label sketch-label--small" x="278" y="258">{{ labels.square }}</text>

    <!-- venue -->
    <polygon
      class="sketch-venue"
      points="340,278 392,268 408,310 352,322"
    />
    <circle class="sketch-pin" cx="372" cy="292" r="7" />
    <text class="sketch-label sketch-label--venue" x="318" y="346">{{ labels.venue }}</text>

    <!-- loose scribbles -->
    <path
      class="sketch-line sketch-line--faint"
      d="M 52 300 Q 120 290 180 305 T 300 298"
      fill="none"
    />
    <path
      class="sketch-line sketch-line--faint"
      d="M 80 120 Q 100 108 124 112"
      fill="none"
    />
  </svg>
</template>

<script>
import { venueSketchLabels } from '@/assets/data/venueSketchMap.js'

export default {
  name: 'VenueSketchMap',
  props: {
    lang: {
      type: String,
      default: 'kr',
    },
  },
  computed: {
    labels() {
      return venueSketchLabels[this.lang] || venueSketchLabels.en
    },
  },
}
</script>

<style scoped>
.venue-sketch-map {
  display: block;
  width: 100%;
  height: 100%;
}

.sketch-line {
  stroke: #111;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  filter: url(#sketch-rough);
}

.sketch-line--soft {
  stroke: #666;
  stroke-width: 1.5;
  opacity: 0.55;
}

.sketch-line--faint {
  stroke: #999;
  stroke-width: 1;
  opacity: 0.35;
}

.sketch-block {
  fill: #fff;
  stroke: #111;
  stroke-width: 1.8;
  filter: url(#sketch-rough);
}

.sketch-block--light {
  fill: #eceae4;
  stroke-width: 1.2;
  opacity: 0.7;
}

.sketch-route {
  stroke: #111;
  stroke-width: 2.2;
  stroke-dasharray: 6 5;
  stroke-linecap: round;
  filter: url(#sketch-rough);
}

.sketch-route-arrow {
  stroke: #111;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.sketch-zone {
  fill: rgba(255, 255, 255, 0.5);
  stroke: #111;
  stroke-width: 1.6;
  filter: url(#sketch-rough);
}

.sketch-zone--square {
  fill: rgba(255, 240, 200, 0.35);
}

.sketch-venue {
  fill: #fff;
  stroke: #111;
  stroke-width: 2.4;
  filter: url(#sketch-rough);
}

.sketch-pin {
  fill: #ff2a2a;
  stroke: #111;
  stroke-width: 1.8;
}

.sketch-label {
  font-size: 13px;
  font-weight: 600;
  fill: #111;
  letter-spacing: -0.02em;
}

.sketch-label--small {
  font-size: 11px;
  font-weight: 500;
}

.sketch-label--river {
  font-size: 10px;
  fill: #666;
  font-weight: 500;
}

.sketch-label--route {
  font-size: 10px;
  font-weight: 500;
  fill: #444;
}

.sketch-label--venue {
  font-size: 14px;
  font-weight: 700;
}
</style>
