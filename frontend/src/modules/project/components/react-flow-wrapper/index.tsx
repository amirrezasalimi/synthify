import ReactFlow, { Background, NodeTypes } from "reactflow";
import "reactflow/dist/style.css";
import useSyncedState from "../../hooks/synced-state";
import { FlowNode } from "../../types/flow-data";
import ReactFlowNode from "../react-flow-node";
import { useMemo } from "react";

const nodeTypes: NodeTypes = {
  flow: ReactFlowNode,
};
const ReactFlowWrapper = ({ children }: { children?: React.ReactNode }) => {
  const state = useSyncedState();
  const nodes = useMemo(() => {
    return [...Object.values(state.nodes)] as FlowNode[];
  }, [state.nodes]);

  return (
    <div className="w-full h-full">
      <ReactFlow nodeTypes={nodeTypes} nodes={nodes}>
        {children}
        <Background />
      </ReactFlow>
    </div>
  );
};

export default ReactFlowWrapper;
