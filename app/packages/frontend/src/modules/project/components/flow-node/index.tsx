import { Handle, NodeProps, Position } from "reactflow";
import { FlowData } from "../../types/flow-data";
import useFlow from "../../hooks/flow";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  cn,
} from "@nextui-org/react";
import { TbPlus, TbTrash } from "react-icons/tb";
import chroma from "chroma-js";
import { SortableContext } from "@dnd-kit/sortable";
import Block from "./components/block";
import { blockNameMap, blockTypes } from "../../constants";
import "./styles.css";
const FlowNode = ({ data, id }: NodeProps<FlowData>) => {
  const {
    name,
    state,
    blocks,
    addBlock,
    updateBlockName,
    updateFlowName,
    removeBlock,
    remove,
  } = useFlow(id);

  return (
    <div className="relative w-[400px] group/flow">
      {/* head */}
      {id != "main" && (
        <Handle
          id={`flow-${id}`}
          type="target"
          position={Position.Left}
          className="!top-6 !left-[-36px] absolute !border-none !w-3 !h-3"
          style={{
            background: data.color,
          }}
        />
      )}
      <div
        className="flex justify-center items-center rounded-xl w-full group"
        style={{
          backgroundColor: data.color,
        }}
      >
        {/* remove */}
        {id !== "main" && (
          <div className="group-hover:visible top-1 left-[-40px] z-10 absolute flex items-center bg-background w-6 h-10 invisible remove-flow">
            <TbTrash
              size={24}
              className="hover:text-red-500 cursor-pointer"
              onClick={remove}
            >
              X
            </TbTrash>
          </div>
        )}

        <div
          className="m-1.5 px-2 py-1 w-full text-lg text-white"
          style={{
            backgroundColor: data.color,
          }}
        >
          <input
            type="text"
            value={name}
            readOnly={id === "main"}
            onChange={(e) => updateFlowName(e.target.value)}
            className={cn(
              "w-2/3 bg-transparent text-white outline-none",
              id === "main" ? "cursor-grab select-none" : "nodrag nospan"
            )}
          />
        </div>
      </div>

      {/* add to top */}

      <div className="flex justify-center py-2">
        <Dropdown>
          <DropdownTrigger>
            <Button className="px-8" variant="flat" size="sm">
              <TbPlus />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            onAction={(selected) => {
              console.log("selected", selected);
              addBlock(String(selected));
            }}
            title="Blocks"
            aria-label="Blocks"
          >
            {blockTypes.map((type) => (
              <DropdownItem key={type}>
                {blockNameMap[type as keyof typeof blockNameMap]}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>

      <SortableContext
        items={
          blocks.map((block) => block.id) // block.id
        }
        id={`flow-${id}`}
      >
        {/* render blocks */}

        <div className="flex flex-col gap-2 w-full h-auto">
          {blocks.map((block, i) => {
            const color = chroma(state.data.color).brighten(0.5).hex();
            return (
              <Block
                key={block.id}
                i={i}
                flowId={id}
                block={block}
                color={color}
                updateBlockName={updateBlockName}
                removeBlock={removeBlock}
              />
            );
          })}
        </div>
      </SortableContext>
    </div>
  );
};

export default FlowNode;
