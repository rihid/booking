'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'
import { type PaymentStore, createPaymentStore, defaultInitState } from '@/store/payment'

export type PaymentStoreApi = ReturnType<typeof createPaymentStore>
export const PaymentStoreContext = createContext<PaymentStoreApi | undefined>(
  undefined,
)
export interface PaymentStoreProviderProps {
  children: ReactNode
}

export const PaymentStoreProvider = ({
  children,
}: PaymentStoreProviderProps) => {
  const storeRef = useRef<PaymentStoreApi>()
  if (!storeRef.current) {
    storeRef.current = createPaymentStore(defaultInitState)
  }

  return (
    <PaymentStoreContext.Provider value={storeRef.current}>
      {children}
    </PaymentStoreContext.Provider>
  )
}

export const usePaymentStore = <T,>(
  selector: (store: PaymentStore) => T,
): T => {
  const paymentStoreContext = useContext(PaymentStoreContext)

  if (!paymentStoreContext) {
    throw new Error(`usePaymentStore must be used within CounterStoreProvider`)
  }

  return useStore(paymentStoreContext, selector)
}