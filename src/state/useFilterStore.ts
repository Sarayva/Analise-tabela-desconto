import { create } from 'zustand'
import type { SituationFilterValue } from '../domain/filterRecords'

interface FilterStoreState {
  city: string | null
  categoryCode: number | null
  situation: SituationFilterValue | null
  setCity: (city: string | null) => void
  setCategoryCode: (categoryCode: number | null) => void
  setSituation: (situation: SituationFilterValue | null) => void
  reset: () => void
}

export const useFilterStore = create<FilterStoreState>((set) => ({
  city: null,
  categoryCode: null,
  situation: null,
  setCity: (city) => set({ city }),
  setCategoryCode: (categoryCode) => set({ categoryCode }),
  setSituation: (situation) => set({ situation }),
  reset: () => set({ city: null, categoryCode: null, situation: null }),
}))
