import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { TbInfoCircle } from "react-icons/tb";
import { RichTextarea, createRegexRenderer } from "rich-textarea";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  onChange: (content: string) => void;
}
const JsonResponseSchemaModal = ({
  isOpen,
  onClose,
  content,
  onChange,
}: Props) => {
  const contentRender = createRegexRenderer([
    // Anything between {} highlight
    [/{((?:[^{}]|{[^{}]*})*?)}/g, { color: "#0EC2FB" }],
    // TypeScript interface declarations
    [/interface\s+([a-zA-Z][\w]*)/g, { color: "#FFA500" }],
    // TypeScript type aliases
    [/type\s+([a-zA-Z][\w]*)/g, { color: "#FFA500" }],
    // Key-value pairs within interfaces
    [/\b([a-zA-Z][\w]*)\s*:\s*([a-zA-Z][\w]*)\b/g, { color: "#FF00FF" }],
    // Highlighting different types
    [/\b(string|number|boolean|object|any)\b/g, { color: "#00FF00" }],
  ]);

  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Response Schema</ModalHeader>
        <ModalBody className="flex flex-col gap-1 py-4">
          <span className="text-sm">
            with provided response schema,the llm will generate json response in
            this format.
          </span>

          <RichTextarea
            className="h-full bg-transparent  p-2 outline-none text-black overflow-y-auto resize-none !caret-white"
            style={{
              width: "100%",
              height: "300px",
            }}
            value={content}
            onChange={(e) => {
              onChange(e.target.value);
            }}
          >
            {contentRender}
          </RichTextarea>
          <div className="p-2 rounded-md bg-warning-800 text-foreground-100 text-sm flex items-center gap-2">
            <TbInfoCircle size={20} />
            <span> make sure your llm support json mode</span>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default JsonResponseSchemaModal;
