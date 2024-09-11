import { create } from 'zustand';

// State types
interface States {
  count: number;
}

// useCounterStore
export const useCountStore = create<States>(() => ({
  count: 0,
}));