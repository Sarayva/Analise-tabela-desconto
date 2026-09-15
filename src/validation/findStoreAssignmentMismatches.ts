import type { StoreAssignment } from '../domain/types'

export interface StoreAssignmentMismatch {
  storeCode: number
  storeName: string
  fidelityTabela: string | null
  limitTabela: string | null
}

/** Aponta lojas cuja tabela difere entre o arquivo de Fidelidade e o de Limite — deveria ser a mesma nos dois. */
export function findStoreAssignmentMismatches(
  fidelityAssignments: StoreAssignment[],
  limitAssignments: StoreAssignment[],
): StoreAssignmentMismatch[] {
  const fidelityByCode = new Map(fidelityAssignments.map((assignment) => [assignment.storeCode, assignment]))
  const limitByCode = new Map(limitAssignments.map((assignment) => [assignment.storeCode, assignment]))
  const allCodes = new Set([...fidelityByCode.keys(), ...limitByCode.keys()])

  const mismatches: StoreAssignmentMismatch[] = []
  for (const code of allCodes) {
    const fidelity = fidelityByCode.get(code)
    const limit = limitByCode.get(code)
    if (fidelity && limit && fidelity.tabela !== limit.tabela) {
      mismatches.push({
        storeCode: code,
        storeName: fidelity.storeName,
        fidelityTabela: fidelity.tabela,
        limitTabela: limit.tabela,
      })
    }
  }

  return mismatches.sort((a, b) => a.storeCode - b.storeCode)
}
