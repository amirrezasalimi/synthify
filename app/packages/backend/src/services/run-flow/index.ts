import { pb } from "../../libs/pb";
import { FlowNode } from "../../types/flow-data";
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
import { AiModelUsage } from "./types";
import Sandbox from "@nyariv/sandboxjs";

// helpers
const rand = (a: number | any[], b?: number) => {
  if (Array.isArray(a)) {
    return a[Math.floor(Math.random() * a.length)];
  }
  if (b === undefined) {
    return Math.floor(Math.random() * a);
  }
  return Math.floor(Math.random() * (b - a + 1) + a);
};

type LogData = {
  type: "debug" | "ai-error";
  message: string;
  flowId: string;
  blockId: string;
};
type AiResponseData = {
  prompt: string;
  response: string;
  serviceName: string;
  modelId: string;
  flowId: string;
  blockId: string;
  //
  usages: AiModelUsage;
};
type RunFlowData = {
  // used for 'list' type , to cache the results for all dataset flows
  cache: Record<string, string | string[] | any>;
  // users ai configured ai services
  aiServices: UserAiResponse<unknown, unknown>[];
  // current flow
  flow: FlowNode;
  // all flows
  flows: FlowNode[];

  //
  log: (data: LogData) => void;

  onAiResponse: (data: AiResponseData) => void;
};

