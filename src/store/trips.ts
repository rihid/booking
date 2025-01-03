import { createStore } from 'zustand/vanilla'

export type TripState = {
  tripBook: any;
}

export type TripActions = {
  setTripBook: (val: any) => void
}

export type TripStore = TripState & TripActions

export const initTripStore = (): TripState => {
  return {
    tripBook: null
  }
}

export const defaultInitState: TripState = {
  tripBook: null,
}

export const createTripStore = (
  initState: TripState = defaultInitState,
) => {
  return createStore<TripStore>()((set) => ({
    ...initState,
    setTripBook: (value: any) => set((state) => ({ tripBook: value })),
  }))
}
