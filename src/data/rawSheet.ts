/** Uma aba/tabela lida do arquivo, antes de qualquer mapeamento de coluna. */
export interface RawSheet {
  sheetName: string
  headers: string[]
  rows: Record<string, unknown>[]
}
