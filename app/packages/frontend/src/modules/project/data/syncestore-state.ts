import { FlowNode } from "../types/flow-data";

export const initialSyncedStoreTaskState = {
  config: {} as {
    isInitialized: boolean;
  },
  chat: {} as {
    selectedServiceId: string;
    selectedModelId: string;
  },
  nodes: {} as Record<string, FlowNode>,
};
