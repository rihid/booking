import { createStore } from "zustand/vanilla";

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
  location: LocationType | null
}
export type LocationActions = {

  setLocation: (obj: LocationType) => void;
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
    }
  }
}

export const defaultInitState: LocationState = {
  location: null
}
export const createLocationStore = (
  initState: LocationState = defaultInitState,
) => {
  return createStore<LocationStore>()(
    (set) => ({
      ...initState,
      setLocation: (obj: LocationType) => {
        set((state) => ({
          location: obj,
        }))
      }
    }),
  )
} 