import { FlowNode } from "@/types/flow-data";
import { UserAiResponse } from "@/types/pocketbase";

export type LogData = {
    type: "debug" | "ai-error" | "llm-success" | "error";
    message: string;
    flowId: string;
    blockId: string;
    custom?: any;
};

export type AiResponseData = {
    prompt: string;
    response: string;
    serviceName: string;
    modelId: string;
    flowId: string;
    blockId: string;
    usages: AiModelUsage;
};

export type RunFlowData = {
    cache: Record<string, string | string[] | any>;
    aiServices: UserAiResponse<unknown, unknown>[];
    currentFlow: FlowNode;
    allFlows: FlowNode[];
    logFunction: (data: LogData) => void;
    onAiResponseFunction: (data: AiResponseData) => void;
};

export type AiModelUsage = {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    total_cost: number;
}