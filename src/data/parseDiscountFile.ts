import {
  COLUMN_ALIASES,
  COLUMN_LABEL,
  REQUIRED_PERCENTAGE_COLUMN,
  type CanonicalColumn,
} from '../config/columnAliases'
import { MAX_PREVIEW_ROWS, SOURCE_FILE_LABEL } from '../config/fileFormat'
import type { DiscountEntry, SourceFile, StoreAssignment } from '../domain/types'
import { err, ok, type Result } from '../domain/result'
import { deriveCityFromSheetName } from './deriveCityFromSheetName'
import { extractStoreAssignments } from './extractStoreAssignments'
import { matchColumn } from './matchColumn'
import { parseNumericCell, parseTextCell } from './parseNumericCell'
import type { RawSheet } from './rawSheet'

export type CityStrategy = { mode: 'por_aba' } | { mode: 'por_coluna'; header: string }

export interface ColumnMappingInfo {
  categoryCode: string
  categoryDescription: string
  percentage: string
  fidelityMaxPercentage?: string
}

export interface ParsedFile {
  source: SourceFile
  entries: DiscountEntry[]
  citiesDetected: string[]
  rowCount: number
  skippedRowCount: number
  columnMapping: ColumnMappingInfo
  cityStrategy: CityStrategy
  previewRows: Record<string, unknown>[]
  previewHeaders: string[]
  /** Tabela auxiliar de lojas (Código + Nome da filial), quando presente nas abas do arquivo. */
  storeAssignments: StoreAssignment[]
}

export interface FileStructureError {
  code: 'arquivo_vazio' | 'coluna_ausente' | 'coluna_ambigua' | 'cidade_indefinida'
  message: string
}

export function parseDiscountFile(
  rawSheets: RawSheet[],
  source: SourceFile,
): Result<ParsedFile, FileStructureError> {
  const nonEmptySheets = rawSheets.filter((sheet) => sheet.headers.length > 0)
  if (nonEmptySheets.length === 0) {
    return err({
      code: 'arquivo_vazio',
      message: `O arquivo de ${SOURCE_FILE_LABEL[source]} não contém nenhuma aba com cabeçalho de colunas.`,
    })
  }

  const referenceSheet = nonEmptySheets[0]
  const referenceHeaders = referenceSheet.headers

  const cityStrategyResult = resolveCityStrategy(nonEmptySheets, referenceHeaders)
  if (!cityStrategyResult.ok) return cityStrategyResult

  const categoryCodeMatch = matchColumn(referenceHeaders, COLUMN_ALIASES.categoryCode)
  const columnError = describeIfProblematic('categoryCode', categoryCodeMatch, referenceHeaders)
  if (columnError) return err(columnError)

  const categoryDescriptionMatch = matchColumn(referenceHeaders, COLUMN_ALIASES.categoryDescription)
  const descriptionError = describeIfProblematic(
    'categoryDescription',
    categoryDescriptionMatch,
    referenceHeaders,
  )
  if (descriptionError) return err(descriptionError)

  const percentageField = REQUIRED_PERCENTAGE_COLUMN[source]
  const percentageMatch = matchColumn(referenceHeaders, COLUMN_ALIASES[percentageField])
  const percentageError = describeIfProblematic(percentageField, percentageMatch, referenceHeaders)
  if (percentageError) return err(percentageError)

  // Coluna de referência opcional: se ausente ou ambígua, apenas não é usada — não bloqueia a análise.
  const fidelityMaxMatch =
    source === 'fidelidade'
      ? matchColumn(referenceHeaders, COLUMN_ALIASES.fidelityMaxPercentage)
      : { status: 'ausente' as const }

  const categoryCodeHeader = (categoryCodeMatch as { status: 'encontrada'; header: string }).header
  const categoryDescriptionHeader = (categoryDescriptionMatch as { status: 'encontrada'; header: string })
    .header
  const percentageHeader = (percentageMatch as { status: 'encontrada'; header: string }).header
  const fidelityMaxHeader =
    fidelityMaxMatch.status === 'encontrada' ? fidelityMaxMatch.header : undefined

  const cityStrategy = cityStrategyResult.value

  const entries: DiscountEntry[] = []
  let skippedRowCount = 0

  for (const sheet of nonEmptySheets) {
    const cityFromSheetName =
      cityStrategy.mode === 'por_aba' ? deriveCityFromSheetName(sheet.sheetName) : null

    for (const row of sheet.rows) {
      const city =
        cityStrategy.mode === 'por_aba' ? cityFromSheetName : parseTextCell(row[cityStrategy.header])
      const categoryCode = parseNumericCell(row[categoryCodeHeader])
      const categoryDescription = parseTextCell(row[categoryDescriptionHeader])
      const percentage = parseNumericCell(row[percentageHeader])

      if (!city || categoryCode === null || !categoryDescription || percentage === null) {
        skippedRowCount += 1
        continue
      }

      entries.push({ city, categoryCode, categoryDescription, percentage, source })
    }
  }

  const citiesDetected = Array.from(new Set(entries.map((entry) => entry.city))).sort((a, b) =>
    a.localeCompare(b, 'pt-BR'),
  )

  return ok({
    source,
    entries,
    citiesDetected,
    rowCount: entries.length,
    skippedRowCount,
    columnMapping: {
      categoryCode: categoryCodeHeader,
      categoryDescription: categoryDescriptionHeader,
      percentage: percentageHeader,
      fidelityMaxPercentage: fidelityMaxHeader,
    },
    cityStrategy,
    previewRows: referenceSheet.rows.slice(0, MAX_PREVIEW_ROWS),
    previewHeaders: referenceHeaders,
    storeAssignments: extractStoreAssignments(nonEmptySheets),
  })
}

