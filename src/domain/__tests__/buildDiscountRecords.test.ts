import { describe, expect, it } from 'vitest'
import { buildDiscountRecords } from '../buildDiscountRecords'
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

describe('buildDiscountRecords', () => {
  it('calcula GAP e classifica quando os dois valores existem', () => {
    const [record] = buildDiscountRecords([pair({ fidelityPercentage: 15, limitPercentage: 20 })])
    expect(record.gap).toBe(5)
    expect(record.situation).toBe('regular')
  })

  it('classifica inconsistência quando o Limite é menor que a Fidelidade', () => {
    const [record] = buildDiscountRecords([pair({ fidelityPercentage: 20, limitPercentage: 15 })])
    expect(record.gap).toBe(-5)
    expect(record.situation).toBe('inconsistencia')
  })

  it('marca como sem_par quando falta a Fidelidade, sem calcular GAP', () => {
    const [record] = buildDiscountRecords([pair({ fidelityPercentage: null, limitPercentage: 20 })])
    expect(record.gap).toBeNull()
    expect(record.situation).toBe('sem_par')
  })

  it('marca como sem_par quando falta o Limite, sem calcular GAP', () => {
    const [record] = buildDiscountRecords([pair({ fidelityPercentage: 20, limitPercentage: null })])
    expect(record.gap).toBeNull()
    expect(record.situation).toBe('sem_par')
  })

  it('preserva a identidade Cidade + Categoria de cada par', () => {
    const [record] = buildDiscountRecords([pair({ city: 'Jandaia', categoryCode: 999 })])
    expect(record.city).toBe('Jandaia')
    expect(record.categoryCode).toBe(999)
  })
})
