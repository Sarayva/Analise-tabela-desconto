import { describe, expect, it } from 'vitest'
import { buildDiscountRecords } from '../buildDiscountRecords'
import { summarizeGapDistribution } from '../summarizeGapDistribution'
import type { EntryPair } from '../types'

function pair(overrides: Partial<EntryPair>): EntryPair {
  return {
    city: 'Loanda',
    categoryCode: 418,
    categoryDescription: 'ANALGESICO GENERICO',
    fidelityPercentage: 17,
    limitPercentage: 20,
    ...overrides,
  }
}

describe('summarizeGapDistribution', () => {
  it('conta quantidade e percentual por situação', () => {
    const records = buildDiscountRecords([
      pair({ fidelityPercentage: 20, limitPercentage: 15 }), // inconsistencia, gap -5
      pair({ fidelityPercentage: 15, limitPercentage: 15 }), // sem_espaco_adicional, gap 0
      pair({ fidelityPercentage: 10, limitPercentage: 15 }), // regular, gap 5
      pair({ fidelityPercentage: 10, limitPercentage: 25 }), // regular, gap 15
    ])

    const summary = summarizeGapDistribution(records)

    expect(summary.totalWithGap).toBe(4)
    expect(summary.bySituation.inconsistencia).toEqual({ count: 1, percentage: 25 })
    expect(summary.bySituation.sem_espaco_adicional).toEqual({ count: 1, percentage: 25 })
    expect(summary.bySituation.regular).toEqual({ count: 2, percentage: 50 })
  })

  it('calcula maior, menor, média e mediana do GAP', () => {
    const records = buildDiscountRecords([
      pair({ fidelityPercentage: 10, limitPercentage: 15 }), // gap 5
      pair({ fidelityPercentage: 10, limitPercentage: 20 }), // gap 10
      pair({ fidelityPercentage: 10, limitPercentage: 30 }), // gap 20
    ])

    const summary = summarizeGapDistribution(records)

    expect(summary.maxGap).toBe(20)
    expect(summary.minGap).toBe(5)
    expect(summary.averageGap).toBeCloseTo(11.67, 1)
    expect(summary.medianGap).toBe(10)
  })

  it('ignora registros sem_par no cálculo do GAP', () => {
    const records = buildDiscountRecords([
      pair({ fidelityPercentage: 10, limitPercentage: 15 }),
      pair({ fidelityPercentage: null, limitPercentage: 20 }),
    ])

    const summary = summarizeGapDistribution(records)

    expect(summary.totalWithGap).toBe(1)
  })

  it('retorna estatísticas nulas e zeradas quando não há nenhum registro com GAP', () => {
    const records = buildDiscountRecords([pair({ fidelityPercentage: null, limitPercentage: 20 })])

    const summary = summarizeGapDistribution(records)

    expect(summary.totalWithGap).toBe(0)
    expect(summary.maxGap).toBeNull()
    expect(summary.minGap).toBeNull()
    expect(summary.averageGap).toBeNull()
    expect(summary.medianGap).toBeNull()
    expect(summary.bySituation.regular.percentage).toBe(0)
  })
})
