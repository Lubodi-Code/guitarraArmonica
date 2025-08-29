<script setup lang="ts">
import { quinta, cuarta, octava, circuloDeQuintas, useNotaSeleccionada, NOTAS } from '@/lib/notaStore'
import { computed } from 'vue'
const { nota } = useNotaSeleccionada()
const hue = computed(() => (NOTAS.indexOf(nota.value) * 30) % 360)
const hueBy = (n: string) => (NOTAS.indexOf(n as any) * 30) % 360
</script>

<template>
  <div>
    <h3 class="font-semibold mb-2">Quintas y Octavas</h3>
    <div :key="nota" class="flex flex-wrap gap-2 text-sm mb-3 fade-panel" :style="{ '--h': hue }">
      <div class="stat">Tónica: <strong>{{ nota }}</strong></div>
      <div class="stat" :style="{ '--h': hueBy(cuarta) }">4ª: <strong>{{ cuarta }}</strong></div>
      <div class="stat" :style="{ '--h': hueBy(quinta) }">5ª: <strong>{{ quinta }}</strong></div>
      <div class="stat" :style="{ '--h': hueBy(octava) }">8ª: <strong>{{ octava }}</strong></div>
    </div>
    <h4 class="text-xs uppercase tracking-wide text-neutral-500 mb-1">Círculo de quintas desde {{ nota }}</h4>
    <div class="flex flex-wrap gap-1">
      <span v-for="n in circuloDeQuintas" :key="n" class="chip" :class="n===nota? 'active-chip' : ''" :style="{ '--h': hueBy(n) }">{{ n }}</span>
    </div>
  </div>
</template>

<style scoped>
.fade-panel { animation: fadeSwap 300ms ease; }
@keyframes fadeSwap { from { opacity:0; transform:translateY(4px);} to { opacity:1; transform:translateY(0);} }

.stat { padding: 4px 8px; border-radius: 8px; border: 1px solid rgba(120,120,120,.45); background: #1a1a1a; box-shadow: inset 0 0 0 2px hsl(var(--h) 100% 65% / .12); }

.chip { padding: 2px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; background: #0f0f0f; border: 1px solid rgba(120,120,120,.35); transition: transform .18s ease, box-shadow .3s ease, border-color .3s ease; }
.chip:hover { transform: translateY(-1px); }
.active-chip { background: radial-gradient(circle at 30% 30%, hsl(var(--h) 100% 70% / .95), hsl(calc(var(--h) + 40) 100% 55% / .7)); color: #000; border-color: rgba(255,255,255,.8); animation: chipPop 320ms cubic-bezier(.2,1.2,.2,1) both; box-shadow: 0 0 0 3px rgba(255,255,255,.65); }
@keyframes chipPop { 0% { transform: scale(.9);} 60% { transform: scale(1.12);} 100% { transform: scale(1);} }
</style>
