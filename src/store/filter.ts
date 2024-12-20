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
export type FilterParamType = {
  query: string;
  location: string;
}

export type FilterState = {
  location: LocationType | null;
  search: string;
  filterParams: FilterParamType | null;
}
export type FilterActions = {
  setLocation: (obj: LocationType | null) => void;
  setSearch: (term: string) => void;
  setFilterParams: (val: FilterParamType | null) => void;
}
export type FilterStore = FilterState & FilterActions

export const initFilterStore = (): FilterState => {
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
    search: '',
    filterParams: {
      query: '',
      location: '',
    }
  }
}

export const defaultInitState: FilterState = {
  location: null,
  search: '',
  filterParams: null
}
export const createFilterStore = (
  initState: FilterState = defaultInitState,
) => {
  return createStore<FilterStore>()(
    persist(
      (set) => ({
        ...initState,
        setLocation: (obj: LocationType | null) => {
          set((state) => ({
            location: obj,
          }))
        },
        setSearch: (term: string) => {
          set({ search: term })
        },
        setFilterParams: (obj: FilterParamType | null) => {
          set((state) => ({
            filterParams: obj,
          }))
        },
      }),
      {
        name: 'safari-filter',
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
} 