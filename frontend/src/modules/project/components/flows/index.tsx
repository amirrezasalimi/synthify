import ReactFlow, { Background } from "reactflow";
import "reactflow/dist/style.css";

const Flows = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="w-full h-full">
      <ReactFlow>
        {children}
        <Background />
      </ReactFlow>
    </div>
  );
};

export default Flows;
