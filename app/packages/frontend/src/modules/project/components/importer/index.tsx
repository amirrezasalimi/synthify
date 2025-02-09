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
import useSyncedState from "../../hooks/synced-state";
import useDoc from "../../hooks/doc";
import { FlowNode } from "../../types/flow-data";
import { flowColors } from "../../data/colors";
import toast from "react-hot-toast";

const Importer = () => {
  const [isOpen, toggleModal] = useState(false);
  const [schema, setSchema] = useState("");
  const state = useSyncedState();
  const doc = useDoc();
  const handleSchemaChange = (v: string) => {
    setSchema(v);
  };

  const handleSubmit = () => {
    try {
      // Clean the schema string: remove markdown fences if present.
      let cleaned = schema.trim();
      if (cleaned.startsWith("```json")) {
        cleaned = cleaned.replace(/^```json\s*/, "");
      } else if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```\s*/, "");
      }
      if (cleaned.endsWith("```")) {
        cleaned = cleaned.replace(/\s*```$/, "");
      }

      const parsed = JSON.parse(cleaned);

      // Support both an object with "flows" or an array of flows.
      let flows: Record<string, any>;
      if (Array.isArray(parsed)) {
        flows = {};
        parsed.forEach((flow) => {
          if (flow.name) flows[flow.name] = flow;
        });
      } else if (parsed.flows) {
        flows = parsed.flows;
      } else {
        flows = parsed;
      }

      doc.transact(() => {
        // Remove old nodes.
        Object.keys(state.nodes).forEach((key) => delete state.nodes[key]);
        let x = 100,
          y = 100;
        for (const key in flows) {
          const flow = flows[key];
          state.nodes[key] = {
            id: key,
            type: "flow",
            data: {
              ...(flow.data || {}),
              color: flowColors[Math.floor(Math.random() * flowColors.length)],
            },
            position: { x, y },
          };
          x = 500;
        }
      });
    } catch (error) {
      console.error(error);
      toast.error("Invalid JSON");
    }
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
