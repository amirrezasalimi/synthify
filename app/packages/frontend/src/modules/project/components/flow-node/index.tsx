import { NodeProps } from "reactflow";
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
    <div className="w-[400px] ">
      {/* head */}
      <div
        className="w-full flex items-center justify-center rounded-3xl group"
        style={{
          backgroundColor: data.color,
        }}
      >
        {/* remove */}
        {id !== "main" && (
          <div className="absolute w-[100px] h-10 left-[-36px] top-2 z-10  flex items-center">
            <TbTrash
              size={24}
              className="hover:text-red-500 cursor-pointer group-hover:visible invisible"
              onClick={remove}
            >
              X
            </TbTrash>
          </div>
        )}

        <div
          className="w-full text-white text-lg rounded-2xl border-4 border-white m-1.5 px-2 py-1"
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
