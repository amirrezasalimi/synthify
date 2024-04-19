import { makeId } from "@/shared/utils/id";
import { FlowNode } from "../types/flow-data";
import useSyncedState from "./synced-state";

const useFlow = (id: string) => {
  const { nodes } = useSyncedState();
  const state = nodes?.[id] as FlowNode;

  const name = state?.data?.name || "Untitled";
  const blocks = [...(state?.data?.blocks ?? [])]
    // from -infinity to +infinity
    .sort((a, b) => a.order - b.order);

  const addBlock = (type: any) => {
    // add to top
    const lowestOrder = state.data.blocks.reduce(
      (acc, block) => Math.min(acc, block.order),
      0
    );
    let prompt = "";
    if (type == "list") {
      prompt =
        "make a list of 20 different categories about shopping ,no extra talk ,sepereated by comma:";
    }

    state.data.blocks.push({
      id: makeId(),
      name: "Untitled",
      type,
      prompt,
      order: lowestOrder - 1,
      ai_config: {},
      settings: {
        cache: type == "list",
        item_seperator: ",",
      },
    });
  };
  const updateFlowName = (name: string) => {
    state.data.name = name;
  };
  const updateBlockName = (id: string, name: string) => {
    const block = state.data.blocks.find((block) => block.id === id);
    if (block) {
      block.name = name;
    }
  };

  const removeBlock = (id: string) => {
    const index = state.data.blocks.findIndex((block) => block.id === id);
    if (state.data.blocks[index].id == "prompt") {
      return;
    }
    if (index > -1) {
      state.data.blocks.splice(index, 1);
    }
  };

  const remove = () => {
    if (id === "main") {
      return;
    }
    delete nodes[id];
  };
  return {
    state,
    name,
    blocks,
    remove,
    addBlock,
    updateFlowName,
    updateBlockName,
    removeBlock,
  };
};

export default useFlow;
