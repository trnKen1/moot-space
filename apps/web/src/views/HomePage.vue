<template>
  <div class="stage" :style="sceneVars">
    <div class="scene">
      <!-- Placeholder 3D object -->
      <div class="cube">
        <div v-for="face in faces" :key="face" :class="['cube-face', face]"></div>
      </div>

      <!-- Menu tiles orbiting the cube on a tilted ring -->
      <nav class="orbit" aria-label="Main menu">
        <div
          v-for="(item, i) in menuItems"
          :key="item"
          class="orbit-arm"
          :style="{ animationDelay: `${(-ORBIT_SECONDS * i) / menuItems.length}s` }"
        >
          <button
            type="button"
            class="orbit-item"
            :style="{ animationDelay: `${(-ORBIT_SECONDS * i) / menuItems.length}s` }"
          >
            <span class="tile">{{ item }}</span>
          </button>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup>
// Tuning knobs for the scene
const CUBE_SIZE_PX = 140
const CUBE_SPIN_SECONDS = 12
const ORBIT_RADIUS_PX = 280
const ORBIT_SECONDS = 24
const ORBIT_TILT_DEG = 18

const faces = ['front', 'back', 'left', 'right', 'top', 'bottom']

// Placeholder menu options — not wired to routes yet
const menuItems = ['Explore', 'Spaces', 'Messages', 'Friends', 'Events', 'Settings']

const sceneVars = {
  '--cube-size': `${CUBE_SIZE_PX}px`,
  '--cube-spin': `${CUBE_SPIN_SECONDS}s`,
  '--orbit-radius': `${ORBIT_RADIUS_PX}px`,
  '--orbit-period': `${ORBIT_SECONDS}s`,
  '--orbit-tilt': `${ORBIT_TILT_DEG}deg`
}
</script>

<style scoped>
.stage {
  --tile-size: 96px;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  perspective: 1200px;
}

/* Everything below shares one 3D rendering context so tiles pass behind the cube */
.scene {
  position: relative;
  width: 0;
  height: 0;
  transform-style: preserve-3d;
}

/* Cube */
.cube {
  position: absolute;
  width: var(--cube-size);
  height: var(--cube-size);
  left: calc(var(--cube-size) / -2);
  top: calc(var(--cube-size) / -2);
  transform-style: preserve-3d;
  animation: cube-spin var(--cube-spin) linear infinite;
}

.cube-face {
  position: absolute;
  inset: 0;
  border: 1px solid var(--primary-hover);
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.35), rgba(217, 70, 239, 0.2));
  box-shadow: inset 0 0 30px var(--primary-glow);
}

.front  { transform: translateZ(calc(var(--cube-size) / 2)); }
.back   { transform: rotateY(180deg) translateZ(calc(var(--cube-size) / 2)); }
.right  { transform: rotateY(90deg) translateZ(calc(var(--cube-size) / 2)); }
.left   { transform: rotateY(-90deg) translateZ(calc(var(--cube-size) / 2)); }
.top    { transform: rotateX(90deg) translateZ(calc(var(--cube-size) / 2)); }
.bottom { transform: rotateX(-90deg) translateZ(calc(var(--cube-size) / 2)); }

@keyframes cube-spin {
  from { transform: rotateX(0deg) rotateY(0deg); }
  to   { transform: rotateX(360deg) rotateY(360deg); }
}

/* Orbit: tilt the ring plane, spin each arm around Y, then counter-rotate the
   tile by the same angle (and undo the tilt) so it always faces the viewer */
.orbit {
  position: absolute;
  transform-style: preserve-3d;
  transform: rotateX(calc(var(--orbit-tilt) * -1));
}

.orbit-arm {
  position: absolute;
  transform-style: preserve-3d;
  animation: orbit-arm var(--orbit-period) linear infinite;
}

.orbit-item {
  position: absolute;
  width: var(--tile-size);
  height: var(--tile-size);
  left: calc(var(--tile-size) / -2);
  top: calc(var(--tile-size) / -2);
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  animation: orbit-item var(--orbit-period) linear infinite;
}

@keyframes orbit-arm {
  from { transform: rotateY(0deg); }
  to   { transform: rotateY(360deg); }
}

@keyframes orbit-item {
  from { transform: translateZ(var(--orbit-radius)) rotateY(0deg) rotateX(var(--orbit-tilt)); }
  to   { transform: translateZ(var(--orbit-radius)) rotateY(-360deg) rotateX(var(--orbit-tilt)); }
}

.tile {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: var(--radius-md);
  background: var(--bg-surface);
  border: 1px solid var(--border-glow);
  box-shadow: var(--shadow-lg);
  color: var(--text-primary);
  font-size: 0.9rem;
  font-weight: 600;
  transition: var(--transition);
}

.orbit-item:hover .tile,
.orbit-item:focus-visible .tile {
  border-color: var(--primary-hover);
  box-shadow: var(--shadow-lg), 0 0 20px var(--primary-glow);
  transform: scale(1.08);
}

/* Hold the ring still while a tile is hovered/focused so it's easy to click */
.orbit:has(.orbit-item:hover, .orbit-item:focus-visible) :is(.orbit-arm, .orbit-item) {
  animation-play-state: paused;
}

@media (max-width: 700px) {
  .scene {
    transform: scale(0.6);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cube,
  .orbit-arm,
  .orbit-item {
    animation-play-state: paused;
  }
}
</style>
