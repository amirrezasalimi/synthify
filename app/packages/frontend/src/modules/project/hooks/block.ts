import { defaultResponseSchema } from "../constants";
import { useCommonStore } from "../stores/common";
import { FlowBlock, FlowNode } from "../types/flow-data";
import useSyncedState from "./synced-state";

const useBlock = (flowId: string, blockId: string) => {
  const state = useSyncedState();

  const block = state.nodes[flowId]?.data.blocks.find(
    (block) => block.id === blockId
  );

  const toggleChooseModelModal = useCommonStore(
    (state) => state.toggleChooseModelModal
  );
  const openAiModelChooser = () => {
    if (block) {
      toggleChooseModelModal(true, (service_id, model_id) => {
        if (!block.ai_config) {
          block.ai_config = {};
        }
        block.ai_config.service = service_id;
        block.ai_config.model = model_id;
      });
    }
  };


  const otherFlows = Object.values(state.nodes ?? []).filter(
    (flow) => flow?.id !== flowId && flow?.id != "main"
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
    data: block as FlowBlock,
    selectedFlow,
    otherFlows,
    changeFlow,
    changeResponseMode,
    changeResponseSchema,
    changeResponseSample,
    openAiModelChooser
  };
};

export default useBlock;
