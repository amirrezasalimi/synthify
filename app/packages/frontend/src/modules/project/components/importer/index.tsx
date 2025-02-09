import { useState } from "react";
import {
  Modal,
  Button,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalContent,
} from "@nextui-org/react";
import { createRegexRenderer, RichTextarea } from "rich-textarea";
import useDataImporter from "../../hooks/data-importer";

const Importer = () => {
  const [isOpen, toggleModal] = useState(false);
  const [schema, setSchema] = useState("");
  const importer = useDataImporter();
  const handleSchemaChange = (v: string) => {
    setSchema(v);
  };

  const handleSubmit = () => {
    importer.importData(schema);
  };

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
    <>
      <Button
        size="sm"
        color="default"
        variant="bordered"
        onPress={() => toggleModal(true)}
      >
        Importer
      </Button>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        isOpen={isOpen}
        onClose={() => toggleModal(false)}
      >
        <ModalContent>
          <ModalHeader>
            <h2 id="modal-title">Import JSON</h2>
          </ModalHeader>
          <ModalBody>
            <RichTextarea
              className="bg-transparent p-2 h-full text-black overflow-y-auto !caret-white outline-none resize-none"
              style={{
                width: "100%",
                height: "200px",
              }}
              value={schema}
              onChange={(e) => {
                handleSchemaChange(e.target.value);
              }}
            >
              {contentRender}
            </RichTextarea>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="flat"
              color="danger"
              onClick={() => toggleModal(false)}
            >
              Close
            </Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Importer;
