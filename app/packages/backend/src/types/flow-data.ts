// Represents the overall structure of a flow, including its metadata and blocks
export interface FlowData {
  id: string;
  name: string;
  color: string;
  blocks: FlowBlock[];
}

// Defines the structure of an individual block within a flow
export interface FlowBlock {
  id: string;
  name: string;
  // Specifies the type of block, which determines its behavior in the flow
  type: "list" | "llm" | "run-flow" | "merge" | "data";
  // The content or instruction for the block, often used as input for AI processing
  prompt: string;
  // Configuration options for the block, varying based on the block type
  settings: {
    // Options for data blocks
    data_type?: "json" | "text" | "parquet";
    data_from?: "file" | "hugginface" | "raw";
    data_raw?: string;
    block_data_id?: string; // not used now
    // Options for AI response handling
    response_type?: "json" | "text" | any;
    response_schema?: string;
    response_sample?: string;
    // Enables caching of block results for optimization
    cache?: boolean;
    // Used in list blocks to specify how to split items
    item_seperator?: string;
    // Used in run-flow blocks to specify which flow to run
    selected_flow?: string;
  };
  // Configuration for AI service integration
  ai_config: {
    service?: string;
    model?: string;
    // Can be evaluated as an expression to set AI temperature dynamically
    temperature?: string;
  };
  // Stores the processed data or results of the block
  data?: {
    content: string;
    items: string[];
  };
  // Determines the execution order of blocks within a flow
  order: number;
}

// Represents a node in the flow structure, typically used in the UI or flow management
export interface FlowNode {
  id: string;
  type: string;
  data: FlowData;
}