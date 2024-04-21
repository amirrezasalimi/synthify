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
  Radio,
  RadioGroup,
  cn,
} from "@nextui-org/react";
import { useState } from "react";
import { TbArrowsMoveVertical, TbPlus } from "react-icons/tb";
import { RichTextarea, createRegexRenderer } from "rich-textarea";
import JsonResponseSchemaModal from "./json-response-schema-modal";
import DataModal from "./data-modal";
import DataFile from "./data-file";

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

  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id,
  });

  const isOutput = block.id === "output";
  const canMoveOrDelete = !isOutput || flowId !== "main";

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

  const showPrompt = type != "run-flow" && type != "data";
  const showCache = !isOutput && type != "run-flow" && type != "data";

  // data
  const dataType = block.settings?.data_type || "json";
  const onChangeDataType = (value: string) => {
    if (!block.settings) {
      block.settings = {};
    }
    if (value == "parquet") {
      block.settings.data_from = "file";
    }
    // @ts-ignore
    block.settings.data_type = value;
  };
  const dataFrom = block.settings?.data_from || "raw";
  const onChangeDataFrom = (value: string) => {
    if (dataType == "parquet" && value == "raw") {
      return;
    }
    if (!block.settings) {
      block.settings = {};
    }
    // @ts-ignore
    block.settings.data_from = value;
  };

  const [dataModal, toggleDataModal] = useState(false);

  const onChangeDataId = (block_data_id: string | null) => {
    if (!block.settings) {
      block.settings = {};
    }
    block.settings.block_data_id = block_data_id;
  };
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
      {/* json response modal */}
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
      {/* data modal */}
      {dataModal && (
        <DataModal
          isOpen={dataModal}
          closeModal={() => toggleDataModal(false)}
          data={block.settings?.data_raw || ""}
          type={dataType as "json" | "text"}
          onChangeData={(value) => {
            if (!block.settings) {
              block.settings = {};
            }
            block.settings.data_raw = value;
          }}
        />
      )}

      {/* move */}
      <div className="move-block w-10 h-10 rounded-lg absolute left-[-52px] top-1.5 group overflow-hidden border border-background-600">
        <div
          className={cn(
            "w-full h-full flex items-center justify-center ",
            canMoveOrDelete && "group-hover:hidden"
          )}
        >
          {i + 1}
        </div>
        {canMoveOrDelete && (
          <div
            {...listeners}
            className="flex justify-center items-center w-full h-full nodrag group-hover:bg-background-600 text-white"
          >
            <TbArrowsMoveVertical size={20} />
          </div>
        )}
      </div>

      {/* remove | right */}
      {canMoveOrDelete && (
        <div
          className="remove-block w-10 h-10 rounded-lg absolute right-[-52px] top-4 invisible group-hover:visible overflow-hidden"
          onClick={() => removeBlock(id)}
        >
          <TbPlus className="rotate-45 transform text-red-500" />
        </div>
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
              readOnly={!canMoveOrDelete}
              value={block.name}
              className={cn(
                "w-1/2 bg-transparent outline-none",
                !canMoveOrDelete ? "cursor-grab select-none" : "nodrag"
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
        {(type == "llm" || type == "list") && (
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

      {/* content */}
      {showPrompt && (
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
            {showCache && (
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
            )}

            {/* separator */}

            {type == "list" && (
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
            )}
          </div>
        </>
      )}

      {/* json mode */}
      {type == "llm" && canMoveOrDelete && (
        <div className="flex justify-between items-center h-10">
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

      {/* data */}
      {
        // @ts-ignore
        type == "data" && (
          <div className="flex flex-col gap-4 py-6 px-4">
            <div className="flex flex-col gap-2">
              <span>Data Type</span>
              <Dropdown>
                <DropdownTrigger>
                  <Button fullWidth variant="bordered">
                    {block.settings?.data_type || "Select Data Type"}
                  </Button>
                </DropdownTrigger>

                <DropdownMenu
                  selectedKeys={[dataType]}
                  onAction={(selected) => onChangeDataType(String(selected))}
                  aria-label="data-type"
                  variant="bordered"
                >
                  <DropdownItem key={"json"}>json</DropdownItem>
                  <DropdownItem key={"text"}>text</DropdownItem>
                  {/* <DropdownItem key={"parquet"}>parquet</DropdownItem> */}
                </DropdownMenu>
              </Dropdown>
            </div>
            {/* import way */}
            <div>
              <RadioGroup
                label="Select Import method"
                value={dataFrom}
                onChange={(e) => onChangeDataFrom(e.target.value)}
              >
                {dataType != "parquet" && <Radio value="raw">Raw</Radio>}
                {dataFrom == "raw" && (
                  <div className="w-full flex justify-center py-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        toggleDataModal(true);
                      }}
                    >
                      Edit Data
                    </Button>
                  </div>
                )}
                {/* <Radio value="file">File</Radio> */}
                {
                  // @ts-ignore
                  dataFrom == "file" && (
                    <div className="w-full flex justify-center py-2">
                      <DataFile
                      type={dataType}
                      block_data_id={block.settings?.block_data_id || ""}
                      onChangeDataId={onChangeDataId}
                    />
                    </div>
                  )
                }
                {/* <Radio value="hugginface">Hugginface</Radio> */}
              </RadioGroup>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default Block;
