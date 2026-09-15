import { err, ok, type Result } from '../domain/result'
import type { StoreDirectoryEntry } from '../domain/types'

export interface StoreDirectoryError {
  code: 'arquivo_vazio' | 'linha_invalida'
  message: string
}

/**
 * Lê a lista oficial de lojas, uma por linha, no formato
 * "código - nome da loja - cidade" (ex.: "055 - LOANDA - Loanda"). É a fonte
 * de verdade para a cidade real de cada loja, independente do que estiver
 * atribuído dentro dos arquivos de desconto.
 */
export function parseStoreDirectory(text: string): Result<StoreDirectoryEntry[], StoreDirectoryError> {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  if (lines.length === 0) {
    return err({ code: 'arquivo_vazio', message: 'O arquivo de lojas não contém nenhuma linha.' })
  }

  const entries: StoreDirectoryEntry[] = []
  const invalidLines: string[] = []

  for (const line of lines) {
    const parts = line.split(' - ')
    const code = Number(parts[0]?.trim())
    const city = parts[parts.length - 1]?.trim()
    const label = parts.slice(1, -1).join(' - ').trim()

    if (parts.length < 3 || !Number.isFinite(code) || !label || !city) {
      invalidLines.push(line)
      continue
    }

    entries.push({ code, label, city })
  }

  if (invalidLines.length > 0) {
    return err({
      code: 'linha_invalida',
      message: `${invalidLines.length} linha(s) não seguem o formato "código - nome - cidade": ${invalidLines.slice(0, 3).join(' | ')}${invalidLines.length > 3 ? ' ...' : ''}`,
    })
  }

  return ok(entries)
}
