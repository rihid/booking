'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'
import { type LocationStore, createLocationStore, defaultInitState } from '@/store/location'

export type LocationStoreApi = ReturnType<typeof createLocationStore>
export const LocationStoreContext = createContext<LocationStoreApi | undefined>(
  undefined,
)
export interface LocationStoreProviderProps {
  children: ReactNode
}

export const LocationStoreProvider = ({
  children,
}: LocationStoreProviderProps) => {
  const storeRef = useRef<LocationStoreApi>()
  if (!storeRef.current) {
    storeRef.current = createLocationStore(defaultInitState)
  }

  return (
    <LocationStoreContext.Provider value={storeRef.current}>
      {children}
    </LocationStoreContext.Provider>
  )
}

export const useLocationStore = <T,>(
  selector: (store: LocationStore) => T,
): T => {
  const locationStoreContext = useContext(LocationStoreContext)

  if (!locationStoreContext) {
    throw new Error(`useLocationStore must be used within CounterStoreProvider`)
  }

  return useStore(locationStoreContext, selector)
}