import ReactFlow, { Background } from "reactflow";
import "reactflow/dist/style.css";

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const Flows = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="w-full h-full">
      <ReactFlow nodes={initialNodes} edges={initialEdges}>
        {children}
        <Background />
      </ReactFlow>
    </div>
  );
};

export default Flows;
