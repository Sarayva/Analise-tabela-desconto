import type { StoreAssignment } from './types'

/**
 * Substitui todas as atribuições de uma loja com correção manual por uma
 * única atribuição (a escolhida pelo usuário). Não altera o arquivo
 * original — é uma camada por cima, aplicada só na análise.
 */
export function applyStoreOverrides(
  assignments: StoreAssignment[],
  overrides: Record<number, string>,
): StoreAssignment[] {
  const overriddenCodes = new Set(Object.keys(overrides).map(Number))

  const withoutOverridden = assignments.filter((assignment) => !overriddenCodes.has(assignment.storeCode))

  const corrected: StoreAssignment[] = Object.entries(overrides).map(([codeText, tabela]) => {
    const storeCode = Number(codeText)
    const original = assignments.find((assignment) => assignment.storeCode === storeCode)
    return { storeCode, storeName: original?.storeName ?? `Loja ${storeCode}`, tabela }
  })

  return [...withoutOverridden, ...corrected]
}
