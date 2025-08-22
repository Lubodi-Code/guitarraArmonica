import { ref, computed } from 'vue'

// Notas cromáticas (usando notación internacional) y equivalencias en español
export const NOTAS = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'] as const
export type Nota = typeof NOTAS[number]

const selectedNota = ref<Nota>('C')

export function useNotaSeleccionada() {
  const setNota = (n: Nota) => { selectedNota.value = n }
  return { nota: selectedNota, setNota }
}

// Escala mayor diatónica desde la nota seleccionada
const mayorIntervals = [2,2,1,2,2,2,1]
export interface Grado {
  grado: string
  nota: Nota
  acorde: string
}

export const escalaMayor = computed<Grado[]>(() => {
  const rootIndex = NOTAS.indexOf(selectedNota.value)
  const indices: number[] = [rootIndex]
  mayorIntervals.reduce((acc, paso) => {
    const nxt = (acc + paso) % NOTAS.length
    indices.push(nxt)
    return nxt
  }, rootIndex)
  // Triadas (I ii iii IV V vi vii°)
  const calidades = ['M','m','m','M','M','m','dis']
  const grados = ['I','ii','iii','IV','V','vi','vii°']
  return indices.slice(0,7).map((idx,i) => ({
    grado: grados[i],
    nota: NOTAS[idx] as Nota,
    acorde: `${NOTAS[idx]}${calidades[i] === 'M' ? '' : calidades[i] === 'm' ? 'm' : '°'}`
  }))
})

// Conexiones armónicas básicas (I–IV–V, relativos, dominantes secundarios simples)
export const conexiones = computed(() => {
  const grados = escalaMayor.value
  const byGrado: Record<string, Grado> = Object.fromEntries(grados.map(g => [g.grado,g]))
  const relMenor = byGrado['vi']
  const subdom = byGrado['IV']
  const dom = byGrado['V']
  const tonica = byGrado['I']
  return [
    { desde: tonica, hacia: subdom, tipo: 'Subdominante' },
    { desde: subdom, hacia: dom, tipo: 'Cadencia' },
    { desde: dom, hacia: tonica, tipo: 'Dominante' },
    { desde: tonica, hacia: relMenor, tipo: 'Relativa menor' },
  ]
})

// Quinta y octava desde la nota seleccionada
export const quinta = computed<Nota>(() => NOTAS[(NOTAS.indexOf(selectedNota.value)+7)%12])
export const cuarta = computed<Nota>(() => NOTAS[(NOTAS.indexOf(selectedNota.value)+5)%12])
export const octava = computed<Nota>(() => selectedNota.value)

// Orden del círculo de quintas completo comenzando en la seleccionada
export const circuloDeQuintas = computed<Nota[]>(() => {
  const order: Nota[] = []
  let idx = NOTAS.indexOf(selectedNota.value)
  const visited = new Set<number>()
  while(order.length < 12) {
    order.push(NOTAS[idx] as Nota)
    visited.add(idx)
    idx = (idx + 7) % 12
    if(visited.has(idx)) {
      // completar con las faltantes en orden cromático para evitar loop infinito
      NOTAS.forEach((n,i) => { if(!visited.has(i)) order.push(n as Nota) })
      break
    }
  }
  return order.slice(0,12)
})
