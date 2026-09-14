import type { SourceFile } from '../domain/types'

export type CanonicalColumn =
  | 'categoryCode'
  | 'categoryDescription'
  | 'city'
  | 'fidelityPercentage'
  | 'fidelityMaxPercentage'
  | 'limitPercentage'

/**
 * Nomes alternativos aceitos para cada coluna canônica, usados para mapear
 * automaticamente cabeçalhos que não batem exatamente com o esperado.
 * Comparação é feita após normalização (sem acento, minúsculo, sem pontuação).
 */
export const COLUMN_ALIASES: Record<CanonicalColumn, string[]> = {
  categoryCode: ['codigo', 'cod', 'cod categoria', 'codigo categoria', 'codigo da categoria'],
  categoryDescription: [
    'descricao da categoria',
    'descricao categoria',
    'descricao',
    'categoria',
  ],
  city: ['cidade', 'municipio'],
  fidelityPercentage: [
    'desc padrao',
    'percentual desc padrao',
    'desconto fidelidade',
    'desconto padrao',
    'fidelidade',
    'percentual fidelidade',
  ],
  fidelityMaxPercentage: ['desc max', 'percentual desc max', 'desconto maximo'],
  limitPercentage: [
    'desc limite',
    'percentual desc limite',
    'desconto limite',
    'limite',
    'percentual limite',
  ],
}

/** Colunas obrigatórias para cada tipo de arquivo (além de `categoryCode`/`categoryDescription`, sempre obrigatórias). */
export const REQUIRED_PERCENTAGE_COLUMN: Record<SourceFile, CanonicalColumn> = {
  fidelidade: 'fidelityPercentage',
  limite: 'limitPercentage',
}

/** Nome de negócio de cada coluna canônica, usado nas mensagens de erro exibidas ao usuário. */
export const COLUMN_LABEL: Record<CanonicalColumn, string> = {
  categoryCode: 'Código da categoria',
  categoryDescription: 'Descrição da categoria',
  city: 'Cidade',
  fidelityPercentage: 'percentual de Desconto Fidelidade',
  fidelityMaxPercentage: 'percentual máximo de referência',
  limitPercentage: 'percentual de Desconto Limite',
}
