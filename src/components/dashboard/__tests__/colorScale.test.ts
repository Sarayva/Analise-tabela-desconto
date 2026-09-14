import { describe, expect, it } from 'vitest'
import { ABSENT_CELL_COLOR, divergingColor, sequentialColor } from '../colorScale'

describe('sequentialColor', () => {
  it('retorna a cor de ausência para valor null', () => {
    expect(sequentialColor(null, 0, 100)).toBe(ABSENT_CELL_COLOR)
  })

  it('retorna o tom mais claro no mínimo e o mais escuro no máximo', () => {
    expect(sequentialColor(0, 0, 100)).toBe('#cde2fb')
    expect(sequentialColor(100, 0, 100)).toBe('#0d366b')
  })
})

describe('divergingColor', () => {
  it('retorna a cor de ausência para valor null', () => {
    expect(divergingColor(null, 10)).toBe(ABSENT_CELL_COLOR)
  })

  it('retorna o meio neutro para valor zero', () => {
    expect(divergingColor(0, 10)).toBe('#f0efec')
  })

  it('usa o polo azul para valores positivos e o polo vermelho para negativos', () => {
    expect(divergingColor(10, 10)).toBe('#2a78d6')
    expect(divergingColor(-10, 10)).toBe('#e34948')
  })
})
