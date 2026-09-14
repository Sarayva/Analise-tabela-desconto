import { describe, expect, it } from 'vitest'
import { buildDiscountRecords } from '../buildDiscountRecords'
import { summarizeByCategory } from '../summarizeByCategory'
import type { EntryPair } from '../types'

function pair(overrides: Partial<EntryPair>): EntryPair {
  return {
    city: 'Loanda',
    categoryCode: 1,
    categoryDescription: 'GENERICOS',
    fidelityPercentage: 10,
    limitPercentage: 15,
    ...overrides,
  }
}

describe('summarizeByCategory', () => {
  it('calcula estatísticas de GAP por categoria', () => {
    const records = buildDiscountRecords([
      pair({ city: 'Loanda', fidelityPercentage: 10, limitPercentage: 15 }), // gap 5
      pair({ city: 'Jandaia', fidelityPercentage: 10, limitPercentage: 20 }), // gap 10
      pair({ city: 'Mandaguari', fidelityPercentage: 10, limitPercentage: 30 }), // gap 20
    ])

    const [summary] = summarizeByCategory(records)

    expect(summary.categoryDescription).toBe('GENERICOS')
    expect(summary.cityCount).toBe(3)
    expect(summary.minGap).toBe(5)
    expect(summary.maxGap).toBe(20)
    expect(summary.medianGap).toBe(10)
    expect(summary.averageGap).toBeCloseTo(11.67, 1)
  })

  it('aponta a cidade com maior e menor Fidelidade e GAP', () => {
    const records = buildDiscountRecords([
      pair({ city: 'Loanda', fidelityPercentage: 20, limitPercentage: 22 }), // fidelidade alta, gap baixo
      pair({ city: 'Jandaia', fidelityPercentage: 5, limitPercentage: 25 }), // fidelidade baixa, gap alto
    ])

    const [summary] = summarizeByCategory(records)

    expect(summary.cityWithMaxFidelity).toEqual({ city: 'Loanda', value: 20 })
    expect(summary.cityWithMinFidelity).toEqual({ city: 'Jandaia', value: 5 })
    expect(summary.cityWithMaxGap).toEqual({ city: 'Jandaia', value: 20 })
    expect(summary.cityWithMinGap).toEqual({ city: 'Loanda', value: 2 })
  })

  it('ignora registros sem_par nas estatísticas de GAP', () => {
    const records = buildDiscountRecords([
      pair({ city: 'Loanda', fidelityPercentage: 10, limitPercentage: 15 }),
      pair({ city: 'Jandaia', fidelityPercentage: null, limitPercentage: 20 }),
    ])

    const [summary] = summarizeByCategory(records)

    expect(summary.cityCount).toBe(2)
    expect(summary.averageGap).toBe(5)
  })
})
