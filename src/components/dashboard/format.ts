export function formatPercentage(value: number | null, digits = 1): string {
  return value === null ? '—' : `${value.toFixed(digits)}%`
}

export function formatPoints(value: number | null, digits = 1): string {
  return value === null ? '—' : `${value.toFixed(digits)} p.p.`
}

export function formatCount(value: number): string {
  return value.toLocaleString('pt-BR')
}
