import { describe, expect, it } from 'vitest'
import { calculateGap } from '../calculateGap'

describe('calculateGap', () => {
  it('calcula Limite - Fidelidade', () => {
    expect(calculateGap(15, 20)).toBe(5)
  })

  it('retorna negativo quando o Limite é menor que a Fidelidade', () => {
    expect(calculateGap(20, 15)).toBe(-5)
  })

  it('retorna zero quando os dois valores são iguais', () => {
    expect(calculateGap(10, 10)).toBe(0)
  })

  it('lida com valores zero', () => {
    expect(calculateGap(0, 0)).toBe(0)
    expect(calculateGap(0, 10)).toBe(10)
  })
})
