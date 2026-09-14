import { normalizeHeader } from './normalizeHeader'

export type ColumnMatch =
  | { status: 'encontrada'; header: string }
  | { status: 'ausente' }
  | { status: 'ambigua'; headers: string[] }

/**
 * Procura, entre os cabeçalhos de uma planilha, qual coluna corresponde a um
 * campo canônico, usando a lista de nomes alternativos aceitos.
 *
 * Se mais de um cabeçalho distinto bater com os aliases do mesmo campo, o
 * resultado é "ambígua" — o chamador deve informar o usuário em vez de
 * escolher silenciosamente uma das opções.
 */
export function matchColumn(headers: string[], aliases: string[]): ColumnMatch {
  const normalizedAliases = new Set(aliases.map(normalizeHeader))
  const matches = headers.filter((header) => normalizedAliases.has(normalizeHeader(header)))
  const distinctMatches = Array.from(new Set(matches))

  if (distinctMatches.length === 0) return { status: 'ausente' }
  if (distinctMatches.length === 1) return { status: 'encontrada', header: distinctMatches[0] }
  return { status: 'ambigua', headers: distinctMatches }
}
