import { Node } from "reactflow";

export interface FlowData {
  id: string;
  name: string;
  color: string;
  blocks: FlowBlock[];
}
export type BlockType = "list" | "llm" | "run-flow" | "merge" | "data";

export interface FlowBlock {
  id: string;
  name: string;
  type: BlockType;
  prompt: string;
  settings: {
    data_type?: "json" | "text" | "parquet";
    data_from?: "file" | "hugginface" | "raw";
    data_raw?: string;
    block_data_id?: string | null;
    //
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
    temperature?: string;
  };
  data?: {
    content: string;
    items: string[];
  };
  order: number;
}

export type FlowNode = Node<FlowData>;
