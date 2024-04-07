import { NodeProps } from "reactflow";
import { FlowData } from "../../types/flow-data";

const ReactFlowNode = ({ data, id }: NodeProps<FlowData>) => {
  return (
    <div className="w-[400px] h-auto">
      {/* head */}
      <div
        className="w-full flex items-center justify-center rounded-3xl"
        style={{
          backgroundColor: data.color,
        }}
      >
        <div
          className="w-full text-white text-lg rounded-2xl border-4 border-white m-1.5 px-2 py-1"
          style={{
            backgroundColor: data.color,
          }}
        >
          {data.name}
        </div>
      </div>
    </div>
  );
};

export default ReactFlowNode;
