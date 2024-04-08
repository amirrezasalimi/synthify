import { FlowBlock } from "@/modules/project/types/flow-data";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TbArrowsMoveVertical, TbPlus } from "react-icons/tb";


const Block = ({
    i,
    block,
    color,
    updateBlockName,
    removeBlock,
  }: {
    i: number;
    block: FlowBlock;
    color: string;
    updateBlockName: (id: string, name: string) => void;
    removeBlock: (id: string) => void;
  }) => {
    const { id } = block;
  
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({
        id,
      });
    return (
      <div
        {...attributes}
        ref={setNodeRef}
        className="w-full h-auto border-3 rounded-2xl p-2 bg-white relative group"
        style={{
          borderColor: color,
          transform: CSS.Transform.toString(transform),
          transition,
        }}
      >
        {/* move */}
        <div
          className="w-10 h-10 rounded-lg absolute left-[-52px] top-1.5 group overflow-hidden"
          {...listeners}
        >
          <div className="w-full h-full flex items-center justify-center bg-gray-200 group-hover:hidden">
            {i + 1}
          </div>
          <div className="flex justify-center items-center w-full h-full nodrag group-hover:bg-gray-600 text-white">
            <TbArrowsMoveVertical />
          </div>
        </div>
        {/* remove | right */}
        <div
          className="w-10 h-10 rounded-lg absolute right-[-52px] top-4 invisible group-hover:visible overflow-hidden"
          onClick={() => removeBlock(id)}
        >
          <TbPlus className="rotate-45 transform text-red-500" />
        </div>
  
        {/* head */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <span
              className="text-lg font-bold capitalize text-white px-2 py-1 rounded-lg"
              style={{
                backgroundColor: color,
              }}
            >
              {block.type}
            </span>
            <input
              type="text"
              value={block.name}
              className="w-1/2 bg-transparent outline-none nodrag"
              onChange={(e) => updateBlockName(id, e.target.value)}
            />
          </div>
          <div>{block.id}</div>
        </div>
      </div>
    );
  };

export default Block;