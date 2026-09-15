import type { StoreAssignment } from '../domain/types'

export interface DuplicateStoreAssignment {
  storeCode: number
  storeName: string
  tabelas: string[]
}

/** Aponta lojas atribuídas a mais de uma tabela dentro do mesmo arquivo — uma loja deve pertencer a exatamente uma. */
export function findDuplicateStoreAssignments(assignments: StoreAssignment[]): DuplicateStoreAssignment[] {
  const byCode = new Map<number, { storeName: string; tabelas: Set<string> }>()

  for (const assignment of assignments) {
    const entry = byCode.get(assignment.storeCode) ?? { storeName: assignment.storeName, tabelas: new Set<string>() }
    entry.tabelas.add(assignment.tabela)
    byCode.set(assignment.storeCode, entry)
  }

  const duplicates: DuplicateStoreAssignment[] = []
  for (const [storeCode, { storeName, tabelas }] of byCode) {
    if (tabelas.size > 1) {
      duplicates.push({ storeCode, storeName, tabelas: Array.from(tabelas).sort((a, b) => a.localeCompare(b, 'pt-BR')) })
    }
  }

  return duplicates.sort((a, b) => a.storeCode - b.storeCode)
}
