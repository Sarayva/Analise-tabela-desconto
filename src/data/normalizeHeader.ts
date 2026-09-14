/**
 * Normaliza um cabeçalho de coluna para comparação: remove acentos, pontuação
 * e caixa, para que "% Desc. padrão" e "desconto padrao" sejam reconhecidos
 * como o mesmo campo.
 */
export function normalizeHeader(raw: string): string {
  return raw
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[.%]/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}
