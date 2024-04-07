import { createStore } from "zustand";
import Y from "yjs";
import { syncedStore } from "@syncedstore/core";
import { initialSyncedStoreTaskState } from "../data/syncestore-state";
type SyncedStoreType = ReturnType<
  typeof syncedStore<typeof initialSyncedStoreTaskState>
>;

// types
export type ProjectStore = {
  ydoc: Y.Doc;
  syncedStore: SyncedStoreType;
};

const useCreateProjectStore = createStore<ProjectStore>()((set) => {
  const ydoc = new Y.Doc();
  const _syncedStore = syncedStore(initialSyncedStoreTaskState, ydoc);
  return {
    ydoc,
    syncedStore: _syncedStore,
  };
});

export default useCreateProjectStore;
