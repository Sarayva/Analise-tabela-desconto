import { describe, expect, it } from 'vitest'
import { detectDuplicateEntries } from '../detectDuplicateEntries'
import type { DiscountEntry } from '../../domain/types'

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

describe('detectDuplicateEntries', () => {
  it('não aponta nada quando não há Cidade + Código repetido', () => {
    const entries = [entry({ categoryCode: 1 }), entry({ categoryCode: 2 })]
    expect(detectDuplicateEntries(entries)).toEqual([])
  })

  it('aponta combinações Cidade + Código repetidas, com a contagem de ocorrências', () => {
    const entries = [entry({ categoryCode: 1 }), entry({ categoryCode: 1 }), entry({ categoryCode: 1 })]
    const duplicates = detectDuplicateEntries(entries)

    expect(duplicates).toEqual([
      { city: 'Loanda', categoryCode: 1, categoryDescription: 'ANALGESICO GENERICO', occurrences: 3 },
    ])
  })

  it('trata cidades diferentes com o mesmo código como registros distintos', () => {
    const entries = [entry({ city: 'Loanda', categoryCode: 1 }), entry({ city: 'Jandaia', categoryCode: 1 })]
    expect(detectDuplicateEntries(entries)).toEqual([])
  })
})
