<template>
  <section class="prose prose-invert max-w-none bg-neutral-900/70 p-5 rounded-lg border border-neutral-800">
    <h2 class="text-lg font-semibold">Guía rápida</h2>
    <p>Explicaciones básicas de términos musicales usados en la app y controles visuales.</p>

    <h3 class="mt-4">Definiciones</h3>
    <dl>
      <dt class="font-semibold">Tónica</dt>
      <dd>La nota central de una tonalidad. Es el punto de reposo y la nota que se percibe como "hogar" en una pieza musical.</dd>

      <div class="mt-2 pl-3">
        <strong>Ejemplo:</strong> Si la tónica es <strong>C</strong> (Do), toda la escala y las relaciones se construyen alrededor de C.
      </div>

      <dt class="font-semibold mt-2">Octava</dt>
      <dd>La octava es el intervalo entre una nota y la siguiente con el mismo nombre pero a una altura distinta. Por ejemplo, un C una octava arriba suena más agudo pero es la misma nota en ciclo.</dd>

      <div class="mt-2 pl-3">
        <strong>Ejemplo:</strong> Si tocas <strong>C</strong> en una cuerda y luego un <strong>C</strong> más agudo, esa segunda nota está a una octava de la primera. Notación: C → C'.</div>

      <dt class="font-semibold mt-2">Quinta</dt>
      <dd>Intervalo que corresponde a cinco grados en la escala diatónica sobre la tónica. La quinta (V) es la dominante y genera tensión que suele resolver en la tónica.</dd>

      <div class="mt-2 pl-3">
        <strong>Ejemplo:</strong> En la tónica <strong>C</strong>, la quinta es <strong>G</strong> (Do → Sol). En notación de semitonos, la quinta está 7 semitonos por encima de la tónica.
      </div>

      <dt class="font-semibold mt-2">Círculo Armónico / Círculo de Quintas</dt>
      <dd>Un diagrama que organiza las notas según la relación de quintas. Es útil para ver progresiones, modulaciones y el orden de las tonalidades relacionadas.</dd>
    </dl>

  <h3 class="mt-4">Controles de visualización</h3>
    <p>Puedes agrandar o achicar las visualizaciones si tu pantalla lo requiere.</p>
    <div class="flex gap-2 mt-2">
      <button class="px-3 py-1 rounded bg-neutral-800 border hover:bg-neutral-700" @click="setZoom('large')">Agrandar</button>
      <button class="px-3 py-1 rounded bg-neutral-800 border hover:bg-neutral-700" @click="setZoom('normal')">Normal</button>
      <button class="px-3 py-1 rounded bg-neutral-800 border hover:bg-neutral-700" @click="setZoom('small')">Achicar</button>
    </div>

    <h3 class="mt-4">Cómo usar</h3>
    <p>Selecciona una nota en el círculo. Automáticamente verás:</p>
    <ul>
      <li>La tónica resaltada en el centro.</li>
      <li>Conexiones armónicas básicas (I–IV–V y relativa menor).</li>
      <li>La cuarta, quinta y octava inmediatas.</li>
      <li>El orden del círculo de quintas partiendo de la nota elegida.</li>
    </ul>
    <p>Usa esta visualización para componer progresiones, entender modulaciones y reforzar tu memoria auditiva.</p>

    <h4 class="mt-3">Ejemplos prácticos rápidos</h4>
    <ul>
      <li><strong>Tónica C:</strong> centro muestra <strong>C</strong>, la quinta es <strong>G</strong>, la cuarta es <strong>F</strong>, la octava es <strong>C</strong> (una octava arriba).</li>
      <li><strong>Progresión sencilla:</strong> I → IV → V → I (en C: C → F → G → C).</li>
      <li><strong>Relativa menor:</strong> La relativa menor de C mayor es A menor (vi = Am).</li>
    </ul>
  </section>
</template>

<script setup lang="ts">
function setZoom(mode: 'large' | 'normal' | 'small') {
  const els = document.querySelectorAll('.scale-target')
  els.forEach(el => {
    el.classList.remove('zoom-large', 'zoom-small')
    if (mode === 'large') el.classList.add('zoom-large')
    if (mode === 'small') el.classList.add('zoom-small')
  })
}
</script>

<style scoped>
.prose { color: #d1d5db; }
code { background: rgba(255,255,255,0.03); padding: .12rem .3rem; border-radius: 4px; }
</style>
