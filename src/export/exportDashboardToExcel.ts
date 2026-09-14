import type { CategorySummary } from '../domain/summarizeByCategory'
import type { CitySummary } from '../domain/summarizeByCity'
import type { DiscountRecord } from '../domain/types'
import { buildCategoryRankingRows, buildCityRankingRows, buildRecordRows } from './buildExportRows'
import { buildExportWorkbook } from './buildExportWorkbook'
import { downloadWorkbook } from './downloadWorkbook'

export interface DashboardExportInput {
  records: DiscountRecord[]
  cities: CitySummary[]
  categories: CategorySummary[]
}

/** Exporta o recorte atual do dashboard (respeitando os filtros ativos) em um único .xlsx com várias abas. */
export async function exportDashboardToExcel({ records, cities, categories }: DashboardExportInput): Promise<void> {
  const inconsistencies = records.filter((record) => record.situation === 'inconsistencia')

  const workbook = await buildExportWorkbook([
    { name: 'Dados filtrados', rows: buildRecordRows(records) },
    { name: 'Ranking de cidades', rows: buildCityRankingRows(cities) },
    { name: 'Ranking de categorias', rows: buildCategoryRankingRows(categories) },
    { name: 'Inconsistências', rows: buildRecordRows(inconsistencies) },
  ])

  await downloadWorkbook(workbook, `analise-descontos-${todayStamp()}.xlsx`)
}

function todayStamp(): string {
  return new Date().toISOString().slice(0, 10)
}
