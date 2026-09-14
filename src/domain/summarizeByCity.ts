import { average } from './statistics'
import { isMatchedRecord, type DiscountRecord } from './types'

export interface CitySummary {
  city: string
  averageFidelity: number | null
  averageLimit: number | null
  averageGap: number | null
  categoryCount: number
  recordCount: number
  matchedCount: number
  inconsistencyCount: number
}

/** Agrega os registros por cidade, para o ranking de cidades (não considera registros `sem_par` nas médias). */
export function summarizeByCity(records: DiscountRecord[]): CitySummary[] {
  const byCity = new Map<string, DiscountRecord[]>()
  for (const record of records) {
    const list = byCity.get(record.city) ?? []
    list.push(record)
    byCity.set(record.city, list)
  }

  return Array.from(byCity.entries()).map(([city, cityRecords]) => {
    const matched = cityRecords.filter(isMatchedRecord)

    return {
      city,
      averageFidelity: average(matched.map((record) => record.fidelityPercentage)),
      averageLimit: average(matched.map((record) => record.limitPercentage)),
      averageGap: average(matched.map((record) => record.gap)),
      categoryCount: new Set(cityRecords.map((record) => record.categoryCode)).size,
      recordCount: cityRecords.length,
      matchedCount: matched.length,
      inconsistencyCount: cityRecords.filter((record) => record.situation === 'inconsistencia').length,
    }
  })
}
