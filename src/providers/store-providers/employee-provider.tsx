'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { useStore } from 'zustand';
import { type EmployeeStore, createEmployeeStore, initEmployeeStore } from '@/store/employee';

export type EmployeeStoreApi = ReturnType<typeof createEmployeeStore>

export const EmployeeStoreContext = createContext<EmployeeStoreApi | undefined>(
  undefined,
)

export interface EmployeeStoreProviderProps {
  children: ReactNode
}

export const EmployeeStoreProvider = ({
  children,
}: EmployeeStoreProviderProps) => {
  const storeRef = useRef<EmployeeStoreApi>()
  if (!storeRef.current) {
    storeRef.current = createEmployeeStore(initEmployeeStore())
  }

  return (
    <EmployeeStoreContext.Provider value={storeRef.current}>
      {children}
    </EmployeeStoreContext.Provider>
  )
}

export const useEmployeeStore = <T,>(
  selector: (store: EmployeeStore) => T,
): T => {
  const employeeStoreContext = useContext(EmployeeStoreContext)

  if (!employeeStoreContext) {
    throw new Error(`useEmployeeStore must be used within EmployeeStoreProvider`)
  }

  return useStore(employeeStoreContext, selector)
}