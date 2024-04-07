import { Node } from "reactflow";

export interface FlowData {
  id: string;
  name: string;
  color: string;
}
export type FlowNode = Node<FlowData>;
