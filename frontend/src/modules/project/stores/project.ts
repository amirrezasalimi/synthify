import { createStore } from "zustand";
import * as Y from "yjs";
import { syncedStore } from "@syncedstore/core";
import { initialSyncedStoreTaskState } from "../data/syncestore-state";
type SyncedStoreType = ReturnType<
  typeof syncedStore<typeof initialSyncedStoreTaskState>
>;
class SyncedStoreHandler {
  state: SyncedStoreType;
  constructor(state: SyncedStoreType) {
    this.state = state;
  }
}

// types
export type ProjectStore = {
  ydoc: Y.Doc;
  syncedStore: SyncedStoreHandler;
};

const useCreateProjectStore = createStore<ProjectStore>()((set) => {
  const ydoc = new Y.Doc();
  const _syncedStore = new SyncedStoreHandler(
    syncedStore(initialSyncedStoreTaskState, ydoc)
  );
  return {
    ydoc,
    syncedStore: _syncedStore,
  };
});

export default useCreateProjectStore;
