import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { Renderer, RichTextarea } from "rich-textarea";
import { Highlight, themes } from "prism-react-renderer";
import Prism from "prismjs";

interface DataModalProps {
  isOpen: boolean;
  closeModal: () => void;
  data: string;
  type: "text" | "json";
  onChangeData: (value: string) => void;
}

const DataModal = ({
  isOpen,
  closeModal,
  data,
  onChangeData,
  type,
}: DataModalProps) => {
  const jsonRenderer: Renderer = (value) => {
    return (
      <Highlight
        prism={Prism}
        theme={themes.okaidia}
        code={value}
        language="json"
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <div className={className} style={style}>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </div>
        )}
      </Highlight>
    );
  };

  return (
    <Modal size="lg" isOpen={isOpen} onClose={closeModal}>
      <ModalContent>
        <ModalHeader>Data</ModalHeader>
        <ModalBody className="flex flex-col gap-4">
          <div>
            <span className="text-sm">
              {type === "json"
                ? "You can edit the JSON data here."
                : "You can edit the text data here."}
            </span>
          </div>
          <RichTextarea
            spellCheck="false"
            autoCorrect="off"
            className="h-full bg-transparent  p-2 outline-none text-black overflow-y-auto resize-none !caret-white"
            style={{
              width: "100%",
              height: "400px",
            }}
            value={data}
            onChange={(e) => {
              onChangeData(e.target.value);
            }}
          >
            {type === "json" ? jsonRenderer : undefined}
          </RichTextarea>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DataModal;
