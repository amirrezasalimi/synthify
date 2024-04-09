import { FlowNode } from "../types/flow-data";
import useSyncedState from "./synced-state";

const useBlock = (flowId: string, blockId: string) => {
  const state = useSyncedState();
  const block = state.nodes[flowId]?.data.blocks.find(
    (block) => block.id === blockId
  );
  const otherFlows = Object.values(state.nodes ?? []).filter(
    (flow) => flow?.id !== flowId
  ) as FlowNode[];

  const selectedFlow = block?.settings?.selected_flow
    ? (state.nodes[block?.settings.selected_flow] as FlowNode)
    : null;

  const changeFlow = (flowId: string) => {
    if (!block) return;
    block.settings.selected_flow = flowId;
  };
  return {
    selectedFlow,
    otherFlows,
    changeFlow
  };
};

export default useBlock;
