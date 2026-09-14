import { average, maxValue, median, minValue } from './statistics'
import type { DiscountRecord, GapSituation } from './types'

export interface SituationCount {
  count: number
  percentage: number
}

export interface GapDistributionSummary {
  /** Total de registros com os dois lados presentes (o único universo em que o GAP existe). */
  totalWithGap: number
  bySituation: Record<GapSituation, SituationCount>
  maxGap: number | null
  minGap: number | null
  averageGap: number | null
  medianGap: number | null
}

const SITUATIONS: GapSituation[] = ['inconsistencia', 'sem_espaco_adicional', 'regular']

/**
 * Estatísticas de GAP (Limite - Fidelidade) sobre os registros que têm os
 * dois valores. Registros `sem_par` (só existem em um arquivo) ficam de fora
 * — eles são um problema de completude dos dados, já reportado na validação,
 * não uma situação de GAP.
 */
export function summarizeGapDistribution(records: DiscountRecord[]): GapDistributionSummary {
  const gaps = records.map((record) => record.gap).filter((gap): gap is number => gap !== null)
  const totalWithGap = gaps.length

  const rawCounts: Record<GapSituation, number> = {
    inconsistencia: 0,
    sem_espaco_adicional: 0,
    regular: 0,
  }
  for (const record of records) {
    if (record.situation !== 'sem_par') rawCounts[record.situation] += 1
  }

  const bySituation = Object.fromEntries(
    SITUATIONS.map((situation) => [
      situation,
      {
        count: rawCounts[situation],
        percentage: totalWithGap > 0 ? (rawCounts[situation] / totalWithGap) * 100 : 0,
      },
    ]),
  ) as Record<GapSituation, SituationCount>

  return {
    totalWithGap,
    bySituation,
    maxGap: maxValue(gaps),
    minGap: minValue(gaps),
    averageGap: average(gaps),
    medianGap: median(gaps),
  }
}
