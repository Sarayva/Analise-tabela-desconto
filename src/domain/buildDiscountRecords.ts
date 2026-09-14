import { calculateGap } from './calculateGap'
import { classifyGapSituation } from './classifyGapSituation'
import type { DiscountRecord, EntryPair } from './types'

/**
 * Converte cada combinação Cidade + Categoria já cruzada (Fase de validação)
 * em um registro de análise com GAP e situação. Uma combinação que existe em
 * apenas um dos arquivos recebe `situation: 'sem_par'` e `gap: null` — não é
 * classificada como inconsistência, regular etc., pois não há os dois lados
 * para comparar.
 */
export function buildDiscountRecords(pairs: EntryPair[]): DiscountRecord[] {
  return pairs.map((pair) => {
    if (pair.fidelityPercentage === null || pair.limitPercentage === null) {
      return { ...pair, gap: null, situation: 'sem_par' }
    }

    const gap = calculateGap(pair.fidelityPercentage, pair.limitPercentage)
    return { ...pair, gap, situation: classifyGapSituation(gap) }
  })
}
