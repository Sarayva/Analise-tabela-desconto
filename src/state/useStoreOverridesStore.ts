import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface StoreOverridesState {
  /** Código da loja -> tabela definida manualmente pelo usuário. */
  overrides: Record<number, string>
  setOverride: (storeCode: number, tabela: string) => void
  clearOverride: (storeCode: number) => void
}

/**
 * Correções manuais de "loja pertence à tabela X", guardadas no navegador
 * (não afeta os arquivos originais — é uma camada aplicada só na análise).
 * Persistida em localStorage para não se perder ao recarregar a página.
 */
export const useStoreOverridesStore = create<StoreOverridesState>()(
  persist(
    (set) => ({
      overrides: {},
      setOverride: (storeCode, tabela) =>
        set((state) => ({ overrides: { ...state.overrides, [storeCode]: tabela } })),
      clearOverride: (storeCode) =>
        set((state) => {
          const next = { ...state.overrides }
          delete next[storeCode]
          return { overrides: next }
        }),
    }),
    { name: 'discount-analyzer-store-overrides' },
  ),
)
