import { masterUrl } from '@/lib/data/endpoints'
import axios from 'axios'
import { createStore } from 'zustand/vanilla'

export type ProductState = {
  productVariantList: any[]
}

export type ProductActions = {
  getProductVariantList: (token: string) => Promise<void>;
}

export type ProductStore = ProductState & ProductActions

export const initProductStore = (): ProductState => {
  return {
    productVariantList: []
  }
}

export const defaultInitState: ProductState = {
  productVariantList: []
}

export const createProductStore = (
  initState: ProductState = defaultInitState,
) => {
  return createStore<ProductStore>()((set) => ({
    ...initState,
    getProductVariantList: async (token) => {
      try {
        const response = await axios.post(masterUrl + '/product/variant/list', {}, {
          headers: { Accept: 'application/json', Authorization: 'Bearer ' + token },
          timeout: 50000
        });
        set({ productVariantList: response.data.data });
      } catch (error: any) {
        console.log(error);
      }
    }
  }))
}