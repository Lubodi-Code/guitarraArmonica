<script setup lang="ts">
import { NOTAS, useNotaSeleccionada } from '@/lib/notaStore'
import { computed, ref, watch, nextTick } from 'vue'

const { nota, setNota } = useNotaSeleccionada()

// Posiciones circulares
const radius = 140
const center = { x: 160, y: 160 }
const posiciones = computed(() => NOTAS.map((n, i) => {
  const angle = (Math.PI * 2 * i) / NOTAS.length - Math.PI/2
  return {
    nota: n,
    x: center.x + radius * Math.cos(angle),
    y: center.y + radius * Math.sin(angle),
    hue: (i * 30) % 360
  }
}))

// Hue de la nota seleccionada (para matizar animaciones globales)
const selectedHue = computed(() => posiciones.value.find(p => p.nota === nota.value)?.hue ?? 0)

// Ripple state
interface Ripple { id: string; x: number; y: number; ts: number }
const ripples = ref<Ripple[]>([])
function spawnRipple(x:number,y:number) {
  ripples.value.push({ id: Date.now()+ ':' + Math.random(), x, y, ts: Date.now() })
  setTimeout(() => { ripples.value = ripples.value.filter(r => Date.now() - r.ts < 480) }, 500)
}

// Burst particles
interface Particle { id: string; x: number; y: number; dx: number; dy: number; h: number; ts: number }
const particles = ref<Particle[]>([])
function spawnBurst(x: number, y: number, h: number) {
  const count = 10
  for (let i = 0; i < count; i++) {
    const ang = (Math.PI * 2 * (i / count)) + (Math.random() * 0.6 - 0.3)
    const speed = 52 + Math.random() * 24
    const dx = Math.cos(ang) * speed
    const dy = Math.sin(ang) * speed
    particles.value.push({ id: 'pt-' + Date.now() + '-' + i + '-' + Math.random(), x, y, dx, dy, h, ts: Date.now() })
  }
  setTimeout(() => {
    const now = Date.now()
    particles.value = particles.value.filter(p => now - p.ts < 700)
  }, 740)
}

// Center pulse
const centerRef = ref<HTMLDivElement | null>(null)
function pulseCenter() {
  if(!centerRef.value) return
  centerRef.value.classList.remove('pulse')
  void centerRef.value.getBoundingClientRect()
  centerRef.value.classList.add('pulse')
}

watch(() => nota.value, () => { nextTick(pulseCenter) })

function clickNota(n: string, p?: {x:number,y:number,h?:number}) {
  if(p) {
    spawnRipple(p.x, p.y)
    spawnBurst(p.x, p.y, p.h ?? 0)
  }
  setNota(n as any)
}
</script>

<template>
  <div class="w-full flex flex-col items-center">
    <h2 class="text-xl font-semibold mb-2 tracking-wide">Círculo Armónico</h2>
    <div class="relative w-80 h-80 rounded-full border border-neutral-500/60 bg-neutral-900/60 shadow-inner overflow-hidden has-active"
         :style="{ '--h': selectedHue }">
      <!-- Ripples -->
      <div class="absolute inset-0 pointer-events-none">
        <span v-for="r in ripples" :key="r.id" class="absolute block ripple"
          :style="{ left: (r.x-10)+'px', top: (r.y-10)+'px' }" />
      </div>
      <!-- Particles -->
      <div class="absolute inset-0 pointer-events-none">
        <span v-for="p in particles" :key="p.id" class="absolute block particle"
          :style="{ left: p.x+'px', top: p.y+'px', '--dx': p.dx + 'px', '--dy': p.dy + 'px', '--h': p.h }" />
      </div>
      <div
        v-for="p in posiciones" :key="p.nota"
        class="absolute flex items-center justify-center cursor-pointer select-none note-item"
        :class="nota===p.nota ? 'active' : ''"
        :style="{ left: (p.x - 22)+ 'px', top: (p.y - 22)+ 'px', '--h': p.hue }"
        @click="clickNota(p.nota, {x:p.x, y:p.y, h:p.hue})"
      >
        <div class="w-11 h-11 rounded-full text-xs font-bold flex items-center justify-center border border-white/10 shadow note-bg" >{{ p.nota }}</div>
      </div>
      <!-- Centro -->
      <div ref="centerRef" class="absolute inset-0 flex items-center justify-center pointer-events-none center-display">
        <div class="text-center text-sm text-neutral-300 center-text">
          <div class="uppercase tracking-widest text-xs text-neutral-500">Tónica</div>
          <div class="text-3xl font-black drop-shadow-neon nota-text">{{ nota }}</div>
        </div>
      </div>
    </div>
    <p class="mt-3 text-xs text-neutral-400 max-w-xs leading-snug">Haz click en una nota para generar relaciones y escalas diatónicas basadas en ella.</p>
  </div>
