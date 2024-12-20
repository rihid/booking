'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'
import { type FilterStore, createFilterStore, defaultInitState } from '@/store/filter'

export type FilterStoreApi = ReturnType<typeof createFilterStore>
export const FilterStoreContext = createContext<FilterStoreApi | undefined>(
  undefined,
)
export interface FilterStoreProviderProps {
  children: ReactNode
}

export const FilterStoreProvider = ({
  children,
}: FilterStoreProviderProps) => {
  const storeRef = useRef<FilterStoreApi>()
  if (!storeRef.current) {
    storeRef.current = createFilterStore(defaultInitState)
  }

  return (
    <FilterStoreContext.Provider value={storeRef.current}>
      {children}
    </FilterStoreContext.Provider>
  )
}

export const useFilterStore = <T,>(
  selector: (store: FilterStore) => T,
): T => {
  const filterStoreContext = useContext(FilterStoreContext)

  if (!filterStoreContext) {
    throw new Error(`useLocationStore must be used within CounterStoreProvider`)
  }

  return useStore(filterStoreContext, selector)
}