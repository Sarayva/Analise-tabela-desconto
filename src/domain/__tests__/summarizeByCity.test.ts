import { describe, expect, it } from 'vitest'
import { buildDiscountRecords } from '../buildDiscountRecords'
import { summarizeByCity } from '../summarizeByCity'
import type { EntryPair } from '../types'

function pair(overrides: Partial<EntryPair>): EntryPair {
  return {
    city: 'Loanda',
    categoryCode: 1,
    categoryDescription: 'CATEGORIA',
    fidelityPercentage: 10,
    limitPercentage: 15,
    ...overrides,
  }
}

describe('summarizeByCity', () => {
  it('calcula médias e contagens por cidade', () => {
    const records = buildDiscountRecords([
      pair({ city: 'Loanda', categoryCode: 1, fidelityPercentage: 10, limitPercentage: 15 }), // gap 5
      pair({ city: 'Loanda', categoryCode: 2, fidelityPercentage: 20, limitPercentage: 15 }), // gap -5, inconsistencia
      pair({ city: 'Jandaia', categoryCode: 1, fidelityPercentage: 10, limitPercentage: 20 }), // gap 10
    ])

    const summary = summarizeByCity(records)
    const loanda = summary.find((s) => s.city === 'Loanda')!

    expect(loanda.averageFidelity).toBe(15)
    expect(loanda.averageLimit).toBe(15)
    expect(loanda.averageGap).toBe(0)
    expect(loanda.categoryCount).toBe(2)
    expect(loanda.recordCount).toBe(2)
    expect(loanda.inconsistencyCount).toBe(1)
  })

  it('não conta registros sem_par nas médias, mas conta no total de registros', () => {
    const records = buildDiscountRecords([
      pair({ city: 'Loanda', categoryCode: 1, fidelityPercentage: 10, limitPercentage: 15 }),
      pair({ city: 'Loanda', categoryCode: 2, fidelityPercentage: null, limitPercentage: 20 }),
    ])

    const [loanda] = summarizeByCity(records)

    expect(loanda.recordCount).toBe(2)
    expect(loanda.matchedCount).toBe(1)
    expect(loanda.averageFidelity).toBe(10)
  })

  it('retorna médias null quando a cidade não tem nenhum registro casado', () => {
    const records = buildDiscountRecords([pair({ fidelityPercentage: null })])
    const [loanda] = summarizeByCity(records)

    expect(loanda.averageFidelity).toBeNull()
    expect(loanda.averageGap).toBeNull()
  })
})
