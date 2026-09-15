import { err, type Result } from '../domain/result'
import type { StoreDirectoryEntry } from '../domain/types'
import { parseStoreDirectory, type StoreDirectoryError } from './parseStoreDirectory'

export type StoreDirectoryLoadError = StoreDirectoryError | { code: 'extensao_invalida'; message: string }

export async function loadStoreDirectory(file: File): Promise<Result<StoreDirectoryEntry[], StoreDirectoryLoadError>> {
  if (!file.name.toLowerCase().endsWith('.txt')) {
    return err({
      code: 'extensao_invalida',
      message: `"${file.name}" não é um formato aceito para a lista de lojas. Formato aceito: .txt.`,
    })
  }

  const text = await file.text()
  return parseStoreDirectory(text)
}
