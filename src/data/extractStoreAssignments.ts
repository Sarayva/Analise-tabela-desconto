import { IGNORED_STORE_CODES } from '../config/outOfTownCities'
import type { StoreAssignment } from '../domain/types'
import { deriveCityFromSheetName } from './deriveCityFromSheetName'
import { normalizeHeader } from './normalizeHeader'
import { parseNumericCell, parseTextCell } from './parseNumericCell'
import type { RawSheet } from './rawSheet'

/**
 * Extrai a tabela auxiliar de lojas (Código + Nome da filial) que existe
 * dentro de cada aba de um arquivo de desconto, ao lado da tabela de
 * categorias. Localiza as colunas pelo texto do cabeçalho "Nome da filial"
 * (a coluna de código fica imediatamente à esquerda dela) em vez de uma
 * posição fixa, para não quebrar se o layout mudar. Uma aba sem essa tabela
 * simplesmente não contribui nenhuma atribuição — não é um erro.
 */
export function extractStoreAssignments(rawSheets: RawSheet[]): StoreAssignment[] {
  const assignments: StoreAssignment[] = []

  for (const sheet of rawSheets) {
    const headerRow = sheet.arrayRows[0]
    if (!headerRow) continue

    const columns = findStoreTableColumns(headerRow)
    if (!columns) continue

    const tabela = deriveCityFromSheetName(sheet.sheetName)

    for (const row of sheet.arrayRows.slice(1)) {
      if (!row) continue
      const storeCode = parseNumericCell(row[columns.codeIndex])
      const storeName = parseTextCell(row[columns.nameIndex])
      if (storeCode === null || !storeName) continue
      if ((IGNORED_STORE_CODES as readonly number[]).includes(storeCode)) continue
      assignments.push({ storeCode, storeName, tabela })
    }
  }

  return assignments
}

function findStoreTableColumns(headerRow: unknown[]): { codeIndex: number; nameIndex: number } | null {
  const targetHeader = normalizeHeader('Nome da filial')
  const nameIndex = headerRow.findIndex((cell) => normalizeHeader(String(cell ?? '')) === targetHeader)
  if (nameIndex <= 0) return null
  return { codeIndex: nameIndex - 1, nameIndex }
}
