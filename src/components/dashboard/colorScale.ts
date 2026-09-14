/**
 * Escalas de cor para os heatmaps, seguindo a paleta de referência do projeto:
 * sequencial (uma cor, claro->escuro) para magnitude, divergente (azul<->vermelho,
 * meio neutro cinza) para valores que podem ser negativos ou positivos.
 */

export const ABSENT_CELL_COLOR = '#e1e0d9'
export const PRESENT_CELL_COLOR = '#2a78d6'

const SEQUENTIAL_LIGHT = '#cde2fb'
const SEQUENTIAL_DARK = '#0d366b'

const DIVERGING_NEUTRAL = '#f0efec'
const DIVERGING_POSITIVE_POLE = '#2a78d6'
const DIVERGING_NEGATIVE_POLE = '#e34948'

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace('#', '')
  return [parseInt(value.slice(0, 2), 16), parseInt(value.slice(2, 4), 16), parseInt(value.slice(4, 6), 16)]
}

function toHexByte(value: number): string {
  return Math.round(Math.min(255, Math.max(0, value)))
    .toString(16)
    .padStart(2, '0')
}

function interpolateHex(hexA: string, hexB: string, t: number): string {
  const clampedT = Math.min(1, Math.max(0, t))
  const [r1, g1, b1] = hexToRgb(hexA)
  const [r2, g2, b2] = hexToRgb(hexB)
  return `#${toHexByte(r1 + (r2 - r1) * clampedT)}${toHexByte(g1 + (g2 - g1) * clampedT)}${toHexByte(b1 + (b2 - b1) * clampedT)}`
}

/** Cor sequencial (uma cor, claro->escuro) para magnitude — ex.: percentual de desconto. */
export function sequentialColor(value: number | null, min: number, max: number): string {
  if (value === null) return ABSENT_CELL_COLOR
  if (max === min) return SEQUENTIAL_DARK
  return interpolateHex(SEQUENTIAL_LIGHT, SEQUENTIAL_DARK, (value - min) / (max - min))
}

/** Cor divergente (azul<->vermelho, meio cinza neutro) para valores que podem ser negativos ou positivos — ex.: GAP. */
export function divergingColor(value: number | null, maxAbsolute: number): string {
  if (value === null) return ABSENT_CELL_COLOR
  if (maxAbsolute === 0 || value === 0) return DIVERGING_NEUTRAL
  const t = Math.min(1, Math.abs(value) / maxAbsolute)
  return interpolateHex(DIVERGING_NEUTRAL, value > 0 ? DIVERGING_POSITIVE_POLE : DIVERGING_NEGATIVE_POLE, t)
}
