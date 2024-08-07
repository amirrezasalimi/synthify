import ReactFlow, { Background, NodeTypes } from "reactflow";
import "reactflow/dist/style.css";
import FlowNode from "../flow-node";
import useFlows from "../../hooks/flows";
import { DndContext } from "@dnd-kit/core";
import ViewportSaver from "./components/viewport-saver";
import AiAssistant from "../ai-assistant";
const nodeTypes: NodeTypes = {
  flow: FlowNode,
};
const ReactFlowWrapper = ({ children }: { children?: React.ReactNode }) => {
  const { nodes, edges, onNodesChange, onSortEnd } = useFlows();
  console.log("edges", edges);
  
  return (
    <div className="w-full h-full">
      <DndContext autoScroll onDragEnd={onSortEnd}>
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
        >
          <AiAssistant />
          <ViewportSaver />
          {/* <Background /> */}
          {children}
        </ReactFlow>
      </DndContext>
    </div>
  );
};

export default ReactFlowWrapper;
