/**
 * Extrai o nome da cidade a partir do nome de uma aba, removendo o sufixo
 * de código de loja (ex.: "Loanda - 2225" -> "Loanda").
 */
export function deriveCityFromSheetName(sheetName: string): string {
  return sheetName.replace(/\s*-\s*\d+\s*$/, '').trim()
}
