import { create } from 'zustand'
import { loadDiscountFile, type FileLoadError } from '../data/loadDiscountFile'
import type { ParsedFile } from '../data/parseDiscountFile'
import type { SourceFile } from '../domain/types'

export type UploadSlotStatus = 'vazio' | 'lendo' | 'pronto' | 'erro'

export interface UploadSlot {
  status: UploadSlotStatus
  /** Nomes de todos os arquivos carregados nesse campo (pode ser mais de um, ex.: lojas de fora + Maringá). */
  fileNames: string[]
  result: ParsedFile | null
  error: FileLoadError | null
}

interface UploadStoreState {
  fidelidade: UploadSlot
  limite: UploadSlot
  loadFile: (source: SourceFile, files: File[]) => Promise<void>
}

const EMPTY_SLOT: UploadSlot = { status: 'vazio', fileNames: [], result: null, error: null }

export const useUploadStore = create<UploadStoreState>((set) => {
  const setSlot = (source: SourceFile, slot: UploadSlot) =>
    set((state) => ({ ...state, [source]: slot }))

  return {
    fidelidade: EMPTY_SLOT,
    limite: EMPTY_SLOT,
    loadFile: async (source, files) => {
      const fileNames = files.map((file) => file.name)
      setSlot(source, { status: 'lendo', fileNames, result: null, error: null })

      const result = await loadDiscountFile(files, source)

      setSlot(
        source,
        result.ok
          ? { status: 'pronto', fileNames, result: result.value, error: null }
          : { status: 'erro', fileNames, result: null, error: result.error },
      )
    },
  }
})
