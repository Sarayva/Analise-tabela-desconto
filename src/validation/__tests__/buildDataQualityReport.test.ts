import { describe, expect, it } from 'vitest'
import { buildDataQualityReport } from '../buildDataQualityReport'
import type { ParsedFile } from '../../data/parseDiscountFile'
import type { DiscountEntry } from '../../domain/types'

function parsedFile(entries: DiscountEntry[], skippedRowCount = 0): ParsedFile {
  return {
    source: entries[0]?.source ?? 'fidelidade',
    entries,
    citiesDetected: Array.from(new Set(entries.map((entry) => entry.city))).sort(),
    rowCount: entries.length,
    skippedRowCount,
    columnMapping: { categoryCode: 'Código', categoryDescription: 'Descrição', percentage: '%' },
    cityStrategy: { mode: 'por_aba' },
    previewRows: [],
    previewHeaders: [],
  }
}

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

describe('buildDataQualityReport', () => {
  it('reporta combinações casadas e as que existem em apenas um arquivo', () => {
    const fidelity = parsedFile([
      entry({ categoryCode: 1, source: 'fidelidade' }),
      entry({ categoryCode: 2, source: 'fidelidade' }),
    ])
    const limit = parsedFile([
      entry({ categoryCode: 1, percentage: 20, source: 'limite' }),
      entry({ categoryCode: 3, percentage: 30, source: 'limite' }),
    ])

    const report = buildDataQualityReport(fidelity, limit)

    expect(report.matchedCombinations).toHaveLength(1)
    expect(report.onlyInFidelity).toHaveLength(1)
    expect(report.onlyInFidelity[0].categoryCode).toBe(2)
    expect(report.onlyInLimit).toHaveLength(1)
    expect(report.onlyInLimit[0].categoryCode).toBe(3)
    expect(report.totalCities).toBe(1)
    expect(report.totalCategories).toBe(3)
  })

  it('repassa a contagem de linhas ignoradas de cada arquivo', () => {
    const fidelity = parsedFile([entry({})], 5)
    const limit = parsedFile([entry({ source: 'limite' })], 2)

    const report = buildDataQualityReport(fidelity, limit)

    expect(report.skippedRowsInFidelity).toBe(5)
    expect(report.skippedRowsInLimit).toBe(2)
  })

  it('detecta duplicidade dentro de cada arquivo separadamente', () => {
    const fidelity = parsedFile([entry({ categoryCode: 1 }), entry({ categoryCode: 1 })])
    const limit = parsedFile([entry({ categoryCode: 1, source: 'limite' })])

    const report = buildDataQualityReport(fidelity, limit)

    expect(report.duplicatesInFidelity).toHaveLength(1)
    expect(report.duplicatesInLimit).toHaveLength(0)
  })
})
