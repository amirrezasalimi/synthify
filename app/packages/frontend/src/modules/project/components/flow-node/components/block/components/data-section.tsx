import React from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Radio,
  RadioGroup,
} from "@nextui-org/react";
import DataFile from "../../data-file";
import { BlockSettingKey, BlockSettingValue } from "../types";

interface DataSectionProps {
  settings: any;
  onSettingsChange: (key: BlockSettingKey, value: BlockSettingValue) => void;
  toggleDataModal: () => void;
}

const DataSection: React.FC<DataSectionProps> = ({
  settings,
  onSettingsChange,
  toggleDataModal,
}) => {
  const dataType = settings?.data_type || "json";
  const dataFrom = settings?.data_from || "raw";

  const onChangeDataType = (value: string) => {
    onSettingsChange("data_type", value);
    if (value === "parquet") {
      onSettingsChange("data_from", "file");
    }
  };

  const onChangeDataFrom = (value: string) => {
    if (dataType === "parquet" && value === "raw") {
      return;
    }
    onSettingsChange("data_from", value);
  };

  return (
    <div className="flex flex-col gap-4 px-4 py-6">
      <div className="flex flex-col gap-2">
        <span>Data Type</span>
        <Dropdown>
          <DropdownTrigger>
            <Button fullWidth variant="bordered">
              {dataType || "Select Data Type"}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            selectedKeys={[dataType]}
            onAction={(selected) => onChangeDataType(String(selected))}
            aria-label="data-type"
            variant="bordered"
          >
            <DropdownItem key="json">json</DropdownItem>
            <DropdownItem key="text">text</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div>
        <RadioGroup
          label="Select Import method"
          value={dataFrom}
          onChange={(e) => onChangeDataFrom(e.target.value)}
        >
          {dataType !== "parquet" && <Radio value="raw">Raw</Radio>}
          {dataFrom === "raw" && (
            <div className="flex justify-center py-2 w-full">
              <Button size="sm" onClick={toggleDataModal}>
                Edit Data
              </Button>
            </div>
          )}
          {dataFrom === "file" && (
            <div className="flex justify-center py-2 w-full">
              <DataFile
                type={dataType}
                block_data_id={settings?.block_data_id || ""}
                onChangeDataId={(id) => onSettingsChange("block_data_id", id)}
              />
            </div>
          )}
        </RadioGroup>
      </div>
    </div>
  );
};

export default DataSection;
