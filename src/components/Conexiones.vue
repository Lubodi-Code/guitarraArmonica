<script setup lang="ts">
import { conexiones, useNotaSeleccionada } from '@/lib/notaStore'
const { nota } = useNotaSeleccionada()
</script>

<template>
  <div>
    <h3 class="font-semibold mb-2">Conexiones Armónicas</h3>
    <ul class="text-sm space-y-1">
      <li v-for="c in conexiones" :key="c.tipo" class="flex items-center gap-2">
        <span class="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-600/50">{{ c.desde.acorde }}</span>
        <span class="text-neutral-500">→</span>
        <span class="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-600/50">{{ c.hacia.acorde }}</span>
        <span class="text-xs text-neutral-400">{{ c.tipo }}</span>
      </li>
    </ul>
    <p class="text-xs mt-3 text-neutral-500">Basado en la tonalidad de <strong>{{ nota }}</strong> mayor.</p>
  </div>
</template>

<!--
  Por pedido del usuario, se mantiene exactamente la forma original.
  Si se desean animaciones sin cambiar la UI, se pueden añadir
  transiciones muy sutiles a li/span aquí, pero por ahora se omite.
-->
