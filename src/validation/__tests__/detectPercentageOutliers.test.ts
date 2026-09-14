import { describe, expect, it } from 'vitest'
import { detectPercentageOutliers } from '../detectPercentageOutliers'
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

describe('detectPercentageOutliers', () => {
  it('não aponta nada para percentuais entre 0 e 100', () => {
    expect(detectPercentageOutliers([entry({ percentage: 0 }), entry({ percentage: 100 })])).toEqual([])
  })

  it('aponta percentuais negativos', () => {
    const result = detectPercentageOutliers([entry({ percentage: -5 })])
    expect(result).toEqual([
      { city: 'Loanda', categoryCode: 418, categoryDescription: 'ANALGESICO GENERICO', percentage: -5, reason: 'negativo' },
    ])
  })

  it('aponta percentuais acima de 100', () => {
    const result = detectPercentageOutliers([entry({ percentage: 150 })])
    expect(result[0].reason).toBe('acima_de_100')
  })
})