/** Nomes de aba padrão de planilha (não representam uma cidade real). */
const GENERIC_SHEET_NAME = /^(sheet|plan|planilha|pagina|página)\s*\d*$/i

/**
 * Decide como determinar a cidade de cada registro. Uma coluna "Cidade"
 * explícita, quando existe, tem prioridade sobre o nome da aba — é o sinal
 * mais confiável. Na ausência dela, cada aba é tratada como uma cidade
 * (inclusive quando o arquivo tem uma única aba nomeada, ex.: "Loanda - 2225").
 * Só é um erro estrutural quando não há coluna "Cidade" e a única aba tem um
 * nome genérico de planilha, que não permite inferir a cidade.
 */
function resolveCityStrategy(
  sheets: RawSheet[],
  referenceHeaders: string[],
): Result<CityStrategy, FileStructureError> {
  const cityMatch = matchColumn(referenceHeaders, COLUMN_ALIASES.city)

  if (cityMatch.status === 'ambigua') {
    return err({
      code: 'coluna_ambigua',
      message: `Mais de uma coluna parece indicar a cidade (${cityMatch.headers.join(', ')}). Renomeie as colunas para deixar claro qual delas representa a cidade.`,
    })
  }

  if (cityMatch.status === 'encontrada') {
    return ok({ mode: 'por_coluna', header: cityMatch.header })
  }

  if (sheets.length > 1) return ok({ mode: 'por_aba' })

  const [onlySheet] = sheets
  if (GENERIC_SHEET_NAME.test(onlySheet.sheetName.trim())) {
    return err({
      code: 'cidade_indefinida',
      message:
        'O arquivo tem apenas uma aba, sem um nome que identifique uma cidade, e nenhuma coluna "Cidade" foi encontrada. Adicione uma coluna "Cidade" ou nomeie a aba com o nome da cidade.',
    })
  }

  return ok({ mode: 'por_aba' })
}

function describeIfProblematic(
  field: CanonicalColumn,
  match: ReturnType<typeof matchColumn>,
  headers: string[],
): FileStructureError | null {
  if (match.status === 'encontrada') return null

  const label = COLUMN_LABEL[field]
  if (match.status === 'ambigua') {
    return {
      code: 'coluna_ambigua',
      message: `Mais de uma coluna parece corresponder a "${label}" (${match.headers.join(', ')}). Renomeie as colunas para remover a ambiguidade.`,
    }
  }

  return {
    code: 'coluna_ausente',
    message: `Não foi possível encontrar a coluna "${label}". Colunas encontradas no arquivo: ${headers.join(', ')}.`,
  }
}
