import { authUrl, masterUrl } from '@/lib/data/endpoints'
import axios from 'axios'
import { createStore } from 'zustand/vanilla'

interface BranchType {
  id: string
  branch_no: string | null
  branch_no_short: string | null
  org_no: string | null
  org: string | null
  alias: string | null
  name: string | null
  second_name: string | null
  address: string | null
  phone: string | null
  email: string | null
  api_id: string | null
  ref_no: string | null
  note: string | null
  pic: string | null
  pic_name: string | null
}

export type BranchState = {
  branchList: BranchType[]
}

export type BranchActions = {
  getBranchList: (token: string) => Promise<void>;
}

export type BranchtStore = BranchState & BranchActions

export const initBranchStore = (): BranchState => {
  return {
    branchList: []
  }
}

export const defaultInitState: BranchState = {
  branchList: []
}

export const createBranchStore = (
  initState: BranchState = defaultInitState,
) => {
  return createStore<BranchtStore>()((set) => ({
    ...initState,
    getBranchList: async (token) => {
      try {
        const response = await axios.get(authUrl + '/branch', {
          headers: { Accept: 'application/json', Authorization: 'Bearer ' + token },
          timeout: 50000
        });
        set({ branchList: response.data.data });
      } catch (error: any) {
        console.log(error);
      }
    }
  }))
}