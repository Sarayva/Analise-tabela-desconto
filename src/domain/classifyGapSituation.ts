import type { GapSituation } from './types'

/**
 * Classifica a relação entre Limite e Fidelidade, conforme a regra de negócio:
 * Limite < Fidelidade -> inconsistência (a loja pratica mais do que pode);
 * Limite = Fidelidade -> sem espaço adicional para negociar;
 * Limite > Fidelidade -> regular.
 */
export function classifyGapSituation(gap: number): GapSituation {
  if (gap < 0) return 'inconsistencia'
  if (gap === 0) return 'sem_espaco_adicional'
  return 'regular'
}
