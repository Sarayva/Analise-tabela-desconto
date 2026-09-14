import { describe, expect, it } from 'vitest'
import { buildDiscountRecords } from '../buildDiscountRecords'
import { buildCityCategoryMatrix, matrixKey } from '../buildCityCategoryMatrix'
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

describe('buildCityCategoryMatrix', () => {
  it('lista cidades e categorias distintas, ordenadas', () => {
    const records = buildDiscountRecords([
      pair({ city: 'Jandaia', categoryCode: 2, categoryDescription: 'B' }),
      pair({ city: 'Loanda', categoryCode: 1, categoryDescription: 'A' }),
    ])

    const matrix = buildCityCategoryMatrix(records)

    expect(matrix.cities).toEqual(['Jandaia', 'Loanda'])
    expect(matrix.categories).toEqual([
      { code: 1, description: 'A' },
      { code: 2, description: 'B' },
    ])
  })

  it('indexa cada registro pela chave Cidade + Categoria', () => {
    const records = buildDiscountRecords([pair({ city: 'Loanda', categoryCode: 1 })])
    const matrix = buildCityCategoryMatrix(records)

    expect(matrix.cellByKey.get(matrixKey('Loanda', 1))).toBeDefined()
    expect(matrix.cellByKey.get(matrixKey('Loanda', 2))).toBeUndefined()
  })

  it('uma combinação Cidade + Categoria nunca vista em nenhum arquivo não aparece no mapa (categoria ausente)', () => {
    const records = buildDiscountRecords([
      pair({ city: 'Loanda', categoryCode: 1 }),
      pair({ city: 'Jandaia', categoryCode: 2 }),
    ])
    const matrix = buildCityCategoryMatrix(records)

    // Jandaia nunca teve a categoria 1 registrada em nenhum arquivo
    expect(matrix.cellByKey.has(matrixKey('Jandaia', 1))).toBe(false)
  })
})
