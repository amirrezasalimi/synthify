import { FlowBlock, FlowNode } from "./types/flow-data";

export const blockTypes = ["llm", "list", "run-flow", "merge"];
export const blockNameMap: Record<string, string> = {
  llm: "LLM",
  list: "List",
  "run-flow": "Run Flow",
  merge: "Merge",
};
export const promptBlock: FlowBlock = {
  id: "output",
  name: "output",
  prompt: "",
  type: "merge",
  order: 0,
  ai_config: {},
  settings: {},
};
export const defaultMainFlow: FlowNode = {
  id: "main",
  type: "flow",
  data: {
    id: "main",
    name: "Main Flow",
    color: "#3894FF",
    blocks: [{ ...promptBlock }],
  },
  position: { x: 100, y: 100 },
};

export const defaultResponseSchema = `
type Response=string[]
`;

export const currentProjectVersion = "0.1";
