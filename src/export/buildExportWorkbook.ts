import type { WorkBook } from 'xlsx'

export interface ExportSheet {
  name: string
  rows: Record<string, unknown>[]
}

/**
 * Monta um workbook com uma aba por relatório. Não grava nada em disco — só a
 * estrutura em memória. O SheetJS é importado dinamicamente — só é necessário
 * quando o usuário realmente pede uma exportação.
 */
export async function buildExportWorkbook(sheets: ExportSheet[]): Promise<WorkBook> {
  const XLSX = await import('xlsx')
  const workbook = XLSX.utils.book_new()
  for (const sheet of sheets) {
    const worksheet = XLSX.utils.json_to_sheet(sheet.rows)
    XLSX.utils.book_append_sheet(workbook, worksheet, sanitizeSheetName(sheet.name))
  }
  return workbook
}

/** Nomes de aba do Excel não podem ter : \ / ? * [ ] nem passar de 31 caracteres. */
function sanitizeSheetName(name: string): string {
  return name.replace(/[:\\/?*[\]]/g, '').slice(0, 31)
}
