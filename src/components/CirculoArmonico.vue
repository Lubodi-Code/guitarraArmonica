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

// Ripple state
interface Ripple { id: string; x: number; y: number; ts: number }
const ripples = ref<Ripple[]>([])
function spawnRipple(x:number,y:number) {
  ripples.value.push({ id: Date.now()+ ':' + Math.random(), x, y, ts: Date.now() })
  setTimeout(() => { ripples.value = ripples.value.filter(r => Date.now() - r.ts < 480) }, 500)
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

function clickNota(n: string, p?: {x:number,y:number}) {
  if(p) spawnRipple(p.x, p.y)
  setNota(n as any)
}
</script>

<template>
  <div class="w-full flex flex-col items-center">
    <h2 class="text-xl font-semibold mb-2 tracking-wide">Círculo Armónico</h2>
    <div class="relative w-80 h-80 rounded-full border border-neutral-500/60 bg-neutral-900/60 shadow-inner overflow-hidden">
      <!-- Ripples -->
      <div class="absolute inset-0 pointer-events-none">
        <span v-for="r in ripples" :key="r.id" class="absolute block ripple"
          :style="{ left: (r.x-10)+'px', top: (r.y-10)+'px' }" />
      </div>
      <div
        v-for="p in posiciones" :key="p.nota"
        class="absolute flex items-center justify-center cursor-pointer select-none note-item"
        :class="nota===p.nota ? 'active' : ''"
        :style="{ left: (p.x - 22)+ 'px', top: (p.y - 22)+ 'px', '--h': p.hue }"
        @click="clickNota(p.nota, {x:p.x, y:p.y})"
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
.note-item { width:44px; height:44px; transition: transform .18s ease, filter .35s ease; }
.note-item .note-bg { width:100%; height:100%; transition: background .45s ease, transform .18s ease, box-shadow .4s ease; color:#fff; text-shadow:0 0 6px rgba(255,255,255,.55); }
.note-item .note-bg { background: radial-gradient(circle at 30% 30%, hsla(var(--h),100%,60%,0.9), hsla(calc(var(--h) + 40),100%,45%,0.55)); }
.note-item:hover { transform: scale(1.1); }
.note-item.active { transform: scale(1.18); }
.note-item.active .note-bg { box-shadow:0 0 0 3px rgba(255,255,255,.7); }

/* center pulse */
.center-display { transition: filter .4s ease; }
.center-display.pulse .nota-text { animation: centerPulse 420ms ease; }
@keyframes centerPulse { 0%{ transform:scale(1); opacity:0.6;} 40%{ transform:scale(1.18); opacity:1;} 100%{ transform:scale(1);} }

/* ripple */
.ripple { width:20px; height:20px; border-radius:50%; background:rgba(255,255,255,0.35); animation: ripple 480ms ease-out forwards; mix-blend-mode:screen; }
@keyframes ripple { 0%{ transform:translate(-50%,-50%) scale(.2); opacity:.75;} 70%{ opacity:.15;} 100%{ transform:translate(-50%,-50%) scale(2.8); opacity:0;} }
</style>