</template>

<style scoped>
.note-item { width:44px; height:44px; transition: transform .18s ease, filter .35s ease, opacity .25s ease; }
.note-item .note-bg { width:100%; height:100%; transition: background .45s ease, transform .18s ease, box-shadow .4s ease; color:#fff; text-shadow:0 0 6px rgba(255,255,255,.55); }
.note-item .note-bg { background: radial-gradient(circle at 30% 30%, hsla(var(--h),100%,60%,0.9), hsla(calc(var(--h) + 40),100%,45%,0.55)); }
.note-item:hover { transform: scale(1.1); }
.note-item.active { transform: scale(1.18); animation: pop 360ms cubic-bezier(.2,1.2,.2,1) both; }
.note-item.active .note-bg { box-shadow:0 0 0 3px rgba(255,255,255,.7); position: relative; }
.note-item.active .note-bg::after { content:""; position:absolute; inset:-3px; border-radius:999px; background: conic-gradient(from 0deg, hsla(var(--h),100%,65%,.0), hsla(var(--h),100%,65%,.6), hsla(var(--h),100%,65%,0)); filter: blur(2px); animation: sweep 800ms ease-out; pointer-events:none; }

/* desaturación sutil del resto */
.has-active .note-item:not(.active) { opacity:.82; filter: saturate(.75); }

/* center pulse */
.center-display { transition: filter .4s ease; }
.center-display .nota-text { background: linear-gradient(90deg, hsl(var(--h) 100% 72%), hsl(calc(var(--h) + 50) 100% 68%)); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color: transparent; text-fill-color: transparent; filter: drop-shadow(0 0 6px hsl(var(--h) 100% 65% / .35)); }
.center-display.pulse .nota-text { animation: centerPulse 420ms ease, sheen 900ms ease-out; }
@keyframes centerPulse { 0%{ transform:scale(1); opacity:0.6;} 40%{ transform:scale(1.18); opacity:1;} 100%{ transform:scale(1);} }
@keyframes sheen { 0% { background-position:-120% 0; } 100% { background-position:220% 0; } }

/* ripple */
.ripple { width:20px; height:20px; border-radius:50%; background:rgba(255,255,255,0.35); animation: ripple 480ms ease-out forwards; mix-blend-mode:screen; }
@keyframes ripple { 0%{ transform:translate(-50%,-50%) scale(.2); opacity:.75;} 70%{ opacity:.15;} 100%{ transform:translate(-50%,-50%) scale(2.8); opacity:0;} }

/* particles */
.particle { width:6px; height:6px; border-radius:50%; background: radial-gradient(circle at 30% 30%, hsl(var(--h) 100% 70%), hsl(calc(var(--h) + 40) 100% 55%)); transform: translate(-50%, -50%); animation: particle 700ms ease-out forwards; box-shadow: 0 0 8px hsl(var(--h) 100% 70% / .7); }
@keyframes particle { 0% { opacity:.9; transform: translate(-50%, -50%) scale(.6); } 100% { opacity:0; transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1.1); } }

/* sweeps and pops */
@keyframes sweep { from { transform: rotate(0turn); opacity:.9; } to { transform: rotate(.6turn); opacity:0; } }
@keyframes pop { 0% { transform: scale(.9); } 60% { transform: scale(1.22); } 100% { transform: scale(1.18); } }
</style>
