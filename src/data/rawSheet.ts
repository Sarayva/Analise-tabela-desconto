/** Uma aba/tabela lida do arquivo, antes de qualquer mapeamento de coluna. */
export interface RawSheet {
  sheetName: string
  headers: string[]
  rows: Record<string, unknown>[]
  /**
   * As mesmas linhas em modo bruto (array por posição de coluna). Necessário
   * para ler tabelas auxiliares dentro da mesma aba (ex.: a lista de lojas
   * nas colunas G/H) sem depender da renomeação automática do SheetJS quando
   * há cabeçalhos duplicados (ex.: duas colunas "Código").
   */
  arrayRows: unknown[][]
}
