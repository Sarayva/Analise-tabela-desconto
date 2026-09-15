/** Normaliza um nome de cidade para comparação: sem acento, minúsculo, espaços colapsados. */
export function normalizeCityName(city: string): string {
  return city
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}
