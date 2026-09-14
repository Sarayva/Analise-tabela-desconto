import { describe, expect, it } from 'vitest'
import { buildDiscountRecords } from '../../domain/buildDiscountRecords'
import type { EntryPair } from '../../domain/types'
import { buildCategoryRankingRows, buildCityRankingRows, buildRecordRows } from '../buildExportRows'
import type { CategorySummary } from '../../domain/summarizeByCategory'
import type { CitySummary } from '../../domain/summarizeByCity'

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

describe('buildRecordRows', () => {
  it('usa cabeçalhos de negócio e traduz a situação', () => {
    const [record] = buildDiscountRecords([pair({ fidelityPercentage: 20, limitPercentage: 15 })])
    const [row] = buildRecordRows([record])

    expect(row).toEqual({
      Cidade: 'Loanda',
      Categoria: 'GENERICOS',
      'Desconto Fidelidade (%)': 20,
      'Desconto Limite (%)': 15,
      'GAP (p.p.)': -5,
      Situação: 'Inconsistência',
    })
  })

  it('traduz sem_par corretamente', () => {
    const [record] = buildDiscountRecords([pair({ fidelityPercentage: null })])
    const [row] = buildRecordRows([record])
    expect(row.Situação).toBe('Sem par')
  })
})

describe('buildCityRankingRows', () => {
  it('mapeia os campos do resumo por cidade', () => {
    const city: CitySummary = {
      city: 'Loanda',
      averageFidelity: 15,
      averageLimit: 20,
      averageGap: 5,
      categoryCount: 10,
      recordCount: 12,
      matchedCount: 10,
      inconsistencyCount: 1,
    }
    expect(buildCityRankingRows([city])[0]).toEqual({
      Cidade: 'Loanda',
      'Fidelidade média (%)': 15,
      'Limite médio (%)': 20,
      'GAP médio (p.p.)': 5,
      Categorias: 10,
      Registros: 12,
      Inconsistências: 1,
    })
  })
})

describe('buildCategoryRankingRows', () => {
  it('mapeia os campos do resumo por categoria', () => {
    const category: CategorySummary = {
      categoryCode: 418,
      categoryDescription: 'ANALGESICO GENERICO',
      averageFidelity: 17,
      averageLimit: 20,
      averageGap: 3,
      minGap: 1,
      maxGap: 5,
      medianGap: 3,
      cityCount: 10,
      cityWithMaxFidelity: null,
      cityWithMinFidelity: null,
      cityWithMaxGap: null,
      cityWithMinGap: null,
    }
    expect(buildCategoryRankingRows([category])[0]).toEqual({
      Categoria: 'ANALGESICO GENERICO',
      Código: 418,
      'Fidelidade média (%)': 17,
      'Limite médio (%)': 20,
      'GAP médio (p.p.)': 3,
      'GAP mínimo (p.p.)': 1,
      'GAP máximo (p.p.)': 5,
      'Mediana do GAP (p.p.)': 3,
      Cidades: 10,
    })
  })
})
