import { describe, expect, it } from 'vitest'
import { buildDiscountRecords } from '../buildDiscountRecords'
import { summarizeOverall } from '../summarizeOverall'
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

describe('summarizeOverall', () => {
  it('calcula a média geral de Fidelidade e Limite, ignorando registros sem_par', () => {
    const records = buildDiscountRecords([
      pair({ fidelityPercentage: 10, limitPercentage: 20 }),
      pair({ fidelityPercentage: 20, limitPercentage: 30 }),
      pair({ fidelityPercentage: null, limitPercentage: 50 }),
    ])

    const summary = summarizeOverall(records)

    expect(summary.averageFidelity).toBe(15)
    expect(summary.averageLimit).toBe(25)
  })

  it('retorna null quando não há nenhum registro casado', () => {
    const records = buildDiscountRecords([pair({ fidelityPercentage: null })])
    expect(summarizeOverall(records)).toEqual({ averageFidelity: null, averageLimit: null })
  })
})
