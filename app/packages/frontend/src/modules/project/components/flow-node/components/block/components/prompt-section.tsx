import React from "react";
import { RichTextarea, createRegexRenderer } from "rich-textarea";

interface PromptSectionProps {
  prompt: string;
  onPromptChange: (value: string) => void;
}

const PromptSection: React.FC<PromptSectionProps> = ({
  prompt,
  onPromptChange,
}) => {
  const regex = new RegExp(
    "{{((?:[^{}]|{(?:[^{}]|{[^{}]*})*})*)}}(?![^#]*#END_NO_EXP)",
    "gm"
  );

  const promptRender = createRegexRenderer([
    [regex, { color: "#0EC2FB" }],
    [/^#END_NO_EXP/gm, { color: "#FF3333" }],
    [/^#NO_EXP/gm, { color: "#FF3333" }],
  ]);

  return (
    <div className="mt-2 rounded-lg w-full overflow-hidden nodrag nopan nowheel">
      <RichTextarea
        className="bg-transparent p-2 h-full text-black overflow-y-auto !caret-white outline-none resize-y"
        style={{
          width: "100%",
          height: "auto",
          minHeight: "100px",
          maxHeight: "300px",
        }}
        value={prompt}
        rows={prompt.split("\n").length}
        onChange={(e) => onPromptChange(e.target.value)}
      >
        {promptRender}
      </RichTextarea>
    </div>
  );
};

export default PromptSection;
