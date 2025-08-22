<script setup lang="ts">
import { quinta, cuarta, octava, circuloDeQuintas, useNotaSeleccionada } from '@/lib/notaStore'
const { nota } = useNotaSeleccionada()
</script>

<template>
  <div>
    <h3 class="font-semibold mb-2">Quintas y Octavas</h3>
    <div class="flex flex-wrap gap-2 text-sm mb-3">
      <div class="px-2 py-1 rounded border border-neutral-600/50 bg-neutral-800">Tónica: <strong>{{ nota }}</strong></div>
      <div class="px-2 py-1 rounded border border-neutral-600/50 bg-neutral-800">4ª: <strong>{{ cuarta }}</strong></div>
      <div class="px-2 py-1 rounded border border-neutral-600/50 bg-neutral-800">5ª: <strong>{{ quinta }}</strong></div>
      <div class="px-2 py-1 rounded border border-neutral-600/50 bg-neutral-800">8ª: <strong>{{ octava }}</strong></div>
    </div>
    <h4 class="text-xs uppercase tracking-wide text-neutral-500 mb-1">Círculo de quintas desde {{ nota }}</h4>
    <div class="flex flex-wrap gap-1">
      <span v-for="n in circuloDeQuintas" :key="n" class="px-2 py-0.5 rounded text-xs font-medium bg-neutral-900 border border-neutral-600/40" :class="n===nota? 'ring ring-white/60' : ''">{{ n }}</span>
    </div>
  </div>
</template>
