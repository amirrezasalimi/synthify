import { pb } from "../../libs/pb";
import { FlowBlock, FlowNode } from "../../types/flow-data";
import {
  AiUsagesRecord,
  DatasRecord,
  DatasStatusOptions,
  TaskLogsRecord,
  TasksRecord,
  TasksStatusOptions,
  UserAiResponse,
} from "../../types/pocketbase";
import OpenAI from "openai";
import { AiModelUsage, AiResponseData, LogData, RunFlowData } from "./types";
import Sandbox from "@nyariv/sandboxjs";

// Helper functions for generating random numbers and floats
const generateRandomNumber = (min: number, max?: number): number => {
  if (max === undefined) {
    return Math.floor(Math.random() * min);
  }
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const generateRandomFloat = (
  min: number,
  max: number,
  digits: number = 2
): string => {
  return (Math.random() * (max - min) + min).toFixed(digits);
};

// Function to evaluate expressions within a sandbox environment
const evaluateExpression = (
  content: string,
  context: Object,
  block: FlowBlock,
  logFunction: (data: LogData) => void
): string => {
  try {
    const sandbox = new Sandbox({
      globals: {
        ...Sandbox.SAFE_GLOBALS,
        rand: generateRandomNumber,
        rand_float: generateRandomFloat,
      },
    });

    const regex = /{((?:[^{}]|{(?:[^{}]|{[^{}]*})*})*)}(?![^#]*#END_NO_EXP)/gm;
    content = content.replace(regex, (match, p1) => {
      console.log(`Evaluating expression: ${p1}`); // Add this line
      try {
        const code = `return ${p1}`;
        const exec = sandbox.compile(code);
        const result = exec(context).run() as string;
        return result;
      } catch (error) {
        logFunction({
          type: "error",
          message: `Error in evaluateExpression: ${error ?? ""}`,
          flowId: block.id,
          blockId: block.id,
          custom: {
            expression: p1,
            match,
          },
        });
        return "";
      }
    });
    content = content.replace(/#NO_EXP/g, "").replace(/#END_NO_EXP/g, "");
  } catch (error) {
    logFunction({
      type: "error",
      message: `Error in evaluateExpression: ${error ?? ""}`,
      flowId: block.id,
      blockId: block.id,
    });
  }
  return content;
};

// Function to process a single block within a flow
const processBlock = async (
  block: FlowBlock,
  blockCache: Record<string, string | string[] | any>,
  cache: Record<string, string | string[] | any>,
  aiServices: UserAiResponse<unknown, unknown>[],
  logFunction: (data: LogData) => void,
  onAiResponseFunction: (data: AiResponseData) => void
): Promise<void> => {
  const { type, id: blockId, settings, name, prompt, ai_config } = block;
  let content: any = prompt || "";

  if (settings.cache && cache[`${block.id}-${blockId}`]) {
    blockCache[name] = cache[`${block.id}-${blockId}`];
    return;
  }

  if (type === "data") {
    const { data_type, data_from, data_raw = "" } = settings;
    if (data_from === "raw" && data_raw !== "") {
      content = data_type === "json" ? JSON.parse(data_raw) : data_raw;
    }
  } else {
    content = evaluateExpression(content, blockCache, block, logFunction);
  }

  const serviceConfig = aiServices.find(
    (service) => service.id === ai_config?.service
  );
  const isAiBlock = type === "llm" || type === "list";

  if (serviceConfig && isAiBlock) {
    const aiResponse = await processAiBlock(
      block,
      content,
      serviceConfig,
      logFunction,
      onAiResponseFunction
    );
    if (aiResponse) {
      content = aiResponse;
    }
  }

  blockCache[name] = content;
  if (settings.cache) {
    cache[`${block.id}-${blockId}`] = content;
  }
};

// Function to process AI-related blocks
const processAiBlock = async (
  block: FlowBlock,
  content: string,
  serviceConfig: UserAiResponse<unknown, unknown>,
  logFunction: (data: LogData) => void,
  onAiResponseFunction: (data: AiResponseData) => void
): Promise<string | null | object> => {
  const oai = new OpenAI({
    apiKey: serviceConfig.api_key,
    baseURL: serviceConfig.endpoint,
  });

  const isJsonMode = block.settings.response_type === "json";
  let aiPrompt = content;

  if (isJsonMode && block.settings.response_schema) {
    const sample = block.settings?.response_sample || "";
    if (sample.trim() !== "") {
      aiPrompt += `\n---\nSample Json Response:\n${sample}`;
    }
    aiPrompt += `\n---\nResponse exactly in this type format with json data, no extra talk, this type shouldn't be as parent root:\n${block.settings.response_schema}`;
  }

  const aiModelId = block.ai_config?.model ?? "gpt-3.5-turbo";
  let aiResponse: string | null = null;
  let usage: AiModelUsage | null = null;

  try {
    let temperature = evaluateExpression(
      block.ai_config?.temperature ?? "0.5",
      {},
      block,
      logFunction
    );
    const res = await oai.chat.completions.create({
      temperature: Number(temperature),
      model: aiModelId,
      messages: [{ role: "user", content: aiPrompt }],
      response_format: { type: isJsonMode ? "json_object" : "text" },
    });
    aiResponse = res?.choices?.[0].message?.content ?? null;
    usage = res?.usage as AiModelUsage;
  } catch (error: any) {
    logFunction({
      type: "ai-error",
      message: error.message,
      flowId: block.id,
      blockId: block.id,
    });
    return null;
  }

  if (!aiResponse || !usage) return null;

  onAiResponseFunction({
    prompt: content,
    response: aiResponse,
    serviceName: serviceConfig.title,
    modelId: aiModelId,
    flowId: block.id,
    blockId: block.id,
    usages: usage,
  });

  if (isJsonMode) {
    const jsonRegex = /```json([\s\S]*?)```/g;
    aiResponse = aiResponse.replace(jsonRegex, "$1");
    try {
      aiResponse = JSON.parse(aiResponse);
    } catch (error) {
      logFunction({
        type: "ai-error",
        message: "Invalid JSON response",
        flowId: block.id,
        blockId: block.id,
      });
    }
  }

  if (block.type === "list") {
    const separator = block.settings.item_seperator ?? "\n";
    return isJsonMode
      ? aiResponse
      : (aiResponse ?? "")
          .split(new RegExp(separator, "g"))
          .map((item) => item.trim().replace(separator, ""));
  }

  return aiResponse;
};

// Main function to run a flow
const runFlow = async (
  props: RunFlowData
): Promise<string | Record<string, any> | undefined> => {
  const {
    cache,
    aiServices,
    currentFlow,
    allFlows,
    logFunction,
    onAiResponseFunction,
  } = props;
  const flowId = currentFlow.id;
  const blockCache: Record<string, string | string[] | any> = {};
  const orderedBlocks = currentFlow.data.blocks.sort(
    (a, b) => a.order - b.order
  );

  for (const block of orderedBlocks) {
    if (block.type === "run-flow") {
      const nextFlow = allFlows.find(
        (flow) => flow.id === block.settings.selected_flow
      );
      if (nextFlow) {
        const result = await runFlow({
          ...props,
          currentFlow: nextFlow,
        });
        if (result) blockCache[nextFlow.data.name] = result;
      }
      continue;
    }

    await processBlock(
      block,
      blockCache,
      cache,
      aiServices,
      logFunction,
      onAiResponseFunction
    );

    if (orderedBlocks[orderedBlocks.length - 1].id === block.id) {
      return flowId === "main" ? blockCache[block.name] : blockCache;
    }
  }
};

// Function to run a data task
const runDataTask = async ({
  count,
  title,
  flows,
  userId,
  projectId,
}: {
  count: number;
  title: string;
  flows: FlowNode[];
  userId: string;
  projectId: string;
}): Promise<void> => {
  const mainFlow = flows.find((flow) => flow.data.id === "main") as FlowNode;
  const task = await pb.collection("tasks").create({
    user: userId,
    project: projectId,
    count,
    title,
    flows,
    status: TasksStatusOptions["in-progress"],
  } as TasksRecord);
  const taskId = task.id;

  const aiServices = await pb.collection("user_ai").getFullList({
    user: userId,
  });

  const cache: Record<string, string | string[]> = {};
  const dataset: string[] = [];

  const logFunction = async (data: LogData): Promise<void> => {
    console.log(`log`, data);
    try {
      await pb.collection("task_logs").create({
        task: taskId,
        type: data.type,
        message: data.message,
        meta: {
          blockId: data.blockId,
          flowId: data.flowId,
          ...data.custom,
        },
      } as TaskLogsRecord);
    } catch (error) {
      console.log(`error`, error);
    }
  };

  const onAiResponseFunction = async (data: AiResponseData): Promise<void> => {
    try {
      await logFunction({
        type: "llm-success",
        message: `AI Response`,
        flowId: data.flowId,
        blockId: data.blockId,
        custom: {
          serviceName: data.serviceName,
          modelId: data.modelId,
        },
      });
      await pb.collection("ai_usages").create({
        project: projectId,
        user: userId,
        entity_id: taskId,
        entity_type: "task",
        cost: data.usages.total_cost,
        usages: data.usages,
        service_name: data.serviceName,
        model_id: data.modelId,
      } as AiUsagesRecord);
    } catch (error) {
      console.log(`error`, error);
    }
  };

  for (let i = 0; i < count; i++) {
    let error = "";
    let result: string | null | undefined;
    try {
      result = (await runFlow({
        cache,
        currentFlow: mainFlow,
        allFlows: flows,
        aiServices: aiServices,
        logFunction,
        onAiResponseFunction,
      })) as string;
      result && dataset.push(result);
    } catch (e: any) {
      error = e.message;
    }
    if (result) {
      await pb.collection("datas").create({
        task: taskId,
        user: userId,
        data: {
          content: result ?? "",
        },
        error,
        status: error ? DatasStatusOptions.error : DatasStatusOptions.done,
      } as DatasRecord);
    }
  }

  // Update task status
  await pb.collection("tasks").update(taskId, {
    status: TasksStatusOptions["done"],
  } as TasksRecord);
};

export default runDataTask;
