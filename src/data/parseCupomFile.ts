import {
  CUPOM_COLUMN_ALIASES,
  CUPOM_FORWARD_FILL_FIELDS,
  CUPOM_HEADER_DETECTION_FIELDS,
  type CupomCanonicalColumn,
} from '../config/cupomColumnAliases'
import { CUPOM_STORE_MAP } from '../config/cupomStoreMap'
import { err, ok, type Result } from '../domain/result'
import type { CupomEntry } from '../domain/types'
import { matchColumn } from './matchColumn'
import { parseNumericCell, parseTextCell } from './parseNumericCell'
import type { CupomRawSheet } from './readCupomWorkbook'

const MIN_FILLED_CELLS_FOR_HEADER_ROW = 3
const MAX_ROWS_TO_SCAN_FOR_HEADER = 15
const MIN_HEADER_FIELD_MATCHES = 3
const FOOTER_ROW_MARKERS = ['totais', 'usuario', 'usuário']

export interface CupomStructureError {
  code: 'arquivo_vazio' | 'cabecalho_nao_encontrado' | 'coluna_ausente' | 'coluna_ambigua'
  message: string
}

export interface ParsedCupomFile {
  entries: CupomEntry[]
  skippedRowCount: number
  /** Códigos de loja com venda no arquivo, mas fora do escopo das 10 "lojas de fora" (ou não reconhecidos). */
  outOfScopeStoreCodes: number[]
  citiesDetected: string[]
}

/**
 * Extrai os registros de cupom de um relatório de PDV. Diferente do arquivo
 * de desconto, esse relatório costuma ter linhas de título antes do
 * cabeçalho real, colunas "preenchidas para baixo" (Filial/Categoria só
 * aparecem na primeira linha do grupo) e uma linha de rodapé com totais —
 * por isso tem parser próprio em vez de reaproveitar `parseDiscountFile`.
 */
export function parseCupomFile(rawSheets: CupomRawSheet[]): Result<ParsedCupomFile, CupomStructureError> {
  const sheet = rawSheets.find((candidate) => candidate.rows.some((row) => row && row.length > 0))
  if (!sheet) {
    return err({ code: 'arquivo_vazio', message: 'O relatório de cupons não contém nenhuma linha com dados.' })
  }

  const headerRowIndex = findHeaderRowIndex(sheet.rows)
  if (headerRowIndex === -1) {
    return err({
      code: 'cabecalho_nao_encontrado',
      message:
        'Não foi possível localizar a linha de cabeçalho do relatório de cupons nas primeiras linhas do arquivo (procurei por colunas como Filial, Categoria, Cupom e Venda).',
    })
  }

  const rawHeaderRow = sheet.rows[headerRowIndex]
  const headerTexts = rawHeaderRow
    .map((cell) => (cell === null || cell === undefined ? '' : String(cell).trim()))
    .filter((cell) => cell.length > 0)

  const columnHeaderByField: Partial<Record<CupomCanonicalColumn, string>> = {}
  for (const field of Object.keys(CUPOM_COLUMN_ALIASES) as CupomCanonicalColumn[]) {
    const match = matchColumn(headerTexts, CUPOM_COLUMN_ALIASES[field])
    if (match.status === 'encontrada') columnHeaderByField[field] = match.header
  }

  for (const requiredField of CUPOM_HEADER_DETECTION_FIELDS) {
    if (!columnHeaderByField[requiredField]) {
      return err({
        code: 'coluna_ausente',
        message: `Não foi possível encontrar a coluna "${requiredField}" no relatório de cupons. Colunas encontradas: ${headerTexts.join(', ')}.`,
      })
    }
  }

  const columnIndexByHeaderText = new Map<string, number>()
  rawHeaderRow.forEach((cell, index) => {
    const text = cell === null || cell === undefined ? '' : String(cell).trim()
    if (text && !columnIndexByHeaderText.has(text)) columnIndexByHeaderText.set(text, index)
  })

  const columnIndexByField: Partial<Record<CupomCanonicalColumn, number>> = {}
  for (const field of Object.keys(columnHeaderByField) as CupomCanonicalColumn[]) {
    const headerText = columnHeaderByField[field]
    if (headerText) columnIndexByField[field] = columnIndexByHeaderText.get(headerText)
  }

  const dataRows = sheet.rows.slice(headerRowIndex + 1)
  const lastSeen: Partial<Record<CupomCanonicalColumn, unknown>> = {}
  const entries: CupomEntry[] = []
  let skippedRowCount = 0
  const outOfScopeCodes = new Set<number>()

  for (const row of dataRows) {
    if (!row || row.length === 0) continue
    if (isFooterRow(row)) continue

    const readField = (field: CupomCanonicalColumn): unknown => {
      const index = columnIndexByField[field]
      if (index === undefined) return undefined
      const value = row[index]
      const isBlank = value === null || value === undefined || String(value).trim() === ''
      if (!isBlank) {
        lastSeen[field] = value
        return value
      }
      return CUPOM_FORWARD_FILL_FIELDS.includes(field) ? lastSeen[field] : value
    }

    const storeCode = parseNumericCell(readField('storeCode'))
    const categoryDescription = parseTextCell(readField('categoryDescription'))
    const cupomNumber = parseTextCell(readField('cupomNumber'))
    const saleValue = parseNumericCell(readField('saleValue'))

    if (storeCode === null || !categoryDescription || !cupomNumber || saleValue === null) {
      skippedRowCount += 1
      continue
    }

    const storeInfo = CUPOM_STORE_MAP[storeCode]
    if (!storeInfo || !storeInfo.city) {
      outOfScopeCodes.add(storeCode)
      continue
    }

    entries.push({
      city: storeInfo.city,
      storeCode,
      categoryDescription,
      cupomNumber,
      saleDate: parseTextCell(readField('saleDate')) ?? '',
      saleValue,
      discountValue: parseNumericCell(readField('discountValue')) ?? 0,
      discountPercentage: parseNumericCell(readField('discountPercentage')) ?? 0,
    })
  }

  const citiesDetected = Array.from(new Set(entries.map((entry) => entry.city))).sort((a, b) =>
    a.localeCompare(b, 'pt-BR'),
  )

  return ok({
    entries,
    skippedRowCount,
    outOfScopeStoreCodes: Array.from(outOfScopeCodes).sort((a, b) => a - b),
    citiesDetected,
  })
}

function findHeaderRowIndex(rows: unknown[][]): number {
  for (let i = 0; i < Math.min(rows.length, MAX_ROWS_TO_SCAN_FOR_HEADER); i++) {
    const row = rows[i]
    if (!row) continue
    const candidateHeaders = row
      .map((cell) => (cell === null || cell === undefined ? '' : String(cell).trim()))
      .filter((cell) => cell.length > 0)
    if (candidateHeaders.length < MIN_FILLED_CELLS_FOR_HEADER_ROW) continue

    const matchCount = CUPOM_HEADER_DETECTION_FIELDS.filter(
      (field) => matchColumn(candidateHeaders, CUPOM_COLUMN_ALIASES[field]).status === 'encontrada',
    ).length

    if (matchCount >= MIN_HEADER_FIELD_MATCHES) return i
  }
  return -1
}

function isFooterRow(row: unknown[]): boolean {
  return row.some((cell) => {
    if (cell === null || cell === undefined) return false
    const text = String(cell).toLowerCase()
    return FOOTER_ROW_MARKERS.some((marker) => text.includes(marker))
  })
}
