import type { CategorySummary } from '../domain/summarizeByCategory'
import type { CitySummary } from '../domain/summarizeByCity'
import type { DiscountRecord, GapSituation } from '../domain/types'

const SITUATION_LABEL: Record<GapSituation | 'sem_par', string> = {
  inconsistencia: 'Inconsistência',
  sem_espaco_adicional: 'Sem espaço adicional',
  regular: 'Regular',
  sem_par: 'Sem par',
}

/** Achata os registros para linhas de planilha, com cabeçalhos de negócio (não os nomes internos dos campos). */
export function buildRecordRows(records: DiscountRecord[]): Record<string, unknown>[] {
  return records.map((record) => ({
    Cidade: record.city,
    Categoria: record.categoryDescription,
    'Desconto Fidelidade (%)': record.fidelityPercentage,
    'Desconto Limite (%)': record.limitPercentage,
    'GAP (p.p.)': record.gap,
    Situação: SITUATION_LABEL[record.situation],
  }))
}

export function buildCityRankingRows(cities: CitySummary[]): Record<string, unknown>[] {
  return cities.map((city) => ({
    Cidade: city.city,
    'Fidelidade média (%)': city.averageFidelity,
    'Limite médio (%)': city.averageLimit,
    'GAP médio (p.p.)': city.averageGap,
    Categorias: city.categoryCount,
    Registros: city.recordCount,
    Inconsistências: city.inconsistencyCount,
  }))
}

export function buildCategoryRankingRows(categories: CategorySummary[]): Record<string, unknown>[] {
  return categories.map((category) => ({
    Categoria: category.categoryDescription,
    Código: category.categoryCode,
    'Fidelidade média (%)': category.averageFidelity,
    'Limite médio (%)': category.averageLimit,
    'GAP médio (p.p.)': category.averageGap,
    'GAP mínimo (p.p.)': category.minGap,
    'GAP máximo (p.p.)': category.maxGap,
    'Mediana do GAP (p.p.)': category.medianGap,
    Cidades: category.cityCount,
  }))
}
