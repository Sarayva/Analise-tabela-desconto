import { OUT_OF_TOWN_CITIES } from '../config/outOfTownCities'
import { normalizeCityName } from '../domain/normalizeCityName'
import type { StoreAssignment, StoreDirectoryEntry } from '../domain/types'

export interface StoreAssignmentProblem {
  storeCode: number
  storeName: string
  /** Cidade real da loja, segundo a lista oficial. `null` se o código não consta na lista. */
  expectedCity: string | null
  /** Todas as tabelas às quais essa loja está atribuída nos arquivos de desconto (Fidelidade + Limite combinados). */
  assignedTabelas: string[]
  /** Dentre `assignedTabelas`, as que claramente não deveriam ter essa loja. */
  incorrectTabelas: string[]
}

/**
 * Compara dois nomes de cidade tolerando diferenças de acento/caixa (ex.:
 * "Paranavaí" x "Paranavai") e forma completa x abreviada (ex.: "Jandaia do
 * Sul" x "Jandaia") — a lista oficial de lojas é escrita livremente pelo
 * usuário e não precisa bater caractere a caractere com o nome da aba do
 * arquivo de desconto para ser reconhecida como a mesma cidade.
 */
function citiesMatch(a: string, b: string): boolean {
  const normalizedA = normalizeCityName(a)
  const normalizedB = normalizeCityName(b)
  return (
    normalizedA === normalizedB ||
    normalizedA.startsWith(`${normalizedB} `) ||
    normalizedB.startsWith(`${normalizedA} `)
  )
}

/**
 * Cruza as atribuições de loja extraídas dos arquivos de desconto com a
 * lista oficial de lojas (código -> cidade real) para apontar, com confiança,
 * quais atribuições estão erradas — não só "isso é ambíguo", mas "isso está
 * errado porque a lista oficial diz outra coisa".
 */
export function findStoreAssignmentProblems(
  assignments: StoreAssignment[],
  directory: StoreDirectoryEntry[],
): StoreAssignmentProblem[] {
  const directoryByCode = new Map(directory.map((entry) => [entry.code, entry]))

  const tabelasByCode = new Map<number, { storeName: string; tabelas: Set<string> }>()
  for (const assignment of assignments) {
    const entry = tabelasByCode.get(assignment.storeCode) ?? { storeName: assignment.storeName, tabelas: new Set<string>() }
    entry.tabelas.add(assignment.tabela)
    tabelasByCode.set(assignment.storeCode, entry)
  }

  const problems: StoreAssignmentProblem[] = []

  for (const [storeCode, { storeName, tabelas }] of tabelasByCode) {
    const assignedTabelas = Array.from(tabelas).sort((a, b) => a.localeCompare(b, 'pt-BR'))
    const expectedCity = directoryByCode.get(storeCode)?.city ?? null

    const incorrectTabelas = findIncorrectTabelas(assignedTabelas, expectedCity)

    // Só reporta quando há mais de uma tabela (ambiguidade) ou uma incorreção confirmada pela lista oficial.
    if (assignedTabelas.length > 1 || incorrectTabelas.length > 0) {
      problems.push({ storeCode, storeName, expectedCity, assignedTabelas, incorrectTabelas })
    }
  }

  return problems.sort((a, b) => a.storeCode - b.storeCode)
}

function findIncorrectTabelas(assignedTabelas: string[], expectedCity: string | null): string[] {
  if (expectedCity === null) return []

  const matchingKnownCity = OUT_OF_TOWN_CITIES.find((city) => citiesMatch(city, expectedCity))

  if (matchingKnownCity) {
    return assignedTabelas.filter((tabela) => !citiesMatch(tabela, matchingKnownCity))
  }

  // Loja fora das 10 "lojas de fora" (ex.: Maringá) — não dá pra saber qual das
  // sub-tabelas é a certa, mas qualquer atribuição a uma das 10 cidades conhecidas é, com certeza, errada.
  return assignedTabelas.filter((tabela) => OUT_OF_TOWN_CITIES.some((city) => citiesMatch(city, tabela)))
}
