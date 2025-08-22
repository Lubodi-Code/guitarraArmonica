<script setup lang="ts">
import CirculoArmonico from '@/components/CirculoArmonico.vue'
import Conexiones from '@/components/Conexiones.vue'
import QuintasOctavas from '@/components/QuintasOctavas.vue'
import Explicacion from '@/components/Explicacion.vue'
import CirculoQuintas from '@/components/CirculoQuintas.vue'
import { escalaMayor } from '@/lib/notaStore'
</script>

<template>
	<main class="px-4 py-6 max-w-6xl mx-auto space-y-10">
		<header class="text-center space-y-2">
			<h1 class="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
				Generador de
				<span class="block text-transparent neon-title">Círculos Armónicos</span>
			</h1>
			<p class="text-sm text-neutral-400">Interfaz minimalista — blanco & negro; notas en arcoíris neón</p>
			<div class="mt-2 h-0.5 w-48 mx-auto rounded-full bg-gradient-to-r from-pink-500 via-indigo-400 to-cyan-400 opacity-60"></div>
		</header>

		<section class="grid md:grid-cols-2 gap-10">
			<CirculoArmonico />
			<div class="space-y-8">
				<Conexiones />
				<QuintasOctavas />
				<div>
					<h3 class="font-semibold mb-2">Escala Mayor</h3>
					<ul class="text-sm flex flex-wrap gap-2">
						<li v-for="g in escalaMayor" :key="g.grado" class="px-2 py-1 rounded border border-neutral-600/40 bg-neutral-900/80">
							<span class="font-mono text-xs text-neutral-500 mr-1">{{ g.grado }}</span>{{ g.acorde }}
						</li>
					</ul>
				</div>
			</div>
		</section>

		<Explicacion />

			<section class="pt-4 border-t border-neutral-800">
				<CirculoQuintas />
			</section>

		<footer class="pt-6 border-t border-neutral-800 text-center text-xs text-neutral-500">Hecho por Lubodi</footer>
	</main>
</template>

<style scoped>
.neon-title{
	background: linear-gradient(90deg,#ff2d95,#6a00ff,#00d4ff,#00ff8a);
	-webkit-background-clip: text;
	background-clip: text;
	color: transparent;
	text-shadow: 0 0 10px rgba(110, 0, 255, 0.18);
}
</style>
