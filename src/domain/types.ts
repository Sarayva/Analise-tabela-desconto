/**
 * Tipos centrais do domínio de análise de descontos.
 * Nenhuma dependência de React, I/O ou bibliotecas externas — apenas modelo de dados.
 */

export type SourceFile = 'fidelidade' | 'limite'

/** Uma linha normalizada, já ligada a uma cidade, vinda de um dos dois arquivos. */
export interface DiscountEntry {
  city: string
  categoryCode: number
  categoryDescription: string
  percentage: number
  source: SourceFile
}

/**
 * Uma combinação Cidade + Categoria já cruzada entre os dois arquivos, antes
 * do cálculo de GAP (etapa de validação/junção). `fidelityPercentage` ou
 * `limitPercentage` são `null` quando a combinação existe em apenas um dos
 * dois arquivos.
 */
export interface EntryPair {
  city: string
  categoryCode: number
  categoryDescription: string
  fidelityPercentage: number | null
  limitPercentage: number | null
}

export type GapSituation = 'inconsistencia' | 'sem_espaco_adicional' | 'regular'

/**
 * Registro cruzado Fidelidade x Limite para uma cidade + categoria.
 * `fidelityPercentage` ou `limitPercentage` podem ser `null` quando o registro
 * existe em apenas um dos dois arquivos — isso nunca deve ser tratado como zero.
 */
export interface DiscountRecord {
  city: string
  categoryCode: number
  categoryDescription: string
  fidelityPercentage: number | null
  limitPercentage: number | null
  gap: number | null
  situation: GapSituation | 'sem_par'
}

/** Um `DiscountRecord` que existe nos dois arquivos — os três campos numéricos deixam de ser opcionais. */
export interface MatchedDiscountRecord extends DiscountRecord {
  fidelityPercentage: number
  limitPercentage: number
  gap: number
  situation: GapSituation
}

export function isMatchedRecord(record: DiscountRecord): record is MatchedDiscountRecord {
  return record.gap !== null
}
