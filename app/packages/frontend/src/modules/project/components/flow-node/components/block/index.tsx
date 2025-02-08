import { defaultResponseSchema } from "@/modules/project/constants";
import useBlock from "@/modules/project/hooks/block";
import { FlowBlock } from "@/modules/project/types/flow-data";
import { Button, Checkbox, Input } from "@nextui-org/react";
import { useState } from "react";
import JsonResponseSchemaModal from "../json-response-schema-modal";
import DataModal from "../data-modal";
import DataSection from "./components/data-section";
import PromptSection from "./components/prompt-section";
import SettingsSection from "./components/settings-section";
import BlockHead from "./components/head";
import { Handle, Position } from "reactflow";
import { BlockSettingKey, BlockSettingValue } from "./types";
import { useSortable } from "@dnd-kit/sortable";

interface BlockProps {
  i: number;
  flowId: string;
  block: FlowBlock;
  color: string;
  updateBlockName: (id: string, name: string) => void;
  removeBlock: (id: string) => void;
}

const Block: React.FC<BlockProps> = ({
  i,
  flowId,
  block,
  color,
  updateBlockName,
  removeBlock,
}) => {
  const helper = useBlock(flowId, block.id);

  const { id, type } = block;

  const isOutput = block.id === "output";
  const canMoveOrDelete = !isOutput || flowId !== "main";

  const [jsonResponseSchemaModal, setJsonResponseSchemaModal] = useState(false);
  const [dataModal, setDataModal] = useState(false);

  const showPrompt = type !== "run-flow" && type !== "data";
  const showCache = !isOutput && type !== "run-flow" && type !== "data";

  // app/packages/frontend/src/modules/project/components/flow-node/components/block/index.tsx (47-53)

  const onSettingsChange = (key: BlockSettingKey, value: BlockSettingValue) => {
    if (!block.settings) {
      block.settings = {};
    }
    block.settings[key] = value;
  };
  const {
    attributes,
    listeners: sorterHandleListeners,
    setNodeRef,
    transform,
  } = useSortable({
    id,
  });
  return (
    <div
      {...attributes}
      ref={setNodeRef}
      className="!relative border-3 bg-background-800 p-2 rounded-2xl w-full h-auto group"
      style={{
        borderColor: color,
        transform: transform ? `translate3d(0, ${transform?.y}px, 0)` : "none",
      }}
    >
      <JsonResponseSchemaModal
        isOpen={jsonResponseSchemaModal}
        onClose={() => setJsonResponseSchemaModal(false)}
        schema={block.settings?.response_schema || defaultResponseSchema}
        sample={block.settings?.response_sample || ""}
        onChangeSchema={helper.changeResponseSchema}
        onChangeSample={helper.changeResponseSample}
      />
      {dataModal && (
        <DataModal
          isOpen={dataModal}
          closeModal={() => setDataModal(false)}
          data={block.settings?.data_raw || ""}
          type={block.settings?.data_type as "json" | "text"}
          onChangeData={(value) => onSettingsChange("data_raw", value)}
        />
      )}

      <BlockHead
        i={i}
        flowId={flowId}
        blockId={id}
        color={color}
        canMoveOrDelete={canMoveOrDelete}
        updateBlockName={updateBlockName}
        removeBlock={removeBlock}
        sorterHandleListeners={sorterHandleListeners}
      />

      {showPrompt && (
        <>
          <PromptSection
            prompt={block.prompt}
            onPromptChange={(value) => {
              block.prompt = value;
            }}
          />
          <SettingsSection
            settings={block.settings}
            onSettingsChange={onSettingsChange}
            showCache={showCache}
            type={type}
          />
        </>
      )}
      {type === "llm" && canMoveOrDelete && (
        <div className="flex justify-between items-center h-10">
          <Checkbox
            isSelected={block.settings?.response_type === "json"}
            onChange={(e) => {
              helper.changeResponseMode(e.target.checked ? "json" : "text");
            }}
          >
            JSON Response
          </Checkbox>
          {block.settings?.response_type === "json" && (
            <Button size="sm" onClick={() => setJsonResponseSchemaModal(true)}>
              Types
            </Button>
          )}
        </div>
      )}

      {(type === "list" || type === "llm") && (
        <div className="flex flex-col gap-2 mb-2">
          <Input
            label="Temp"
            variant="flat"
            size="sm"
            className="nodrag nowheel"
            value={String(block.ai_config?.temperature ?? 0.5)}
            onChange={(e) => {
              if (!block.ai_config) {
                block.ai_config = {};
              }
              block.ai_config.temperature = e.target.value;
            }}
          />
        </div>
      )}

      {type === "data" && (
        <DataSection
          settings={block.settings}
          onSettingsChange={onSettingsChange}
          toggleDataModal={() => setDataModal(true)}
        />
      )}

      {helper.selectedFlow && (
        <Handle
          id={`runflow-${id}`}
          type="source"
          position={Position.Right}
          className="!top-6 !right-[-36px] absolute !border-none !w-3 !h-3 group-hover:invisible visible"
          style={{
            background: color,
          }}
        />
      )}
    </div>
  );
};

export default Block;
