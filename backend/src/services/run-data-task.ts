import { pb } from "../libs/pb";
import { FlowNode } from "../types/flow-data";
import {
  DatasRecord,
  DatasStatusOptions,
  TasksRecord,
  TasksStatusOptions,
  UserAiResponse,
} from "../types/pocketbase";
import OpenAI from "openai";

const runFlow = async ({
  cache,
  aiServices,
  flow,
  flows,
}: {
  cache: Record<string, string | string[]>;
  aiServices: UserAiResponse<unknown, unknown>[];
  flow: FlowNode;
  flows: FlowNode[];
}) => {
  const flowId = flow.id;
  let errors = [];
  const blockCache: Record<string, string | string[]> = {};
  // run single flow
  const blocks = flow.data.blocks;
  const ordredBlocks = blocks.sort((a, b) => a.order - b.order);
  console.log(`ordredBlocks`, ordredBlocks);

  for (const block of ordredBlocks) {
    if (block.type == "run-flow") {
      const nextFlow = flows.find((f) => f.id === block.settings.selected_flow);
      if (nextFlow) {
        const res = await runFlow({
          cache,
          flow: nextFlow,
          flows,
          aiServices,
        });
        if (res) blockCache[nextFlow.data.name] = res;
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

      console.log(`use ai `, block.name, prompt);
      const res = await oai.chat.completions.create({
        model: ai_config.model ?? "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });
      let content = res.choices[0].message?.content;
      if (!content) continue;
      if (block.type == "list") {
        const sep = block.settings.item_seperator ?? "\n";
        cache[`${flowId}-${block.id}`] = content
          .split(sep)
          .map((t) => t.trim().replace(sep, ""));
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
}: {
  count: number;
  title: string;
  flows: FlowNode[];
}) => {
  const mainFlow = flows.find((flow) => flow.data.id === "main") as FlowNode;
  const res = await pb.collection("tasks").create({
    count,
    title,
    flows,
    status: TasksStatusOptions["in-progress"],
    // user: "1",
  } as TasksRecord);
  const taskId = res.id;

  const aiServices = await pb.collection("user_ai").getFullList();

  const cache: Record<string, string | string[]> = {};
  const dataset: string[] = [];

  for (let i = 0; i < count; i++) {
    let error = "";
    let result: string | null | undefined = "";
    try {
      result = await runFlow({
        cache,
        flow: mainFlow,
        flows,
        aiServices: aiServices,
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
  console.log(`dataset`, dataset);

  // update status
  pb.collection("tasks").update(taskId, {
    status: TasksStatusOptions["done"],
  } as TasksRecord);
};

export default runDataTask;
