import { describe, expect, it } from 'vitest'
import { analyzeMissingCategories } from '../analyzeMissingCategories'
import { buildCityCategoryMatrix } from '../buildCityCategoryMatrix'
import { buildDiscountRecords } from '../buildDiscountRecords'
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

describe('analyzeMissingCategories', () => {
  it('aponta categorias ausentes por cidade', () => {
    const records = buildDiscountRecords([
      pair({ city: 'Loanda', categoryCode: 1, categoryDescription: 'A' }),
      pair({ city: 'Loanda', categoryCode: 2, categoryDescription: 'B' }),
      pair({ city: 'Jandaia', categoryCode: 1, categoryDescription: 'A' }),
      // Jandaia não tem a categoria 2
    ])
    const matrix = buildCityCategoryMatrix(records)

    const analysis = analyzeMissingCategories(matrix)
    const jandaia = analysis.byCity.find((c) => c.city === 'Jandaia')!
    const loanda = analysis.byCity.find((c) => c.city === 'Loanda')!

    expect(jandaia.missingCategories).toEqual([{ code: 2, description: 'B' }])
    expect(loanda.missingCategories).toEqual([])
  })

  it('ordena cidades da que tem mais categorias ausentes para a que tem menos', () => {
    const records = buildDiscountRecords([
      pair({ city: 'Loanda', categoryCode: 1 }),
      pair({ city: 'Loanda', categoryCode: 2 }),
      pair({ city: 'Loanda', categoryCode: 3 }),
      pair({ city: 'Jandaia', categoryCode: 1 }),
    ])
    const matrix = buildCityCategoryMatrix(records)

    const [first] = analyzeMissingCategories(matrix).byCity
    expect(first.city).toBe('Jandaia')
    expect(first.missingCategories).toHaveLength(2)
  })

  it('identifica categorias exclusivas de uma única cidade', () => {
    const records = buildDiscountRecords([
      pair({ city: 'Loanda', categoryCode: 1, categoryDescription: 'SO EM LOANDA' }),
      pair({ city: 'Loanda', categoryCode: 2, categoryDescription: 'EM TODAS' }),
      pair({ city: 'Jandaia', categoryCode: 2, categoryDescription: 'EM TODAS' }),
    ])
    const matrix = buildCityCategoryMatrix(records)

    const analysis = analyzeMissingCategories(matrix)

    expect(analysis.exclusiveCategories).toEqual([
      { code: 1, description: 'SO EM LOANDA', missingInCities: ['Jandaia'], presentInCities: ['Loanda'] },
    ])
  })

  it('não lista categorias presentes em todas as cidades como ausência', () => {
    const records = buildDiscountRecords([
      pair({ city: 'Loanda', categoryCode: 1 }),
      pair({ city: 'Jandaia', categoryCode: 1 }),
    ])
    const matrix = buildCityCategoryMatrix(records)

    expect(analyzeMissingCategories(matrix).categoriesWithAnyAbsence).toEqual([])
  })
})
