import { createStore } from 'zustand/vanilla'


// "id": "83569da9f57d406bbcb25a97457c4b11",
// "org_no": "C0001",
// "alias": "AMC",
// "name": "PT Aspha Motora Colabor",
// "address": "Jl Puri Anjasmoro",
// "phone": "00",
// "email": "aspha@gmail.com",
// "vat": null,
// "created_at": "2023-03-15T01:24:54.000000Z",
// "updated_at": "2023-03-15T01:24:54.000000Z",
// "second_name": null,
// "bank_name": null,
// "bank_account_no": null,
// "storage": null

interface OrgType {
  id: string;
  org_no: string | null;
  alias: string | null;
  name: string | null;
  address: string | null;
  phone: string | null;
  email: string | null
  vat: string | null;
  created_at: string | null;
  updated_at: string | null;
  second_name: string | null;
  bank_name: string | null;
  bank_account_no: string | null;
  storage: string | null;
}
export type UserState = {
  organization: OrgType[] | null
}

export type UserActions = {
  setOrganization: (value: any) => void
}

export type UserStore = UserState & UserActions

export const initUserStore = (): UserState => {
  return { organization: null }
}

export const defaultInitState: UserState = {
  organization: null,
}

export const createUserStore = (
  initState: UserState = defaultInitState,
) => {
  return createStore<UserStore>()((set) => ({
    ...initState,
    setOrganization: (value: any) => set((state) => ({ organization: value })),
  }))
}
