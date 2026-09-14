/** Converte o valor bruto de uma célula em número, aceitando vírgula decimal. Retorna `null` se não for um número válido. */
export function parseNumericCell(value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value === 'string') {
    const normalized = value.trim().replace(',', '.')
    if (normalized === '') return null
    const parsed = Number(normalized)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

/** Converte o valor bruto de uma célula em texto não vazio. Retorna `null` se estiver vazio ou não for texto/número. */
export function parseTextCell(value: unknown): string | null {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : null
  }
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  return null
}
