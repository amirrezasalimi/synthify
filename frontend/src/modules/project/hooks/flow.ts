import { FlowNode } from "../types/flow-data";
import useSyncedState from "./synced-state";

const useFlow = (id: string) => {
  const { nodes } = useSyncedState();
  const state = nodes[id] as FlowNode;

  const name = state.data.name || "Untitled";
  const blocks = [...state.data.blocks]
  // from -infinity to +infinity
  .sort((a, b) => a.order - b.order);

  const addEmptyBlock = () => {
    // add to top
    const lowestOrder = state.data.blocks.reduce(
      (acc, block) => Math.min(acc, block.order),
      0
    );

    state.data.blocks.push({
      id: Math.random().toString(36).substring(7),
      name: "Untitled",
      type: "text",
      prompt: "",
      order: lowestOrder - 1,
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

  return {
    state,
    name,
    blocks,
    addEmptyBlock,
    updateFlowName,
    updateBlockName,
    removeBlock,
  };
};

export default useFlow;
