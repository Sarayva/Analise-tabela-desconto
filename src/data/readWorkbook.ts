import type { WorkSheet } from 'xlsx'
import type { RawSheet } from './rawSheet'

/**
 * Lê um arquivo (.xlsx/.xls/.csv) inteiramente no navegador e devolve suas
 * abas em formato bruto, sem nenhum mapeamento de coluna ou regra de negócio.
 * Não há upload para servidor: o parsing acontece com o binário em memória.
 *
 * O SheetJS é importado dinamicamente aqui — é uma biblioteca grande que só é
 * necessária depois que o usuário seleciona um arquivo, não no carregamento
 * inicial da página.
 */
export async function readWorkbook(file: File): Promise<RawSheet[]> {
  const XLSX = await import('xlsx')
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })

  return workbook.SheetNames.map((sheetName) => {
    const sheet = workbook.Sheets[sheetName]
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: null,
      raw: true,
    })
    const headers = rows.length > 0 ? Object.keys(rows[0]) : readHeaderRow(XLSX, sheet)
    return { sheetName, headers, rows }
  })
}

function readHeaderRow(XLSX: typeof import('xlsx'), sheet: WorkSheet): string[] {
  const [headerRow] = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1 })
  if (!headerRow) return []
  return headerRow.map((cell) => String(cell ?? '').trim()).filter((cell) => cell.length > 0)
}
