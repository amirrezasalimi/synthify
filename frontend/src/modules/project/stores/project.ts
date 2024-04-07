import { createStore } from "zustand";

// types
export type ProjectStore = {
  count: number;
  inc: () => void;
};

const useCreateProjectStore = createStore<ProjectStore>()((set) => ({
  count: 1,
  inc: () => set((state) => ({ count: state.count + 1 })),
}));

export default useCreateProjectStore;
