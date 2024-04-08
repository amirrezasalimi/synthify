import { useStore } from "zustand";
import { useProjectStore } from "../stores/project-context";
import { useSyncedStore } from "@syncedstore/react";
const useSyncedState = () => {
  const store = useProjectStore();
  const syncedStore = useStore(store, (s) => s.syncedStore);
  const state = syncedStore.state;
  return useSyncedStore(state);
};

export default useSyncedState;
