<script setup lang="ts">
import { circuloDeQuintas, escalaMayor, conexiones, quinta, cuarta, octava, useNotaSeleccionada } from '@/lib/notaStore'
import { computed, ref, watch, nextTick } from 'vue'

const { nota, setNota } = useNotaSeleccionada()

// Configuración geométrica
const size = 460
const radius = 185
const center = { x: size/2, y: size/2 }
const nodeR = 20

interface Punto { nota: string; x: number; y: number; idx: number; hue: number }
const puntos = computed<Punto[]>(() => circuloDeQuintas.value.map((n,i) => {
  const angle = (Math.PI * 2 * i) / circuloDeQuintas.value.length - Math.PI/2
  return {
    nota: n,
    idx: i,
    x: center.x + radius * Math.cos(angle),
    y: center.y + radius * Math.sin(angle),
    hue: (i*30)%360
  }
}))

const gradosMap = computed(() => Object.fromEntries(escalaMayor.value.map(g => [g.nota, g.grado])))
function punto(n: string) { return puntos.value.find(p => p.nota === n)! }

// Flechas recalculadas dinámicamente con offsets
const flechas = computed(() => conexiones.value.map(c => ({
  from: punto(c.desde.nota),
  to: punto(c.hacia.nota),
  tipo: c.tipo
})))

// Paths derivados
const paths = computed(() => flechas.value.map((f,i) => ({
  key: `${f.tipo}-${f.from.nota}-${f.to.nota}-${i}`,
  d: curva(f.from, f.to),
  active: nota.value === f.from.nota || nota.value === f.to.nota,
  tipo: f.tipo
})))

// refs para animación stroke
const pathEls = ref<SVGPathElement[]>([])
function setPathEl(el: any, idx: number) { const node = el as SVGPathElement | null; if(node) pathEls.value[idx] = node }

// center pulse ref
const centerRef = ref<SVGCircleElement | null>(null)
function pulseCenter() {
  if(!centerRef.value) return
  centerRef.value.classList.remove('pulse')
  void centerRef.value.getBoundingClientRect()
  centerRef.value.classList.add('pulse')
}

// ripple state
const ripples = ref<{id:string,x:number,y:number,ts:number}[]>([])
function spawnRipple(notaClick: string) {
  const pt = punto(notaClick)
  ripples.value.push({ id: `${notaClick}-${Date.now()}`, x: pt.x, y: pt.y, ts: Date.now() })
  setTimeout(() => { ripples.value = ripples.value.filter(r => Date.now() - r.ts < 500) }, 520)
}

// panel fade key
const infoKey = ref(0)

watch(() => nota.value, async () => {
  infoKey.value++
  await nextTick()
  // animar líneas
  pathEls.value.forEach(p => {
    const len = p.getTotalLength()
    p.style.strokeDasharray = String(len)
    p.style.strokeDashoffset = String(len)
    void p.getBoundingClientRect()
    p.classList.add('drawing')
    requestAnimationFrame(() => { p.style.strokeDashoffset = '0' })
  })
  pulseCenter()
})

function offsetPoint(a: Punto, b: Punto, dist: number) {
  const dx = b.x - a.x, dy = b.y - a.y
  const len = Math.hypot(dx,dy) || 1
  return { x: a.x + (dx/len)*dist, y: a.y + (dy/len)*dist }
}

function curva(from: Punto, to: Punto) {
  // acorta inicio y final
  const start = offsetPoint(from, to, nodeR - 2)
  const end = offsetPoint(to, from, nodeR + 6) // deja espacio para la flecha
  const mx = (start.x + end.x)/2
  const my = (start.y + end.y)/2
  const vx = center.x - mx
  const vy = center.y - my
  const factor = 0.28
  const cx = mx + vx * factor
  const cy = my + vy * factor
  return `M ${start.x} ${start.y} Q ${cx} ${cy} ${end.x} ${end.y}`
}

const functionColors: Record<string,string> = {
  'I': 'hsla(200,100%,60%,0.9)',
  'IV': 'hsla(140,100%,55%,0.9)',
  'V': 'hsla(20,100%,60%,0.9)',
  'vi': 'hsla(300,100%,65%,0.9)'
}

