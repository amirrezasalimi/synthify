import { create } from "zustand";

type CommonStore = {
  isConfigModelOpen: boolean;
  toggleConfigModel: (isOpen: boolean) => void;
};

export const useCommonStore = create<CommonStore>((set) => ({
  isConfigModelOpen: false,
  toggleConfigModel: (isOpen) => set({ isConfigModelOpen: isOpen }),
}));
