import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { pb } from "../libs/pb";
import OpenAI from "openai";
import { FlowNode } from "@/modules/project/types/flow-data";
import runDataTask from "../services/run-data-task";

const t = initTRPC.create();
const p = t.procedure;

const router = t.router({
  greet: p.query(({ input }) => {
    return `Hello world`;
  }),

  // user ai's
  add_ai_service: p
    .input(
      z.object({
        title: z.string(),
        endpoint: z.string(),
        apikey: z.string(),
      })
    )
    .mutation(async ({ input: { title, endpoint, apikey } }) => {
      const user = "1";

      // check name or endpoint already exists
      const exists = await pb.collection("user_ai").getFullList({
        filter: `endpoint = "${endpoint}"`,
      });

      if (exists.length > 0) {
        throw new Error("Name or endpoint already exists");
      }

      const ai = new OpenAI({
        apiKey: apikey,
        baseURL: endpoint,
      });
      const models = await ai.models.list();
      const res = await pb.collection("user_ai").create({
        title,
        endpoint,
        api_key: apikey,
        oai_schema: true,
        models: models.data.map((m) => m.id),
      });
    }),
  list_ai_services: p.query(async () => {
    const user = "1";
    const res = await pb.collection("user_ai").getFullList();
    // .getFullList({
    //   // filter: `user = "${user}"`,
    // });
    return res;
  }),
  remove_ai_service: p.input(z.string()).mutation(async ({ input: id }) => {
    const user = "1";
    const res = await pb.collection("user_ai").delete(id);
    return res;
  }),
  remove_service_model: p
    .input(z.object({ service_id: z.string(), model_id: z.string() }))
    .mutation(async ({ input: { service_id, model_id } }) => {
      const user = "1";
      const service = await pb.collection("user_ai").getOne(service_id);
      const models = ((service.models as string[]) ?? []).filter(
        (m) => m !== model_id
      );
      const res = await pb.collection("user_ai").update(service_id, {
        models,
      });
      if (!res) {
        throw new Error("Failed to remove model");
      }
    }),
  add_service_model: p
    .input(z.object({ service_id: z.string(), model_id: z.string() }))
    .mutation(async ({ input: { service_id, model_id } }) => {
      const user = "1";
      const service = await pb.collection("user_ai").getOne(service_id);
      const models = [model_id, ...((service.models as string[]) ?? [])];
      const res = await pb.collection("user_ai").update(service_id, {
        models,
      });
      if (!res) {
        throw new Error("Failed to add model");
      }
    }),
  refresh_service_models: p
    .input(z.string())
    .mutation(async ({ input: id }) => {
      const user = "1";
      const service = await pb.collection("user_ai").getOne(id);
      const ai = new OpenAI({
        apiKey: service.api_key,
        baseURL: service.endpoint,
      });
      const models = await ai.models.list();
      const res = await pb.collection("user_ai").update(id, {
        models: models.data.map((m) => m.id),
      });
      if (!res) {
        throw new Error("Failed to refresh models");
      }
    }),

  run: p
    .input(
      z.object({
        title: z.string(),
        count: z.number().optional(),
        flows: z.array(z.custom<FlowNode>()),
      })
    )
    .mutation(async ({ input: { flows, title, count = 1 } }) => {
      // validation
      const main = flows.find((f) => f.data.id === "main");

      if (main?.data.blocks.length == 1) {
        throw new Error("At least two blocks required");
      }

      runDataTask({
        count,
        flows,
        title,
      });
      return "ok";
    }),
  // tasks

  tasksList: p.query(async () => {
    const res = await pb.collection("tasks").getFullList();
    return res;
  }),
});
export type Router = typeof router;
export default router;