function onClickNota(n: string) { spawnRipple(n); setNota(n as any) }
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold tracking-wide">Círculo de Quintas (Vista Gráfica)</h2>
    <div class="flex flex-col lg:flex-row gap-8">
      <div class="relative">
  <svg :viewBox="`0 0 ${size} ${size}`" preserveAspectRatio="xMidYMid meet" class="select-none responsive-svg">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="white" />
            </marker>
          </defs>

          <!-- Anillo exterior -->
          <circle :cx="center.x" :cy="center.y" :r="radius" class="fill-none stroke-neutral-700" stroke-dasharray="4 6" />

          <!-- Flechas conexiones (dibujadas antes de nodos para que queden detrás) -->
          <template v-for="(ps, idx) in paths" :key="ps.key">
            <g>
              <path :ref="el => setPathEl(el, idx)" :d="ps.d" stroke="white" stroke-width="1.6" fill="none" marker-end="url(#arrow)" :class="['harm-line', ps.active ? 'highlight' : '']" />
            </g>
          </template>

          <!-- Notas (nodos por encima de flechas) -->
          <template v-for="p in puntos" :key="p.nota">
            <g @click="onClickNota(p.nota)" class="cursor-pointer focus:outline-none" tabindex="0" role="button">
              <line :x1="center.x" :y1="center.y" :x2="p.x" :y2="p.y" class="stroke-neutral-800" stroke-width="1" />
              <g>
                <circle :cx="p.x" :cy="p.y" :r="nodeR" :fill="nota===p.nota? 'white' : 'black'" :stroke="nota===p.nota? '#fff' : `hsl(${p.hue} 100% 60%)`" :stroke-width="nota===p.nota? 3:2" :class="nota===p.nota? 'activeNode':''" />
                <circle :cx="p.x" :cy="p.y" :r="nodeR" :style="{ filter: `drop-shadow(0 0 6px hsl(${p.hue} 100% 55% / 0.9))` }" fill="transparent" />
                <text :x="p.x" :y="p.y+4" font-size="12" font-weight="700" text-anchor="middle" :fill="nota===p.nota? 'black':'white'">{{ p.nota }}</text>
                <text v-if="gradosMap[p.nota]" :x="p.x" :y="p.y+30" font-size="9" text-anchor="middle" :fill="functionColors[gradosMap[p.nota]] || '#888'" class="tracking-tight">{{ gradosMap[p.nota] }}</text>
              </g>
            </g>
          </template>

          <!-- Centro -->
          <circle ref="centerRef" :cx="center.x" :cy="center.y" r="52" class="fill-neutral-900 stroke-neutral-700 center-circle" />
          <text :x="center.x" :y="center.y-4" text-anchor="middle" font-size="11" fill="#888" class="uppercase tracking-widest">Tónica</text>
          <text :x="center.x" :y="center.y+20" text-anchor="middle" font-size="30" fill="white" class="font-black">{{ nota }}</text>

          <!-- Indicadores 4ª y 5ª -->
          <g>
            <circle v-if="quinta" :cx="punto(quinta).x" :cy="punto(quinta).y" r="30" class="fill-none stroke-cyan-400 stroke-[1.2] dash-ring" />
            <circle v-if="cuarta" :cx="punto(cuarta).x" :cy="punto(cuarta).y" r="30" class="fill-none stroke-fuchsia-400 stroke-[1.2] dash-ring" />
          </g>
          <!-- ripples -->
          <g>
            <circle v-for="r in ripples" :key="r.id" :cx="r.x" :cy="r.y" r="8" class="ripple" />
          </g>
        </svg>
        <div class="absolute bottom-2 left-2 text-[10px] text-neutral-500">Arcos: conexiones armónicas (I→IV→V→I, I→vi)</div>
      </div>
      <div class="flex-1 space-y-5">
  <div :key="infoKey" class="fade-panel">
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <div class="p-2 bg-neutral-900 border border-neutral-700 rounded">Tónica: <strong>{{ nota }}</strong></div>
            <div class="p-2 bg-neutral-900 border border-neutral-700 rounded">4ª: <strong>{{ cuarta }}</strong></div>
            <div class="p-2 bg-neutral-900 border border-neutral-700 rounded">5ª: <strong>{{ quinta }}</strong></div>
            <div class="p-2 bg-neutral-900 border border-neutral-700 rounded">8ª: <strong>{{ octava }}</strong></div>
          </div>
        </div>
        <div>
          <h3 class="font-semibold mb-2">Círculo de quintas desde {{ nota }}</h3>
          <div class="flex flex-wrap gap-1 text-xs">
            <span v-for="p in puntos" :key="p.nota" class="px-2 py-1 rounded border border-neutral-700" :style="{background: nota===p.nota? 'white':'#111', color: nota===p.nota? '#000':'#fff'}">{{ p.nota }}</span>
          </div>
        </div>
        <div>
          <h3 class="font-semibold mb-2">Escala Mayor</h3>
          <ul class="flex flex-wrap gap-2 text-xs fade-panel" :key="'escala-'+infoKey">
            <li v-for="g in escalaMayor" :key="g.grado" class="px-2 py-1 rounded bg-neutral-900 border border-neutral-700">
              <span class="font-mono text-[10px] text-neutral-500 mr-1">{{ g.grado }}</span>{{ g.acorde }}
            </li>
          </ul>
        </div>
        <div>
          <h3 class="font-semibold mb-2">Leyenda</h3>
          <ul class="text-[10px] space-y-1 text-neutral-400">
            <li><span class="inline-block w-3 h-3 rounded-full mr-1" style="background:hsla(200,100%,60%,0.9)"></span>I (Tónica)</li>
            <li><span class="inline-block w-3 h-3 rounded-full mr-1" style="background:hsla(140,100%,55%,0.9)"></span>IV (Subdominante)</li>
            <li><span class="inline-block w-3 h-3 rounded-full mr-1" style="background:hsla(20,100%,60%,0.9)"></span>V (Dominante)</li>
            <li><span class="inline-block w-3 h-3 rounded-full mr-1" style="background:hsla(300,100%,65%,0.9)"></span>vi (Relativa menor)</li>
            <li>Arcos blancos: flujos armónicos básicos.</li>
            <li>Corona cian: quinta | Corona fucsia: cuarta.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
