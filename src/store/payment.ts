import { createStore } from "zustand/vanilla";
import { persist, createJSONStorage } from 'zustand/middleware';

type PaymentLink = {
  order_id: string | null;
  payment_token: string | null;
}

export type PaymentState = {
  paymentLink: PaymentLink | null
}
export type PaymentActions = {

  setPaymentLink: (obj: PaymentLink) => void;
}
export type PaymentStore = PaymentState & PaymentActions

// export const initPaymentStore = (): PaymentState => {
//   return {
//     paymentLink: {
//       order_id: 'test',
//       payment_token: 'test'
//     }
//   }
// }

export const defaultInitState: PaymentState = {
  paymentLink: null
}
export const createPaymentStore = (
  initState: PaymentState = defaultInitState,
) => {
  return createStore<PaymentStore>()(
    persist(
      (set) => ({
        ...initState,
        setPaymentLink: (obj: PaymentLink) => {
          set((state) => ({
            paymentLink: obj,
          }))
        }
      }),
      {
        name: 'safari-payment',
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
} 