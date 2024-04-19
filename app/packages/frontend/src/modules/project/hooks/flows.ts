import { DragEndEvent } from "@dnd-kit/core";
import { FlowNode } from "../types/flow-data";
import useSyncedState from "./synced-state";
import { NodeChange } from "reactflow";
import { SortableData } from "@dnd-kit/sortable";
import toast from "react-hot-toast";
import { defaultMainFlow } from "../constants";
import { promptBlock } from "../constants";
import { makeId } from "@/shared/utils/id";

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
    const flowId = containerId.split("-")[0];
    const nodeId = containerId.split("-")[1];
    const sourceBlock = event.active.id;
    const destinationBlock = event.over?.id;

    if (
      (flowId == "main" && sourceBlock == "output") ||
      destinationBlock === "output"
    ) {
      toast("Cannot move output block");
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
  const addEmptyFlow = () => {
    const lastFlow = Object.values(state.nodes)
      .filter((node) => node?.type === "flow")
      .pop();
    let x, y;
    if (lastFlow) {
      x = lastFlow?.position.x + 200 || 100;
      y = lastFlow?.position.y + 200 || 100;
    } else {
      x = 100;
      y = 100;
    }
    const colors = ["#FF3897", "#1FE9AC", "#E91F1F", "#531FE9"];
    const id = makeId();

    state.nodes[id] = {
      id,
      type: "flow",
      data: {
        id,
        name: `flow${Object.keys(state.nodes).length + 1}`,
        color: colors[Math.floor(Math.random() * colors.length)],
        blocks: [{ ...promptBlock }],
      },
      position: { x, y },
    };
  };
  const clearScene = () => {
    for (const key of Object.keys(state.nodes)) {
      delete state.nodes[key];
    }
    state.nodes["main"] = defaultMainFlow;
  };
  return {
    nodes,
    onNodesChange,
    onSortEnd,
    addEmptyFlow,
    clearScene,
  };
};

export default useFlows;
