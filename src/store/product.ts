import { masterUrl } from '@/lib/data/endpoints'
import axios from 'axios'
import { createStore } from 'zustand/vanilla'

export type ProductState = {
  count: number,
  productVariantList: any[]
}

export type ProductActions = {
  decrementCount: () => void
  incrementCount: () => void
  getProductVariantList: (token: string) => Promise<void>;
}

export type ProductStore = ProductState & ProductActions

export const initProductStore = (): ProductState => {
  return {
    count: new Date().getFullYear(),
    productVariantList: []
  }
}

export const defaultInitState: ProductState = {
  count: 0,
  productVariantList: []
}

export const createProductStore = (
  initState: ProductState = defaultInitState,
) => {
  return createStore<ProductStore>()((set) => ({
    ...initState,
    decrementCount: () => set((state) => ({ count: state.count - 1 })),
    incrementCount: () => set((state) => ({ count: state.count + 1 })),
    getProductVariantList: async (token) => {
      try {
        console.log('token', token)
        const response = await axios.post(masterUrl + '/product/variant/list', {}, {
          headers: { Accept: 'application/json', Authorization: 'Bearer ' + token },
          timeout: 50000
        });
        set((state) => ({ productVariantList: response.data.data }));
      } catch (error: any) {
        console.log(error);
      }
    }
  }))
}