import type { DiscountRecord, GapSituation } from './types'

export type SituationFilterValue = GapSituation | 'sem_par'

export interface RecordFilter {
  city: string | null
  categoryCode: number | null
  situation: SituationFilterValue | null
}

export const NO_FILTER: RecordFilter = { city: null, categoryCode: null, situation: null }

/** `null` num campo do filtro significa "todos" — só filtra pelos campos preenchidos. */
export function filterRecords(records: DiscountRecord[], filter: RecordFilter): DiscountRecord[] {
  return records.filter((record) => {
    if (filter.city !== null && record.city !== filter.city) return false
    if (filter.categoryCode !== null && record.categoryCode !== filter.categoryCode) return false
    if (filter.situation !== null && record.situation !== filter.situation) return false
    return true
  })
}
