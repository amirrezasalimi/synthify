import { z } from "zod";
import { publicProcedure, router, userProcedure } from "./config";
import { pb, pbInstance } from "../libs/pb";
import OpenAI from "openai";
import { AiModel } from "@/types/ai-model";
import { UserAiAddByOptions, UsersResponse } from "@/types/pocketbase";
import { FlowNode } from "@/types/flow-data";
import runDataTask from "@/services/run-flow";
import { TRPCError } from "@trpc/server";

// routes
export const projectRouter = router({
  // user ai's
  add_ai_service: userProcedure
    .input(
      z.object({
        name: z.string(),
        endpoint: z.string(),
        apikey: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { name, endpoint, apikey } }) => {
      const user = ctx.user.id;

      // check name or endpoint already exists
      const exists = await pb.collection("user_ai").getFullList({
        filter: `(endpoint = "${endpoint}" || title = "${name}")`,
      });

      if (exists.length > 0) {
        throw new Error("Name or endpoint already exists");
      }

      const ai = new OpenAI({
        apiKey: apikey,
        baseURL: endpoint,
      });
      let models: AiModel[] = [];
      try {
        models = (await ai.models.list()).data as unknown as AiModel[];
      } catch (e) {
        // throw new Error("Failed to fetch models");
      }
      try {
        const res = await pb.collection("user_ai").create({
          user,
          title: name,
          endpoint,
          api_key: apikey,
          oai_schema: true,
          models: models,
        });
      } catch (e) {
        throw new Error("Failed to add service");
      }
      return true;
    }),
  list_ai_services: userProcedure.query(async ({ ctx }) => {
    const user = ctx.user.id;
    const res = await pb.collection("user_ai").getFullList({
      filter: `user = "${user}"`,
      fields: "id,title,models,add_by",
      sort: "-created",
    });
    const list = res.map((r) => ({
      ...r,
      models: ((r.models as AiModel[]) ?? []).map(
        (m) =>
          ({
            id: m.id,
            name: m?.name,
          } as AiModel)
      ),
    }));
    return list;
  }),
  remove_ai_service: userProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: id }) => {
      const user = ctx.user.id;
      const service = await pb.collection("user_ai").getOne(id);
      // check access
      if (service.user !== user) {
        throw new Error("Access denied");
      }
      if (service.add_by == UserAiAddByOptions.system) {
        throw new Error("System services cannot be removed");
      }
      const res = await pb.collection("user_ai").delete(id);
      return res;
    }),
  remove_service_model: userProcedure
    .input(z.object({ service_id: z.string(), model_id: z.string() }))
    .mutation(async ({ ctx, input: { service_id, model_id } }) => {
      const user = ctx.user.id;
      const service = await pb.collection("user_ai").getOne(service_id);
      // check access
      if (service.user !== user) {
        throw new Error("Access denied");
      }
      if (service.add_by == UserAiAddByOptions.system) {
        throw new Error("System services cannot be modified");
      }
      let models = (service.models as AiModel[]) ?? [];
      models = models.filter((m) => m.id != model_id);
      const res = await pb.collection("user_ai").update(service_id, {
        models,
      });
      if (!res) {
        throw new Error("Failed to remove model");
      }
    }),
  add_service_model: userProcedure
    .input(z.object({ service_id: z.string(), model_id: z.string() }))
    .mutation(async ({ ctx, input: { service_id, model_id } }) => {
      const user = ctx.user.id;
      const service = await pb.collection("user_ai").getOne(service_id);
      // check access
      if (service.user !== user) {
        throw new Error("Access denied");
      }
      if (service.add_by == UserAiAddByOptions.system) {
        throw new Error("System services cannot be modified");
      }
      let models = (service.models as Partial<AiModel>[]) ?? [];
      if (models.find((m) => m.id == model_id)) {
        throw new Error("Model already exists");
      }
      // prepend
      models = [
        {
          id: model_id,
          name: model_id,
        },
        ...models,
      ];

      const res = await pb.collection("user_ai").update(service_id, {
        models,
      });
      if (!res) {
        throw new Error("Failed to add model");
      }
    }),
  refresh_service_models: userProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: id }) => {
      const user = ctx.user.id;
      const service = await pb.collection("user_ai").getOne(id);
      // check access
      if (service.user !== user) {
        throw new Error("Access denied");
      }
      if (service.add_by == UserAiAddByOptions.system) {
        throw new Error("System services cannot be modified");
      }
      const ai = new OpenAI({
        apiKey: service.api_key,
        baseURL: service.endpoint,
      });
      const oldModels = service.models as AiModel[];
      let fetchedModels: AiModel[] = [];
      try {
        fetchedModels = (await ai.models.list()).data as unknown as AiModel[];
      } catch (e) {
        throw new Error("Failed to fetch models");
      }

      const models = fetchedModels as unknown as AiModel[];

      // unique
      const newModels = models.filter(
        (m) => !oldModels.find((sm) => sm.id == m.id)
      );

      const res = await pb.collection("user_ai").update(id, {
        models: [...oldModels, ...newModels],
      });

      if (!res) {
        throw new Error("Failed to refresh models");
      }
    }),

  run: userProcedure
    .input(
      z.object({
        projectId: z.string(),
        title: z.string(),
        count: z.number().optional(),
        flows: z.array(z.custom<FlowNode>()),
      })
    )
    .mutation(
      async ({ ctx, input: { flows, title, count = 1, projectId } }) => {
        const user = ctx.user.id;

        const project = await pb.collection("projects").getOne(projectId);
        if (project.user !== user) {
          throw new Error("Access denied");
        }

        // validation
        const main = flows.find((f) => f.data.id === "main");

        if (main?.data.blocks.length == 1) {
          throw new Error("At least two blocks required");
        }

        runDataTask({
          userId: user,
          projectId,
          count,
          flows: flows,
          title,
        });
        return "ok";
      }
    ),
  // tasks

  tasksList: userProcedure
    .input(
      z.object({
        project: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = ctx.user.id;
      const tasks = await pb.collection("tasks").getFullList({
        sort: "-created",
        filter: `user = "${user}" && project = "${input.project}"`,
      });

      const fetchDoneData = async (task: any) => {
        try {
          const done_data = await pb.collection("datas").getList(1, 1, {
            filter: `task = "${task.id}" && status = "done"`,
            $autoCancel: false,
          });
          return done_data.totalItems;
        } catch (e) {
          // @ts-ignore
          console.error(`error`, e.message);
          return 0;
        }
      };

      const itemsPromises = tasks.map(async (task) => {
        const done_count = await fetchDoneData(task);
        return {
          ...task,
          done_count,
        };
      });

      return await Promise.all(itemsPromises);
    }),

  //
  createProject: userProcedure
    .input(
      z.object({
        title: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { title } }) => {
      const user = ctx.user.id;
      const res = await pb.collection("projects").create({
        user,
        title,
      });
      return res.id;
    }),
  projectsList: userProcedure.query(async ({ ctx }) => {
    const user = ctx.user.id;
    const res = await pb.collection("projects").getFullList({
      filter: `user = "${user}"`,
      sort: "-created",
    });
    return res;
  }),
  removeProject: userProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: id }) => {
      const user = ctx.user.id;
      const project = await pb.collection("projects").getOne(id);
      // check access
      if (project.user !== user) {
        throw new Error("Access denied");
      }
      const res = await pb.collection("projects").delete(id);
      return res;
    }),

  getProject: userProcedure
    .input(z.string())
    .query(async ({ ctx, input: id }) => {
      const user = ctx.user.id;
      try {
        const project = await pb.collection("projects").getOne(id);
        // check access
        if (project.user !== user) {
          throw new Error("Access denied");
        }
        return project;
      } catch (e) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }
    }),

  // for partkyit side
  getProjectWithToken: publicProcedure
    .input(
      z.object({
        token: z.string(),
        project: z.string(),
      })
    )
    .query(async ({ input: { token, project } }) => {
      const _pb = pbInstance();
      _pb.autoCancellation(false);
      try {
        _pb.authStore.save(token);
        await _pb.collection("users").authRefresh();
      } catch (e) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid token",
        });
      }

      const user = _pb.authStore.model as UsersResponse;
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid token",
        });
      }
      pb.autoCancellation(false);

      const projectRecord = await pb.collection("projects").getOne(project);
      if (projectRecord.user !== user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Access denied",
        });
      }
      if (!projectRecord) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }
      pb.autoCancellation(true);
      return projectRecord;
    }),
  updateProjectDataWithToken: publicProcedure
    .input(
      z.object({
        token: z.string(),
        project: z.string(),
        data: z.string(),
        json_data: z.any(),
      })
    )
    .query(async ({ input: { token, project, data, json_data } }) => {
      const _pb = pbInstance();
      _pb.autoCancellation(false);
      try {
        _pb.authStore.save(token);
        await _pb.collection("users").authRefresh();
      } catch (e) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid token",
        });
      }

      const user = _pb.authStore.model as UsersResponse;
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid token",
        });
      }
      pb.autoCancellation(false);

      const projectRecord = await pb.collection("projects").getOne(project);
      if (projectRecord.user !== user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Access denied",
        });
      }
      if (!projectRecord) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }
      pb.autoCancellation(true);
      const res = await pb.collection("projects").update(project, {
        data,
        json_data,
      });
      return res;
    }),
  // data
  getTask: userProcedure.input(z.string()).query(async ({ ctx, input: id }) => {
    const user = ctx.user.id;
    try {
      const task = await pb.collection("tasks").getOne(id);
      // check access
      if (task.user !== user) {
        throw new Error("Access denied");
      }
      return task;
    } catch (e) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Task not found",
      });
    }
  }),
  datasetItems: userProcedure
    .input(
      z.object({
        project: z.string(),
        task: z.string(),
        page: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = ctx.user.id;

      const project = await pb.collection("projects").getOne(input.project);

      if (project.user !== user) {
        throw new Error("Access denied");
      }
      const res = await pb.collection("datas").getList(input.page, 20, {
        filter: `task = "${input.task}"`,
        sort: "-created",
      });
      return res;
    }),
  downloadDataset: userProcedure
    .input(
      z.object({
        project: z.string(),
        task: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user.id;

      const project = await pb.collection("projects").getOne(input.project);

      if (project.user !== user) {
        throw new Error("Access denied");
      }

      // make a .jsonl file
      const datas = await pb.collection("datas").getList(1, 1000, {
        filter: `task = "${input.task}"`,
      });
      const data = datas.items.map((d) => JSON.stringify(d.data)).join("\n");
      return data;
    }),

  presets: userProcedure.query(async () => {
    return await pb.collection("presets").getFullList();
  }),
  getPreset: userProcedure.input(z.string()).mutation(async ({ input: id }) => {
    return await pb.collection("presets").getOne(id);
  }),
});
