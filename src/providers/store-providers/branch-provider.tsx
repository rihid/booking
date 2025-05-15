'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { useStore } from 'zustand';
import { type BranchtStore, createBranchStore, initBranchStore } from '@/store/branch';

export type BranchStoreApi = ReturnType<typeof createBranchStore>

export const BranchStoreContext = createContext<BranchStoreApi | undefined>(
  undefined,
)

export interface BranchStoreProviderProps {
  children: ReactNode
}

export const BranchStoreProvider = ({
  children,
}: BranchStoreProviderProps) => {
  const storeRef = useRef<BranchStoreApi>()
  if (!storeRef.current) {
    storeRef.current = createBranchStore(initBranchStore())
  }

  return (
    <BranchStoreContext.Provider value={storeRef.current}>
      {children}
    </BranchStoreContext.Provider>
  )
}

export const useBranchStore = <T,>(
  selector: (store: BranchtStore) => T,
): T => {
  const branchStoreContext = useContext(BranchStoreContext)

  if (!branchStoreContext) {
    throw new Error(`useBranchStore must be used within BranchStoreProvider`)
  }

  return useStore(branchStoreContext, selector)
}