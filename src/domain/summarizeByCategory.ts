import { average, extremeItem, maxValue, median, minValue } from './statistics'
import { isMatchedRecord, type DiscountRecord, type MatchedDiscountRecord } from './types'

export interface CityExtreme {
  city: string
  value: number
}

export interface CategorySummary {
  categoryCode: number
  categoryDescription: string
  averageFidelity: number | null
  averageLimit: number | null
  averageGap: number | null
  minGap: number | null
  maxGap: number | null
  medianGap: number | null
  cityCount: number
  cityWithMaxFidelity: CityExtreme | null
  cityWithMinFidelity: CityExtreme | null
  cityWithMaxGap: CityExtreme | null
  cityWithMinGap: CityExtreme | null
}

/** Agrega os registros por categoria, para a análise por categoria (só considera registros com os dois lados). */
export function summarizeByCategory(records: DiscountRecord[]): CategorySummary[] {
  const byCategory = new Map<number, DiscountRecord[]>()
  for (const record of records) {
    const list = byCategory.get(record.categoryCode) ?? []
    list.push(record)
    byCategory.set(record.categoryCode, list)
  }

  return Array.from(byCategory.entries()).map(([categoryCode, categoryRecords]) => {
    const matched = categoryRecords.filter(isMatchedRecord)
    const gaps = matched.map((record) => record.gap)

    return {
      categoryCode,
      categoryDescription: categoryRecords[0].categoryDescription,
      averageFidelity: average(matched.map((record) => record.fidelityPercentage)),
      averageLimit: average(matched.map((record) => record.limitPercentage)),
      averageGap: average(gaps),
      minGap: minValue(gaps),
      maxGap: maxValue(gaps),
      medianGap: median(gaps),
      cityCount: new Set(categoryRecords.map((record) => record.city)).size,
      cityWithMaxFidelity: toExtreme(matched, (record) => record.fidelityPercentage, 'max'),
      cityWithMinFidelity: toExtreme(matched, (record) => record.fidelityPercentage, 'min'),
      cityWithMaxGap: toExtreme(matched, (record) => record.gap, 'max'),
      cityWithMinGap: toExtreme(matched, (record) => record.gap, 'min'),
    }
  })
}

function toExtreme(
  matched: MatchedDiscountRecord[],
  selector: (record: MatchedDiscountRecord) => number,
  mode: 'max' | 'min',
): CityExtreme | null {
  const record = extremeItem(matched, selector, mode)
  return record ? { city: record.city, value: selector(record) } : null
}
