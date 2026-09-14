import { average } from './statistics'
import { isMatchedRecord, type DiscountRecord } from './types'

export interface OverallSummary {
  averageFidelity: number | null
  averageLimit: number | null
}

/** Fidelidade e Limite médios entre todos os registros com os dois valores presentes. */
export function summarizeOverall(records: DiscountRecord[]): OverallSummary {
  const matched = records.filter(isMatchedRecord)
  return {
    averageFidelity: average(matched.map((record) => record.fidelityPercentage)),
    averageLimit: average(matched.map((record) => record.limitPercentage)),
  }
}
