import { create } from 'zustand'
import { loadStoreDirectory, type StoreDirectoryLoadError } from '../data/loadStoreDirectory'
import type { StoreDirectoryEntry } from '../domain/types'
import type { UploadSlotStatus } from './useUploadStore'

interface StoreDirectoryState {
  status: UploadSlotStatus
  fileName: string | null
  entries: StoreDirectoryEntry[]
  error: StoreDirectoryLoadError | null
  loadFile: (file: File) => Promise<void>
}

export const useStoreDirectoryStore = create<StoreDirectoryState>((set) => ({
  status: 'vazio',
  fileName: null,
  entries: [],
  error: null,
  loadFile: async (file) => {
    set({ status: 'lendo', fileName: file.name, entries: [], error: null })

    const result = await loadStoreDirectory(file)

    set(
      result.ok
        ? { status: 'pronto', fileName: file.name, entries: result.value, error: null }
        : { status: 'erro', fileName: file.name, entries: [], error: result.error },
    )
  },
}))
