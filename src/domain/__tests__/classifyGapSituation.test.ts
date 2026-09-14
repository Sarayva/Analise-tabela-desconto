import { describe, expect, it } from 'vitest'
import { classifyGapSituation } from '../classifyGapSituation'

describe('classifyGapSituation', () => {
  it('classifica GAP negativo (Limite < Fidelidade) como inconsistência', () => {
    expect(classifyGapSituation(-5)).toBe('inconsistencia')
  })

  it('classifica GAP zero (Limite = Fidelidade) como sem espaço adicional', () => {
    expect(classifyGapSituation(0)).toBe('sem_espaco_adicional')
  })

  it('classifica GAP positivo (Limite > Fidelidade) como regular', () => {
    expect(classifyGapSituation(5)).toBe('regular')
  })
})
