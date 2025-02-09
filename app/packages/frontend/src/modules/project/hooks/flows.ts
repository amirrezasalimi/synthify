import { DragEndEvent } from "@dnd-kit/core";
import { FlowNode } from "../types/flow-data";
import useSyncedState from "./synced-state";
import { Edge, NodeChange } from "reactflow";
import { SortableData } from "@dnd-kit/sortable";
import toast from "react-hot-toast";
import { defaultMainFlow } from "../constants";
import { makeId } from "@/shared/utils/id";
import { useMemo } from "react";
import { flowColors } from "../data/colors";

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
      y = lastFlow?.position.y + 50 || 100;
    } else {
      x = 100;
      y = 100;
    }

    const id = makeId();

    state.nodes[id] = {
      id,
      type: "flow",
      data: {
        id,
        name: `flow${Object.keys(state.nodes).length + 1}`,
        color: flowColors[Math.floor(Math.random() * flowColors.length)],
        blocks: [],
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

  const edges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];
    for (const node of nodes) {
      if (node.type === "flow") {
        const blocks = node.data.blocks;
        for (const block of blocks) {
          if (block.type === "run-flow") {
            const targetFlow = block.settings.selected_flow;
            if (!targetFlow) continue;
            edges.push({
              id: `${node.id}-${block.id}/runflow-${targetFlow}`,
              type: 'bezier',
              source: node.id,
              sourceHandle: `runflow-${block.id}`,
              target: targetFlow,
              targetHandle: `flow-${targetFlow}`,
              animated: true,
              style: {
                strokeDashoffset: 25,
                strokeDasharray: 8,
              }
            });
          }
        }
      }
    }
    return edges;
  }, [
    state.nodes,
    state.config.isInitialized

  ])
  return {
    nodes,
    edges,
    onNodesChange,
    onSortEnd,
    addEmptyFlow,
    clearScene,
  };
};

export default useFlows;
