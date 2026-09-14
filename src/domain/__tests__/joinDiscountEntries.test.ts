import { describe, expect, it } from 'vitest'
import { joinDiscountEntries } from '../joinDiscountEntries'
import type { DiscountEntry } from '../types'

function entry(overrides: Partial<DiscountEntry>): DiscountEntry {
  return {
    city: 'Loanda',
    categoryCode: 418,
    categoryDescription: 'ANALGESICO GENERICO',
    percentage: 17,
    source: 'fidelidade',
    ...overrides,
  }
}

describe('joinDiscountEntries', () => {
  it('une por Cidade + Código quando o registro existe nos dois arquivos', () => {
    const fidelity = [entry({ percentage: 17, source: 'fidelidade' })]
    const limit = [entry({ percentage: 20, source: 'limite' })]

    const pairs = joinDiscountEntries(fidelity, limit)

    expect(pairs).toHaveLength(1)
    expect(pairs[0]).toMatchObject({
      city: 'Loanda',
      categoryCode: 418,
      fidelityPercentage: 17,
      limitPercentage: 20,
    })
  })

  it('mantém a combinação com o outro lado null quando existe em um único arquivo', () => {
    const fidelity = [entry({ categoryCode: 999, categoryDescription: 'SO NA FIDELIDADE' })]
    const limit: DiscountEntry[] = []

    const pairs = joinDiscountEntries(fidelity, limit)

    expect(pairs).toEqual([
      {
        city: 'Loanda',
        categoryCode: 999,
        categoryDescription: 'SO NA FIDELIDADE',
        fidelityPercentage: 17,
        limitPercentage: null,
      },
    ])
  })

  it('cobre a união de cidades e categorias das duas listas', () => {
    const fidelity = [entry({ city: 'Loanda', categoryCode: 1 }), entry({ city: 'Jandaia', categoryCode: 2 })]
    const limit = [entry({ city: 'Loanda', categoryCode: 3, source: 'limite' })]

    const pairs = joinDiscountEntries(fidelity, limit)

    expect(pairs).toHaveLength(3)
  })
})
