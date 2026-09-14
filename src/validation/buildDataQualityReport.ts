import type { ParsedFile } from '../data/parseDiscountFile'
import { joinDiscountEntries } from '../domain/joinDiscountEntries'
import type { EntryPair } from '../domain/types'
import { detectCityNameVariants, type CityNameVariant } from './detectCityNameVariants'
import { detectDuplicateEntries, type DuplicateEntry } from './detectDuplicateEntries'
import { detectPercentageOutliers, type PercentageOutlier } from './detectPercentageOutliers'

export interface DataQualityReport {
  totalCities: number
  totalCategories: number
  totalCombinations: number
  /** Todas as combinações Cidade + Categoria (a união dos dois arquivos), para a etapa de processamento consumir. */
  allPairs: EntryPair[]
  matchedCombinations: EntryPair[]
  onlyInFidelity: EntryPair[]
  onlyInLimit: EntryPair[]
  duplicatesInFidelity: DuplicateEntry[]
  duplicatesInLimit: DuplicateEntry[]
  skippedRowsInFidelity: number
  skippedRowsInLimit: number
  percentageOutliers: PercentageOutlier[]
  cityNameVariants: CityNameVariant[]
}

/**
 * Camada de validação: cruza os dois arquivos já lidos (Fase 2) e produz um
 * diagnóstico de qualidade dos dados. Não calcula GAP nem classifica
 * inconsistências de negócio — isso é responsabilidade da etapa de
 * processamento, que consome `matchedCombinations`.
 */
export function buildDataQualityReport(fidelity: ParsedFile, limit: ParsedFile): DataQualityReport {
  const pairs = joinDiscountEntries(fidelity.entries, limit.entries)

  const onlyInFidelity = pairs.filter((pair) => pair.fidelityPercentage !== null && pair.limitPercentage === null)
  const onlyInLimit = pairs.filter((pair) => pair.fidelityPercentage === null && pair.limitPercentage !== null)
  const matchedCombinations = pairs.filter(
    (pair) => pair.fidelityPercentage !== null && pair.limitPercentage !== null,
  )

  return {
    totalCities: new Set(pairs.map((pair) => pair.city)).size,
    totalCategories: new Set(pairs.map((pair) => pair.categoryCode)).size,
    totalCombinations: pairs.length,
    allPairs: pairs,
    matchedCombinations,
    onlyInFidelity,
    onlyInLimit,
    duplicatesInFidelity: detectDuplicateEntries(fidelity.entries),
    duplicatesInLimit: detectDuplicateEntries(limit.entries),
    skippedRowsInFidelity: fidelity.skippedRowCount,
    skippedRowsInLimit: limit.skippedRowCount,
    percentageOutliers: [
      ...detectPercentageOutliers(fidelity.entries),
      ...detectPercentageOutliers(limit.entries),
    ],
    cityNameVariants: detectCityNameVariants(fidelity.citiesDetected, limit.citiesDetected),
  }
}
