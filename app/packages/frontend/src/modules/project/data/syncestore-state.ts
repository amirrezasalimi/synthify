import { FlowNode } from "../types/flow-data";

export const initialSyncedStoreTaskState = {
  config: {} as {
    isInitialized: boolean;
  },
  nodes: {} as Record<string, FlowNode>,
};
