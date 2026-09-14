import type { SourceFile } from '../domain/types'

export const ACCEPTED_EXTENSIONS = ['.xlsx', '.xls', '.csv'] as const

export const MAX_PREVIEW_ROWS = 15

/** Rótulos de negócio exibidos na interface para cada tipo de arquivo. */
export const SOURCE_FILE_LABEL: Record<SourceFile, string> = {
  fidelidade: 'Desconto Fidelidade',
  limite: 'Desconto Limite',
}
