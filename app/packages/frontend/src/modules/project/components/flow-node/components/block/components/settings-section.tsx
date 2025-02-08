import React from "react";
import { Checkbox, Input } from "@nextui-org/react";
import { FlowData } from "@/modules/project/types/flow-data";

interface SettingsSectionProps {
  settings: any;
  onSettingsChange: (key: keyof FlowData['blocks'][0]['settings'], value: FlowData['blocks'][0]['settings'][keyof FlowData['blocks'][0]['settings']]) => void;
  showCache: boolean;
  type: string;
}
const SettingsSection: React.FC<SettingsSectionProps> = ({
  settings,
  onSettingsChange,
  showCache,
  type,
}) => {
  return (
    <div className="flex flex-col gap-2 mt-2">
      {showCache && (
        <Checkbox
          title="Cache"
          isSelected={settings?.cache ?? false}
          onChange={(e) => onSettingsChange("cache", e.target.checked)}
        >
          cache
        </Checkbox>
      )}

      {type === "list" && (
        <Input
          label="Item Separator"
          variant="flat"
          size="sm"
          value={settings?.item_seperator}
          onChange={(e) => onSettingsChange("item_seperator", e.target.value)}
        />
      )}
    </div>
  );
};

export default SettingsSection;
