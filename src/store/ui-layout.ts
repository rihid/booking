import { create } from "zustand";

export type UiLayoutState = {
  showModal: boolean;
  modalView: string | null;
  openModal: (view: string | null) => void;
  closeModal: Function;
  setModalView: (view: string | null) => void;
}

export const useUiLayoutStore = create<UiLayoutState>()((set) => ({
  showModal: false,
  modalView: null,
  
  openModal: (view) => set({ showModal: true, modalView: view }),
  closeModal: () => set({ showModal: false, modalView: null }),
  setModalView: (view) => set({ modalView: view }),
}))