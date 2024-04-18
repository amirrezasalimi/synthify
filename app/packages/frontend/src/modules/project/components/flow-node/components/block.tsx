import {
  blockNameMap,
  defaultResponseSchema,
} from "@/modules/project/constants";
import useBlock from "@/modules/project/hooks/block";
import { useCommonStore } from "@/modules/project/stores/common";
import { FlowBlock } from "@/modules/project/types/flow-data";
import { useSortable } from "@dnd-kit/sortable";
import {
  Button,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  cn,
} from "@nextui-org/react";
import { useState } from "react";
import { TbArrowsMoveVertical, TbPlus } from "react-icons/tb";
import { RichTextarea, createRegexRenderer } from "rich-textarea";
import JsonResponseSchemaModal from "./json-response-schema-modal";

const Block = ({
  i,
  flowId,
  block,
  color,
  updateBlockName,
  removeBlock,
}: {
  i: number;
  flowId: string;
  block: FlowBlock;
  color: string;
  updateBlockName: (id: string, name: string) => void;
  removeBlock: (id: string) => void;
}) => {
  const helper = useBlock(flowId, block.id);
  const toggleChooseModelModal = useCommonStore(
    (state) => state.toggleChooseModelModal
  );
  const { id, type } = block;

  const canMove = id !== "prompt";
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id,
  });

  const isOutputBlock = block.id == "prompt";

  const chooseModel = () => {
    toggleChooseModelModal(true, (service_id, model_id) => {
      if (!block.ai_config) {
        block.ai_config = {};
      }
      block.ai_config.service = service_id;
      block.ai_config.model = model_id;
    });
  };

  const promptRender = createRegexRenderer([
    // anything between {} highlight
    [/{((?:[^{}]|{[^{}]*})*?)}/g, { color: "#0EC2FB" }],
  ]);

  const [jsonResponseSchemaModal, toggleJsonResponseSchemaModal] =
    useState(false);

  return (
    <div
      {...attributes}
      ref={setNodeRef}
      className="w-full h-auto border-3 rounded-2xl p-2 bg-background-800 relative group"
      style={{
        borderColor: color,
        position: "relative",
        transform: transform ? `translate3d(0, ${transform?.y}px, 0)` : "none",
      }}
    >
      <JsonResponseSchemaModal
        isOpen={jsonResponseSchemaModal}
        onClose={() => toggleJsonResponseSchemaModal(false)}
        schema={block.settings?.response_schema || defaultResponseSchema}
        sample={block.settings?.response_sample || ""}
        onChangeSchema={(value) => {
          helper.changeResponseSchema(value);
        }}
        onChangeSample={(value) => {
          helper.changeResponseSample(value);
        }}
      />
      {/* move */}
      <div className="w-10 h-10 rounded-lg absolute left-[-52px] top-1.5 group overflow-hidden border border-background-600">
        <div
          className={cn(
            "w-full h-full flex items-center justify-center ",
            canMove && "group-hover:hidden"
          )}
        >
          {i + 1}
        </div>
        {canMove && (
          <div
            {...listeners}
            className="flex justify-center items-center w-full h-full nodrag group-hover:bg-background-600 text-white"
          >
            <TbArrowsMoveVertical size={20} />
          </div>
        )}
      </div>

      {canMove && (
        <>
          {/* remove | right */}

          <div
            className="w-10 h-10 rounded-lg absolute right-[-52px] top-4 invisible group-hover:visible overflow-hidden"
            onClick={() => removeBlock(id)}
          >
            <TbPlus className="rotate-45 transform text-red-500" />
          </div>
        </>
      )}
      {/* head */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <span
            className="text-lg font-bold capitalize text-white px-2 py-1 rounded-lg"
            style={{
              backgroundColor: color,
            }}
          >
            {blockNameMap[type as keyof typeof blockNameMap]}
          </span>
          {type != "run-flow" && (
            <input
              type="text"
              readOnly={block.id === "prompt"}
              value={block.name}
              className={cn(
                "w-1/2 bg-transparent outline-none",
                block.id === "prompt" ? "cursor-grab select-none" : "nodrag"
              )}
              onChange={(e) => updateBlockName(id, e.target.value)}
            />
          )}
          {type == "run-flow" && (
            <Dropdown>
              <DropdownTrigger>
                {helper.selectedFlow?.data.name || "Select Flow"}
              </DropdownTrigger>
              <DropdownMenu
                onAction={(selected) => helper.changeFlow(String(selected))}
                aria-label="flows"
              >
                {
                  // @ts-ignore
                  helper.otherFlows.map((flow) => (
                    <DropdownItem key={flow.id}>{flow.data.name}</DropdownItem>
                  ))
                }
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
        {(type == "text" || type == "list") && canMove && (
          <div>
            <button
              onClick={chooseModel}
              className="px-2 py-1 border border-background-600 rounded-lg truncate w-auto max-w-[150px]"
            >
              {block?.ai_config?.model ? block.ai_config.model : "Choose Model"}
            </button>
          </div>
        )}
      </div>
      {type == "run-flow" && <div className="w-full px-2"></div>}

      {type !== "run-flow" && (
        <>
          <div className="w-full mt-2 nopan nodrag nowheel rounded-lg overflow-hidden">
            <RichTextarea
              className="h-full bg-transparent  p-2 outline-none text-black overflow-y-auto resize-y !caret-white"
              style={{
                width: "100%",
                height: "auto",
                minHeight: "100px",
                maxHeight: "300px",
              }}
              value={block.prompt}
              rows={block.prompt.split("\n").length}
              onChange={(e) => {
                block.prompt = e.target.value;
              }}
            >
              {promptRender}
            </RichTextarea>
          </div>
          {/* settings */}
          <div className="mt-2 flex flex-col gap-2">
            {type == "list" && (
              <>
                <Checkbox
                  title="Cache"
                  isSelected={block.settings?.cache ?? false}
                  onChange={(e) => {
                    if (!block.settings) {
                      block.settings = {};
                    }
                    block.settings.cache = e.target.checked;
                  }}
                >
                  cache
                </Checkbox>
                {/* separator */}
                <Input
                  label="Item Separator"
                  variant="flat"
                  size="sm"
                  value={block.settings?.item_seperator}
                  onChange={(e) => {
                    if (!block.settings) {
                      block.settings = {};
                    }
                    block.settings.item_seperator = e.target.value;
                  }}
                />
              </>
            )}
          </div>
        </>
      )}
      {type == "text" && !isOutputBlock && (
        <div className="flex justify-between items-center h-10">
          {/* json mode */}
          <Checkbox
            isSelected={block.settings?.response_type == "json" ?? false}
            onChange={(e) => {
              if (!block.settings) {
                block.settings = {};
              }
              helper.changeResponseMode(e.target.checked ? "json" : "text");
            }}
          >
            JSON Response
          </Checkbox>
          {block.settings?.response_type == "json" && (
            <Button
              size="sm"
              onClick={() => {
                toggleJsonResponseSchemaModal(true);
              }}
            >
              Types
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Block;
