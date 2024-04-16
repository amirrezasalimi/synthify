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

type LogData = {
  type: "debug" | "error";
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
  cache: Record<string, string | string[]>;
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
  const blockCache: Record<string, string | string[]> = {};
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
        console.log(`run-flow ${nextFlow.data.name}`, res);
      }
      continue;
    }
    let prompt = "";
    // prompt block
    prompt = block.prompt;
    //  eval {x} of the prompt and replace

    for (const key in blockCache) {
      // @ts-ignore
      global[key] = blockCache[key];
    }
    // @ts-ignore
    global.rand = (a: number | any[], b?: number) => {
      if (Array.isArray(a)) {
        return a[Math.floor(Math.random() * a.length)];
      }
      if (b === undefined) {
        return Math.floor(Math.random() * a);
      }
      return Math.floor(Math.random() * (b - a + 1) + a);
    };

    prompt = prompt.replace(/{(.*?)}/g, (match, p1) => {
      try {
        return eval(p1);
      } catch (e) {
        // console.log(`error`, e);
        return "";
      }
    });

    if (block.id == "prompt") {
      blockCache[block.name] = prompt;
      return prompt;
    }

    const ai_config = block.ai_config;
    const service_config = aiServices.find(
      (service) => service.id === ai_config.service
    );
    if (service_config) {
      const oai = new OpenAI({
        apiKey: service_config.api_key,
        baseURL: service_config.endpoint,
      });
      if (block.type == "list" && block.settings.cache) {
        if (cache[`${flowId}-${block.id}`]) {
          blockCache[block.name] = cache[`${flowId}-${block.id}`];
          continue;
        }
      }

      const aiModelId = ai_config.model ?? "gpt-3.5-turbo";
      const res = await oai.chat.completions.create({
        model: aiModelId,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const content = res.choices[0].message?.content;

      onAiResponse({
        prompt,
        response: content ?? "",
        serviceName: service_config.title,
        modelId: aiModelId,
        flowId,
        blockId: block.id,
        usages: res.usage as AiModelUsage,
      });
      if (!content) continue;

      if (block.type == "list") {
        const sep = block.settings.item_seperator ?? "\n";
        const list = content
          .split(new RegExp(sep, "g"))
          .map((t) => t.trim().replace(sep, ""));

        cache[`${flowId}-${block.id}`] = list;
        blockCache[block.name] = cache[`${flowId}-${block.id}`];
      } else if (block.type == "text") {
        blockCache[block.name] = content;
      }
      //
    } else {
      blockCache[block.name] = prompt;
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

  const aiServices = await pb.collection("user_ai").getFullList();

  const cache: Record<string, string | string[]> = {};

  const dataset: string[] = [];

  const log = async (data: LogData) => {
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
        task: taskId,
        user: userId,
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
    let result: string | null | undefined = "";
    try {
      result = await runFlow({
        cache,
        flow: mainFlow,
        flows,
        aiServices: aiServices,
        log,
        onAiResponse,
      });
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
