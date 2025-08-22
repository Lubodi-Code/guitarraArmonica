# Guía para principiantes — Generador de Círculos Armónicos

Breve y práctica: cómo ejecutar, entender y modificar la app creada (Vue 3 + Tailwind). Ideal si estás empezando.

## 1) Qué es este proyecto
- Interfaz web que muestra dos visualizaciones relacionadas: un `Círculo Armónico` (cromático) y un `Círculo de Quintas` gráfico. 
- Puedes seleccionar una nota (tónica) y ver conexiones armónicas, quinta, cuarta, octava y la escala mayor desde esa tónica.

## 2) Ejecutar localmente (PowerShell en Windows)
Abre una terminal en la carpeta del proyecto y ejecuta:

```powershell
npm install
npm run dev
```

Abre `http://localhost:5173/` (o la URL que indique Vite) en tu navegador.

## 3) Estructura mínima y archivos clave
- `src/lib/notaStore.ts` — Store reactivo. Aquí está la nota seleccionada y la lógica musical (escala mayor, conexiones, quinta/cuarta/octava, círculo de quintas).
- `src/components/CirculoArmonico.vue` — Círculo cromático simple (12 notas). Maneja ripple y pulse central al seleccionar nota.
- `src/components/CirculoQuintas.vue` — Vista SVG del círculo de quintas con flechas, dibujo progresivo, anillos y ripples.
- `src/components/Conexiones.vue` — Panel textual con las conexiones armónicas.
- `src/components/QuintasOctavas.vue` — Panel con tónica, 4ª, 5ª y octava.
- `src/components/Explicacion.vue` — Pequeña explicación de uso dentro de la app.
- `src/App.vue` — Integra los componentes y muestra la UI.

Si quieres entender la lógica musical, abre `src/lib/notaStore.ts` y revisa las `computed` (p. ej. `escalaMayor`, `conexiones`, `circuloDeQuintas`).

## 4) Cómo usar la app (pasos rápidos)
1. Haz click en una nota del `Círculo Armónico` o del `Círculo de Quintas`.
2. Observa cómo: 
   - el centro muestra la tónica seleccionada,
   - las flechas en el círculo de quintas se dibujan mostrando I→IV→V→I y I→vi,
   - los paneles laterales muestran escala y relaciones.
3. Usa hover para previsualizar y click para fijar la tónica.

## 5) Qué hace cada parte visual (rápido)
- Nodo/nota: representa la nota; al hacer click actualiza la tónica del `store`.
- Centro: muestra la tónica actual; pulsa brevemente al cambiar para dar feedback.
- Flechas (paths SVG): muestran conexiones armónicas; se dibujan con efecto progresivo cuando cambias la tónica.
- Anillos de 4ª/5ª: destacan la cuarta y la quinta relativas a la tónica.
- Ripple: pequeña onda visual en la posición donde hiciste click.

## 6) Cómo cambiar colores y tiempos de animación
- Colores/hue: los nodos usan valores `hue` en los componentes (`p.hue` o `--h`) — busca `hsla`/`radial-gradient` en los componentes.
- Duraciones y easings: busca reglas CSS `@keyframes`, `transition` y `animation` en:
  - `src/components/CirculoQuintas.vue` (clases: `.harm-line`, `.drawing`, `.center-circle`, `.ripple`, `.dash-ring`, `.fade-panel`)
  - `src/components/CirculoArmonico.vue` (clases: `.note-item`, `.note-bg`, `.ripple`, `.center-display`)

Ejemplo: para cambiar el tiempo del dibujo de las líneas (actual ~650ms) edita la regla en `.harm-line.drawing`.

## 7) Cómo modificar la lógica musical (p. ej. añadir bemoles)
1. Abre `src/lib/notaStore.ts`.
2. Modifica `NOTAS` para añadir notación alternativa (Db, Eb) o crea un mapeo entre sostenidos y bemoles.
3. Ajusta `circuloDeQuintas` y `escalaMayor` si deseas otra convención.

Notas: cambiar `NOTAS` puede requerir actualizar el orden y los índices usados en cálculos (índices mod 12).

## 8) Depuración / comprobaciones comunes
- Si la app no carga: revisa la consola donde ejecutaste `npm run dev` para errores de import/alias. Asegúrate de que `@` esté aliasado a `src` (ya configurado en `tsconfig.app.json` y `vite.config.ts`).
- Si las animaciones no se disparan: abre DevTools y chequea el DOM SVG para ver si los `path` tienen `stroke-dasharray` y `stroke-dashoffset` asignados.

## 9) Pequeños ejercicios para aprender (sugeridos)
1. Cambia el color de la tónica en `CirculoArmonico.vue` para usar otro esquema de neón.
2. Añade soporte de teclado: en los nodos añade `@keyup.enter` para seleccionar con la tecla Enter.
3. Agrega un toggle en UI para reducir/ Aumentar la velocidad de animaciones; usa variables CSS globales en `src/style.css`.

## 10) Recursos rápidos (para seguir aprendiendo)
- Documentación Vue 3: https://vuejs.org/
- Manipulación SVG: https://developer.mozilla.org/en-US/docs/Web/SVG
- Animaciones CSS: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations

---
Si quieres, creo también un archivo `CONTRIBUIR.md` con tareas pequeñas para comenzar a contribuir (hotfixes, tests, mejoras). ¿Lo genero? 
