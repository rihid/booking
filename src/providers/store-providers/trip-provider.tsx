'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import { type TripStore, createTripStore, initTripStore } from '@/store/trips'

export type TripStoreApi = ReturnType<typeof createTripStore>

export const TripStoreContext = createContext<TripStoreApi | undefined>(
  undefined,
)

export interface TripStoreProviderProps {
  children: ReactNode
}

export const TripStoreProvider = ({
  children,
}: TripStoreProviderProps) => {
  const storeRef = useRef<TripStoreApi>()
  if (!storeRef.current) {
    storeRef.current = createTripStore(initTripStore())
  }

  return (
    <TripStoreContext.Provider value={storeRef.current}>
      {children}
    </TripStoreContext.Provider>
  )
}

export const useTripStore = <T,>(
  selector: (store: TripStore) => T,
): T => {
  const tripStoreContext = useContext(TripStoreContext)

  if (!tripStoreContext) {
    throw new Error(`useTripStore must be used within TripStoreProvider`)
  }

  return useStore(tripStoreContext, selector)
}
