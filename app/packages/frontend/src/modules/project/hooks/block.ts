import { defaultResponseSchema } from "../constants";
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

  const changeResponseMode = (mode: string) => {
    if (!block) return;
    if (!block.settings) block.settings = {};
    block.settings.response_type = mode;
    if (mode === "json" && !block.settings.response_schema)
      block.settings.response_schema = defaultResponseSchema;
  };

  const changeResponseSchema = (schema: string) => {
    if (!block) return;
    if (!block.settings) block.settings = {};
    block.settings.response_schema = schema;
  };
  const changeResponseSample = (sample: string) => {
    if (!block) return;
    if (!block.settings) block.settings = {};
    block.settings.response_sample = sample;
  };
  return {
    selectedFlow,
    otherFlows,
    changeFlow,
    changeResponseMode,
    changeResponseSchema,
    changeResponseSample,
  };
};

export default useBlock;
