export interface CupomRawSheet {
  sheetName: string
  /** Linhas em modo bruto (array por posição de coluna) — o relatório de cupons tem linhas de título antes do cabeçalho real, então não dá para assumir a primeira linha como header. */
  rows: unknown[][]
}

/**
 * Lê o relatório de cupons (.xlsx/.xls, incluindo o formato Excel 2003 XML
 * exportado por alguns PDVs) em modo bruto por posição de célula. O SheetJS é
 * importado dinamicamente — só carrega quando o usuário realmente envia um arquivo.
 */
export async function readCupomWorkbook(file: File): Promise<CupomRawSheet[]> {
  const XLSX = await import('xlsx')
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })

  return workbook.SheetNames.map((sheetName) => {
    const sheet = workbook.Sheets[sheetName]
    const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: null, raw: true })
    return { sheetName, rows }
  })
}
