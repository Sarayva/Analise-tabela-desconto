import { create } from 'zustand'
import { loadDiscountFile, type FileLoadError } from '../data/loadDiscountFile'
import type { ParsedFile } from '../data/parseDiscountFile'
import type { SourceFile } from '../domain/types'

export type UploadSlotStatus = 'vazio' | 'lendo' | 'pronto' | 'erro'

export interface UploadSlot {
  status: UploadSlotStatus
  fileName: string | null
  result: ParsedFile | null
  error: FileLoadError | null
}

interface UploadStoreState {
  fidelidade: UploadSlot
  limite: UploadSlot
  loadFile: (source: SourceFile, file: File) => Promise<void>
}

const EMPTY_SLOT: UploadSlot = { status: 'vazio', fileName: null, result: null, error: null }

export const useUploadStore = create<UploadStoreState>((set) => {
  const setSlot = (source: SourceFile, slot: UploadSlot) =>
    set((state) => ({ ...state, [source]: slot }))

  return {
    fidelidade: EMPTY_SLOT,
    limite: EMPTY_SLOT,
    loadFile: async (source, file) => {
      setSlot(source, { status: 'lendo', fileName: file.name, result: null, error: null })

      const result = await loadDiscountFile(file, source)

      setSlot(
        source,
        result.ok
          ? { status: 'pronto', fileName: file.name, result: result.value, error: null }
          : { status: 'erro', fileName: file.name, result: null, error: result.error },
      )
    },
  }
})
