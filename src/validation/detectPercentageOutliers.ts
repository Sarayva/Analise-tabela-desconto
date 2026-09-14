import type { DiscountEntry } from '../domain/types'

export type PercentageOutlierReason = 'negativo' | 'acima_de_100'

export interface PercentageOutlier {
  city: string
  categoryCode: number
  categoryDescription: string
  percentage: number
  reason: PercentageOutlierReason
}

/**
 * Sinaliza percentuais fora da faixa plausível (negativo ou acima de 100%).
 * Não corrige nem descarta o valor — apenas reporta para o usuário decidir.
 */
export function detectPercentageOutliers(entries: DiscountEntry[]): PercentageOutlier[] {
  const outliers: PercentageOutlier[] = []

  for (const entry of entries) {
    const reason: PercentageOutlierReason | null =
      entry.percentage < 0 ? 'negativo' : entry.percentage > 100 ? 'acima_de_100' : null

    if (reason) {
      outliers.push({
        city: entry.city,
        categoryCode: entry.categoryCode,
        categoryDescription: entry.categoryDescription,
        percentage: entry.percentage,
        reason,
      })
    }
  }

  return outliers
}
