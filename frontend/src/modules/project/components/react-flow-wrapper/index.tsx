import ReactFlow, { Background, NodeTypes } from "reactflow";
import "reactflow/dist/style.css";
import FlowNode from "../flow-node";
import useFlows from "../../hooks/flows";
import { DndContext } from "@dnd-kit/core";
const nodeTypes: NodeTypes = {
  flow: FlowNode,
};
const ReactFlowWrapper = ({ children }: { children?: React.ReactNode }) => {
  const { nodes, onNodesChange, onSortEnd } = useFlows();

  return (
    <div className="w-full h-full">
      <DndContext autoScroll onDragEnd={onSortEnd}>
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes}
          onNodesChange={onNodesChange}
        >
          {children}
          <Background />
        </ReactFlow>
      </DndContext>
    </div>
  );
};

export default ReactFlowWrapper;
