import type { WorkBook } from 'xlsx'

/** Único ponto que sabe que a exportação dispara um download no navegador. */
export async function downloadWorkbook(workbook: WorkBook, fileName: string): Promise<void> {
  const XLSX = await import('xlsx')
  XLSX.writeFile(workbook, fileName)
}
