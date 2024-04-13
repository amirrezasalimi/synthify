import { create } from "zustand";

type CommonStore = {
  isConfigModelOpen: boolean;
  toggleConfigModel: (isOpen: boolean) => void;
  isChooseModelModalOpen: boolean;
  toggleChooseModelModal: (
    isOpen: boolean,
    onChoose?: (service_id: string, model_id: string) => void
  ) => void;
  onChooseModel?: (service_id: string, model_id: string) => void;

  // dataset modal
  isDatasetModalOpen: boolean;
  toggleDatasetModal: (isOpen: boolean, taskId: string) => void;
  datasetModalTaskId?: string;
};

export const useCommonStore = create<CommonStore>((set) => ({
  isConfigModelOpen: false,
  toggleConfigModel: (isOpen) => set({ isConfigModelOpen: isOpen }),

  isChooseModelModalOpen: false,
  toggleChooseModelModal: (isOpen, onChoose) => {
    set({ isChooseModelModalOpen: isOpen, onChooseModel: onChoose });
  },

  isDatasetModalOpen: false,
  toggleDatasetModal: (isOpen, taskId) => {
    set({ isDatasetModalOpen: isOpen, datasetModalTaskId: taskId });
  },
}));
