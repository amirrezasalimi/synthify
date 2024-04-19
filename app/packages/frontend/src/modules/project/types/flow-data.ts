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
  type: "list" | "llm" | "run-flow" | "merge" ;
  prompt: string;
  settings: {
    response_type?: "json" | "text" | any;
    response_schema?: string;
    response_sample?: string;
    cache?: boolean;
    item_seperator?: string;
    selected_flow?: string;
  };
  ai_config: {
    service?: string;
    model?: string;
    temprature?: number;
  };
  data?: {
    content: string;
    items: string[];
  };
  order: number;
}

export type FlowNode = Node<FlowData>;
