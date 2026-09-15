export type CupomCanonicalColumn =
  | 'storeCode'
  | 'categoryDescription'
  | 'cupomNumber'
  | 'saleDate'
  | 'saleValue'
  | 'discountValue'
  | 'discountPercentage'

/** Aliases aceitos por coluna, comparados após normalização (sem acento, minúsculo, sem pontuação). */
export const CUPOM_COLUMN_ALIASES: Record<CupomCanonicalColumn, string[]> = {
  storeCode: ['codfilial', 'cod filial', 'filial', 'codloja', 'cod loja', 'loja'],
  categoryDescription: ['categoria', 'descricao categoria', 'grupo', 'departamento'],
  cupomNumber: ['nrcupom', 'numero cupom', 'num cupom', 'cupom', 'cod cupom', 'nro cupom'],
  saleDate: ['datavenda', 'data venda', 'data', 'dataemissao'],
  saleValue: ['vlrvenda', 'valor venda', 'venda', 'totalvenda'],
  discountValue: ['vlrdescitens', 'valor desconto', 'desconto', 'vlrdesconto'],
  discountPercentage: ['descontofinal', 'pctdesconto', 'perc desconto', 'percentual desconto'],
}

/**
 * Colunas usadas para reconhecer a linha de cabeçalho real (o relatório de
 * cupons costuma ter 1-2 linhas de título antes dela). Um subconjunto
 * suficientemente distintivo — não precisa ser todas as colunas do arquivo.
 */
export const CUPOM_HEADER_DETECTION_FIELDS: CupomCanonicalColumn[] = [
  'storeCode',
  'categoryDescription',
  'cupomNumber',
  'saleValue',
]

/** Campos cujo valor deve ser "preenchido para baixo" quando a célula vem em branco (relatório com linhas agrupadas). */
export const CUPOM_FORWARD_FILL_FIELDS: CupomCanonicalColumn[] = ['storeCode', 'categoryDescription']
