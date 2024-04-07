import { useStore } from "zustand";
import { useProjectStore } from "../stores/project-context";

const useSyncedState = () => {
  const store = useProjectStore();
  const syncedStore = useStore(store, (s) => s.syncedStore);
  return syncedStore.state;
};

export default useSyncedState;
