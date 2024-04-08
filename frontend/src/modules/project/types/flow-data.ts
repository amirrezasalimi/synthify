import { Node } from "reactflow";

export interface FlowData {
  id: string;
  name: string;
  color: string;
  blocks: FlowBlock[];
}
export interface FlowBlock {
  id: string;
  name: string;
  type: "list" | "text";
  prompt: string;
  cache?: boolean;
  data?: {
    content: string;
    items: string[];
  };
  order: number;
}

export type FlowNode = Node<FlowData>;
