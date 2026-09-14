/** Normaliza texto para busca livre: sem acento, minúsculo — "Paicandu" encontra "Paiçandu". */
export function normalizeSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}
