import { describe, expect, it } from 'vitest'
import { buildDiscountRecords } from '../buildDiscountRecords'
import { filterRecords, NO_FILTER } from '../filterRecords'
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

describe('filterRecords', () => {
  const records = buildDiscountRecords([
    pair({ city: 'Loanda', categoryCode: 1, fidelityPercentage: 10, limitPercentage: 15 }), // regular
    pair({ city: 'Loanda', categoryCode: 2, fidelityPercentage: 20, limitPercentage: 15 }), // inconsistencia
    pair({ city: 'Jandaia', categoryCode: 1, fidelityPercentage: 10, limitPercentage: 20 }), // regular
    pair({ city: 'Jandaia', categoryCode: 2, fidelityPercentage: null, limitPercentage: 20 }), // sem_par
  ])

  it('sem nenhum filtro ativo, retorna todos os registros', () => {
    expect(filterRecords(records, NO_FILTER)).toHaveLength(4)
  })

  it('filtra por cidade', () => {
    const result = filterRecords(records, { ...NO_FILTER, city: 'Loanda' })
    expect(result).toHaveLength(2)
    expect(result.every((r) => r.city === 'Loanda')).toBe(true)
  })

  it('filtra por categoria', () => {
    const result = filterRecords(records, { ...NO_FILTER, categoryCode: 2 })
    expect(result).toHaveLength(2)
    expect(result.every((r) => r.categoryCode === 2)).toBe(true)
  })

  it('filtra por situação, incluindo sem_par', () => {
    expect(filterRecords(records, { ...NO_FILTER, situation: 'inconsistencia' })).toHaveLength(1)
    expect(filterRecords(records, { ...NO_FILTER, situation: 'sem_par' })).toHaveLength(1)
  })

  it('combina os três filtros ao mesmo tempo', () => {
    const result = filterRecords(records, { city: 'Loanda', categoryCode: 2, situation: 'inconsistencia' })
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({ city: 'Loanda', categoryCode: 2 })
  })

  it('retorna lista vazia quando nenhum registro bate com o filtro', () => {
    expect(filterRecords(records, { city: 'Loanda', categoryCode: 2, situation: 'regular' })).toEqual([])
  })
})
