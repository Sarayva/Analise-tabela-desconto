/** Utilitários estatísticos simples, usados pelas agregações de GAP por cidade/categoria. */

export function average(values: number[]): number | null {
  if (values.length === 0) return null
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

export function median(values: number[]): number | null {
  if (values.length === 0) return null
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle]
}

/**
 * Percentil `p` (0-1) de uma lista de valores, por interpolação linear entre
 * as posições mais próximas. Usado para limitar escalas de cor a uma faixa
 * "típica" sem deixar um único valor extremo esmagar o contraste de todo o resto.
 */
export function percentile(values: number[], p: number): number | null {
  if (values.length === 0) return null
  const sorted = [...values].sort((a, b) => a - b)
  const rank = p * (sorted.length - 1)
  const lowerIndex = Math.floor(rank)
  const upperIndex = Math.ceil(rank)
  if (lowerIndex === upperIndex) return sorted[lowerIndex]
  const weight = rank - lowerIndex
  return sorted[lowerIndex] * (1 - weight) + sorted[upperIndex] * weight
}

export function minValue(values: number[]): number | null {
  return values.length === 0 ? null : Math.min(...values)
}

export function maxValue(values: number[]): number | null {
  return values.length === 0 ? null : Math.max(...values)
}

/** Encontra o item com o maior (ou menor) valor segundo `selector`. `null` se a lista estiver vazia. */
export function extremeItem<T>(
  items: T[],
  selector: (item: T) => number,
  mode: 'max' | 'min',
): T | null {
  if (items.length === 0) return null
  return items.reduce((best, item) => {
    const isBetter = mode === 'max' ? selector(item) > selector(best) : selector(item) < selector(best)
    return isBetter ? item : best
  })
}