text { font-family: system-ui, Helvetica, Arial, sans-serif; }

circle { transition: transform 160ms ease, opacity 140ms ease, fill 320ms ease, stroke 320ms ease; }
.activeNode { transform-origin: center; transform: scale(1.1); }
g[role="button"] circle:not(.activeNode):hover { transform: scale(1.07); }

.responsive-svg { display:block; width: 420px; height: 420px; max-width: 100%; overflow: visible; }
.relative { overflow: visible; }

/* Líneas con dibujo progresivo */
.harm-line { opacity:.85; stroke-linecap:round; stroke-linejoin:round; }
.harm-line.drawing { transition: stroke-dashoffset 650ms cubic-bezier(.25,.9,.3,1); }
.harm-line.highlight { filter: drop-shadow(0 0 4px rgba(255,255,255,.55)); }

/* Centro pulse */
.center-circle { transform-origin:center; }
.center-circle.pulse { animation: pulse 420ms ease-out; }
@keyframes pulse { 0% { transform:scale(1); box-shadow:0 0 0 0 rgba(255,255,255,.35);} 55% { transform:scale(1.12); box-shadow:0 0 0 14px rgba(255,255,255,0);} 100% { transform:scale(1);} }

/* Ripple */
.ripple { fill: rgba(255,255,255,0.25); animation: ripple 540ms ease-out forwards; pointer-events:none; }
@keyframes ripple { 0% { r:4; opacity:.55;} 70% {opacity:.18;} 100% { r:44; opacity:0;} }

/* Dash rings animation */
.dash-ring { stroke-dasharray:4 3; animation: dash 6s linear infinite; }
@keyframes dash { to { stroke-dashoffset:140; } }

/* Panel fade */
.fade-panel { animation: fadeSwap 300ms ease; }
@keyframes fadeSwap { from { opacity:0; transform:translateY(4px);} to { opacity:1; transform:translateY(0);} }
</style>