const runFlow = async (props: RunFlowData) => {
  const { cache, aiServices, flow, flows, log, onAiResponse } = props;
  const flowId = flow.id;
  const blockCache: Record<string, string | string[] | any> = {};
  // run single flow
  const blocks = flow.data.blocks;
  const ordredBlocks = blocks.sort((a, b) => a.order - b.order);

  for (const block of ordredBlocks) {
    if (block.type == "run-flow") {
      const nextFlow = flows.find((f) => f.id === block.settings.selected_flow);
      if (nextFlow) {
        const res = await runFlow({
          ...props,
          flow: nextFlow,
        });
        if (res) blockCache[nextFlow.data.name] = res;
        // console.log(`run-flow ${nextFlow.data.name}`, res);
      }
      continue;
    }
    let prompt = "";
    // prompt block
    prompt = block.prompt;
    //  eval {x} of the prompt and replace
    const context: Object = {};
    for (const key in blockCache) {
      // @ts-ignore
      context[key] = blockCache[key];
    }

    const sandbox = new Sandbox({
      globals: {
        ...Sandbox.SAFE_GLOBALS,
        rand,
      },
    });
    let useCache = false;
    if (block.settings.cache) {
      if (cache[`${flowId}-${block.id}`]) {
        blockCache[block.name] = cache[`${flowId}-${block.id}`];
        useCache = true;
      }
    }

    if (!useCache) {
      const regex = /{((?:[^{}]|{[^{}]*})*?)}/g;
      prompt = prompt.replace(regex, (match, p1) => {
        try {
          const code = `return ${p1}`;
          const exec = sandbox.compile(code);

          const res = exec(context).run() as string;
          // console.log(`exec`, code, res);
          return res;
        } catch (e) {
          // console.log(`error`, e);
          return "";
        }
      });

      const ai_config = block.ai_config;
      const service_config = aiServices.find(
        (service) => service.id === ai_config.service
      );
      const isAiBlock = block.type == "llm" || block.type == "list";

      if (service_config && isAiBlock) {
        const oai = new OpenAI({
          apiKey: service_config.api_key,
          baseURL: service_config.endpoint,
        });

        const isJsonMode = block.settings.response_type == "json";

        if (isJsonMode && block.settings.response_schema) {
          const sample = block.settings?.response_sample || "";
          if (sample.trim() != "") {
            prompt += `
---
Sample Json Response:
${sample}
`;
          }
          prompt += `
---
Response exactly in this type format with json data, no extra talk, this type should'nt be as parent root:
${block.settings.response_schema}
`;
        }
        console.log(`prompt`, prompt);

        const aiModelId = ai_config.model ?? "gpt-3.5-turbo";
        let content: string | null = null;
        let usage: AiModelUsage | null = null;
        try {
          const res = await oai.chat.completions.create({
            model: aiModelId,
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
            response_format: {
              type: isJsonMode ? "json_object" : "text",
            },
          });
          content = res?.choices?.[0].message?.content;
          usage = res?.usage as AiModelUsage;
        } catch (e: any) {
          console.log(`error`, e);

          log({
            type: "ai-error",
            message: e.message,
            flowId,
            blockId: block.id,
          });
        }

        if (!content || !usage) continue;
        if (content) {
          onAiResponse({
            prompt,
            response: content ?? "",
            serviceName: service_config.title,
            modelId: aiModelId,
            flowId,
            blockId: block.id,
            usages: usage,
          });
        }
        if (isJsonMode) {
          console.log(`json`, content);
          // replace ```json and last ``` with empty string, with regex , multiline
          const jsonRegex = /```json([\s\S]*?)```/g;
          content = content.replace(jsonRegex, "$1");
          try {
            content = JSON.parse(content);
          } catch (e) {
            log({
              type: "ai-error",
              message: "Invalid JSON response",
              flowId,
              blockId: block.id,
            });
          }
        }

        if (block.type == "list") {
          const sep = block.settings.item_seperator ?? "\n";
          const list = isJsonMode
            ? content
            : (content || "")
                .split(new RegExp(sep, "g"))
                .map((t) => t.trim().replace(sep, ""));

          cache[`${flowId}-${block.id}`] = list;
          blockCache[block.name] = list;
        } else {
          blockCache[block.name] = content;
          cache[`${flowId}-${block.id}`] = content;
        }
        //
      } else {
        blockCache[block.name] = prompt;
        cache[`${flowId}-${block.id}`] = prompt;
      }
    }
    if (ordredBlocks[ordredBlocks.length - 1].id == block.id) {
      if (flowId == "main") {
        return prompt;
      } else {
        return blockCache;
      }
    }
  }
};

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
}) => {
  const mainFlow = flows.find((flow) => flow.data.id === "main") as FlowNode;
  const res = await pb.collection("tasks").create({
    user: userId,
    project: projectId,
    count,
    title,
    flows,
    status: TasksStatusOptions["in-progress"],
  } as TasksRecord);
  const taskId = res.id;

  const aiServices = await pb.collection("user_ai").getFullList({
    user: userId,
  });

  const cache: Record<string, string | string[]> = {};

  const dataset: string[] = [];

  const log = async (data: LogData) => {
    console.log(`log`, data);

    try {
      await pb.collection("task_logs").create({
        task_id: taskId,
        type: "debug",
        message: data.message,
        meta: {
          blockId: data.blockId,
          flowId: data.flowId,
        },
      } as TaskLogsRecord);
    } catch (e) {
      console.log(`error`, e);
    }
  };
  const onAiResponse = async (data: AiResponseData) => {
    try {
      await pb.collection("ai_usages").create({
        project: projectId,
        user: userId,
        entity_id: taskId,
        entity_type: "task",
        // ai_service: data.serviceName,
        cost: data.usages.total_cost,
        usages: data.usages,
        service_name: data.serviceName,
        model_id: data.modelId,
      } as AiUsagesRecord);
    } catch (e) {
      console.log(`error`, e);
    }
  };

  for (let i = 0; i < count; i++) {
    let error = "";
    let result: string | null | undefined;
    try {
      result = (await runFlow({
        cache,
        flow: mainFlow,
        flows,
        aiServices: aiServices,
        log,
        onAiResponse,
      })) as string;
      result && dataset.push(result);
    } catch (e) {
      // @ts-ignore
      error = e.message;
    }
    if (result) {
      await pb.collection("datas").create({
        task: taskId,
        data: {
          content: result ?? "",
        },
        error,
        status: error ? DatasStatusOptions.error : DatasStatusOptions.done,
      } as DatasRecord);
    }
  }
  // update status
  pb.collection("tasks").update(taskId, {
    status: TasksStatusOptions["done"],
  } as TasksRecord);
};

export default runDataTask;
