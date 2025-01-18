import { createStore } from "zustand/vanilla";
import { persist, createJSONStorage } from 'zustand/middleware';

type PaymentLink = {
  date: any;
  order_id: string | null;
  payment_token: string | null;
}

export type PaymentState = {
  paymentLinks: PaymentLink[]
}
export type PaymentActions = {
  setPaymentLink: (obj: PaymentLink) => void;
  refreshPaymentLink: () => void;
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
  paymentLinks: []
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
            paymentLinks: [...state.paymentLinks, obj],
          }))
        },
        refreshPaymentLink: () => {
          const currentTime = Date.now();
          set((state) => ({
            paymentLinks: state.paymentLinks.filter((link) => {
              const linkTime = new Date(link.date).getTime();
              return currentTime - linkTime < 48 * 60 * 60 * 1000;
            }),
          }));
        },
      }),
      {
        name: 'safari-payment',
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
} 