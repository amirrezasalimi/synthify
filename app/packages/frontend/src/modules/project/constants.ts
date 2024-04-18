import { FlowNode } from "./types/flow-data";

export const blockTypes = ["text", "list", "run-flow", "merge"];
export const blockNameMap: Record<string, string> = {
  text: "LLM",
  list: "List",
  "run-flow": "Run Flow",
  prompt: "Prompt",
  merge: "Merge",
};

export const defaultMainFlow: FlowNode = {
  id: "main",
  type: "flow",
  data: {
    id: "main",
    name: "Main Flow",
    color: "#3894FF",
    blocks: [
      {
        id: "prompt",
        name: "Prompt",
        prompt: "",
        type: "text",
        order: 0,
        ai_config: {},
        settings: {},
      },
    ],
  },
  position: { x: 100, y: 100 },
};

export const defaultResponseSchema = `
type Response=string[]
`;

export const currentProjectVersion = "0.1";
