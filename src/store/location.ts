import { createStore } from "zustand/vanilla";
import { persist, createJSONStorage } from 'zustand/middleware';

export type LocationType = {
  id: string | null;
  name: string | null;
  longitude: string | null;
  latitude: string | null;
  org_no: string | null;
  branch_no: string | null;
  address: string | null;
  is_route: boolean;
}

export type LocationState = {
  location: LocationType | null;
  search: string
}
export type LocationActions = {
  setLocation: (obj: LocationType | null) => void;
  setSearch: (term: string) => void;
}
export type LocationStore = LocationState & LocationActions

export const initPaymentStore = (): LocationState => {
  return {
    location: {
      id: '',
      name: '',
      longitude: '',
      latitude: '',
      org_no: '',
      branch_no: '',
      address: '',
      is_route: false
    },
    search: ''
  }
}

export const defaultInitState: LocationState = {
  location: null,
  search: ''
}
export const createLocationStore = (
  initState: LocationState = defaultInitState,
) => {
  return createStore<LocationStore>()(
    (set) => ({
      ...initState,
      setLocation: (obj: LocationType | null) => {
        set((state) => ({
          location: obj,
        }))
      },
      setSearch: (term: string) => {
        set({ search: term })
      }
    })
  )
} 