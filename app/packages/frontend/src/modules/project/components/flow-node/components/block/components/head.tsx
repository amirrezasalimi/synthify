import React from "react";
import {
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { blockNameMap } from "@/modules/project/constants";
import { TbArrowsMoveVertical, TbPlus } from "react-icons/tb";
import useBlock from "@/modules/project/hooks/block";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

interface BlockHeadProps {
  i: number;
  flowId: string;
  blockId: string;
  color: string;
  canMoveOrDelete: boolean;
  updateBlockName: (id: string, name: string) => void;
  removeBlock: (id: string) => void;
  sorterHandleListeners?:SyntheticListenerMap
}

const BlockHead: React.FC<BlockHeadProps> = ({
  i,
  flowId,
  blockId,
  color,
  canMoveOrDelete,
  updateBlockName,
  removeBlock,
  sorterHandleListeners
}) => {
  const { changeFlow, otherFlows, selectedFlow, data, openAiModelChooser } =
    useBlock(flowId, blockId);


  const { type, name, ai_config } = data ?? {};

  if (!type) {
    return <> unsupported block</>;
  }
  return (
<>
      <div className="move-block top-1.5 left-[-52px] absolute border border-background-600 rounded-lg w-10 h-10 overflow-hidden group">
        {/* order */}
        <div
          className={cn(
            "w-full h-full flex items-center justify-center ",
            canMoveOrDelete && "group-hover:hidden"
          )}
        >
          {i + 1}
        </div>
        {/* Move block */}

        {canMoveOrDelete && (
          <div
            {...sorterHandleListeners}
            className="group-hover:bg-background-600 flex justify-center items-center w-full h-full text-white cursor-move nodrag"
          >
            <TbArrowsMoveVertical size={20} />
          </div>
        )}
      </div>

      {/* remove | right */}
      {canMoveOrDelete && (
        <div
          className="group-hover:visible remove-block top-4 right-[-52px] absolute rounded-lg w-10 h-10 cursor-pointer invisible overflow-hidden"
          onClick={() => removeBlock(blockId)}
        >
          <TbPlus className="text-red-500 transform rotate-45" />
        </div>
      )}

      <div className="flex justify-between">
        <div className="flex gap-2">
          {/* Block type and name */}
          <div className="flex items-center gap-2">
            <span
              className="px-2 py-1 rounded-lg font-bold text-lg text-white capitalize"
              style={{ backgroundColor: color }}
            >
              {blockNameMap[type as keyof typeof blockNameMap]}
            </span>

            {type == "run-flow" ? (
              <Dropdown className="relative">
                <DropdownTrigger>
                  {selectedFlow?.data.name || "Select Flow"}
                </DropdownTrigger>
                <DropdownMenu
                  onAction={(selected) => changeFlow(String(selected))}
                  aria-label="flows"
                >
                  {otherFlows.map((flow) => (
                    <DropdownItem key={flow.id}>{flow.data.name}</DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            ) : (
              <input
                type="text"
                readOnly={!canMoveOrDelete}
                value={name}
                className={cn(
                  "w-1/2 bg-transparent outline-none",
                  !canMoveOrDelete ? "cursor-grab select-none" : "nodrag"
                )}
                onChange={(e) => updateBlockName(blockId, e.target.value)}
              />
            )}
          </div>
          {(type == "llm" || type == "list") && (
            <div>
              <button
                onClick={openAiModelChooser}
                className="px-2 py-1 border border-background-600 rounded-lg w-auto max-w-[150px] truncate"
              >
                {ai_config?.model ? ai_config.model : "Choose Model"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlockHead;
