export interface FlowData {
  id: string;
  name: string;
  color: string;
  blocks: FlowBlock[];
}
export interface FlowBlock {
  id: string;
  name: string;
  type: "list" | "llm" | "run-flow" | "merge" | "data";
  prompt: string;
  settings: {
    data_type?: "json" | "text" | "parquet";
    data_from?: "file" | "hugginface" | "raw";
    data_raw?: string;
    block_data_id?: string;
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
    temprature?: number;
  };
  data?: {
    content: string;
    items: string[];
  };
  order: number;
}

export interface FlowNode {
  id: string;
  type: string;
  data: FlowData;
}
