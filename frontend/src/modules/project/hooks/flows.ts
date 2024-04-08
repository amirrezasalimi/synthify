import { DragEndEvent } from "@dnd-kit/core";
import { FlowNode } from "../types/flow-data";
import useSyncedState from "./synced-state";
import { NodeChange } from "reactflow";
import { SortableData } from "@dnd-kit/sortable";
import toast from "react-hot-toast";

const useFlows = () => {
  const state = useSyncedState();
  const nodes = [...Object.values(state.nodes)] as FlowNode[];

  const onNodesChange = (changedNodes: NodeChange[]) => {
    // apply if its node position change
    changedNodes.forEach((change) => {
      if (change.type === "position") {
        const id = change.id;
        if (state.nodes[id] && change.position) {
          // @ts-ignore
          state.nodes[id].position = change.position;
        }
      }
    });
  };
  const onSortEnd = (event: DragEndEvent) => {
    const containerId = (event.active.data.current as SortableData).sortable
      .containerId as string;
    const nodeId = containerId.split("-")[1];
    const sourceBlock = event.active.id;
    const destinationBlock = event.over?.id;

    if (sourceBlock == "prompt" || destinationBlock === "prompt") {
      toast("Cannot move prompt block");
      return;
    }
    const node = state.nodes[nodeId];

    if (!node) return;
    // swap
    if (destinationBlock) {
      const blocks = node.data.blocks;
      const sourceOrder = blocks.find(
        (block) => block.id === sourceBlock
      )?.order;
      const destinationOrder = blocks.find(
        (block) => block.id === destinationBlock
      )?.order;

      console.log(
        [...blocks.map((block) => [block.id, block.order])],
        sourceBlock,
        destinationBlock,
        sourceOrder,
        destinationOrder
      );

      const sourceIndex = blocks.findIndex((block) => block.id === sourceBlock);
      const destinationIndex = blocks.findIndex(
        (block) => block.id === destinationBlock
      );
      if (sourceOrder !== undefined && destinationOrder !== undefined) {
        blocks[sourceIndex].order = destinationOrder;
        blocks[destinationIndex].order = sourceOrder;
      }
    }
  };

  return {
    nodes,
    onNodesChange,
    onSortEnd,
  };
};

export default useFlows;
