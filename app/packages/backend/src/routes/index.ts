import { TrpcContext } from "@/libs/trpc/context";
import { pb, pbInstance } from "../libs/pb";
import runDataTask from "@/services/run-data-task";
import { FlowNode } from "@/types/flow-data";
import OpenAI from "openai";
import { z } from "zod";

import { TRPCError, initTRPC } from "@trpc/server";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { TasksRecord, UsersRecord, UsersResponse } from "@/types/pocketbase";
import { RecordAuthResponse } from "pocketbase";

export const trpc = initTRPC.context<TrpcContext>().create();
export const router = trpc.router;
export const publicProcedure = trpc.procedure;
export const mergeRouters = trpc.mergeRouters;

// rate limiter
const opts = {
  points: 20,
  duration: 1, // Per second
};

const rateLimiter = new RateLimiterMemory(opts);

const getFingerprint = (req: any) => {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded
    ? (typeof forwarded === "string" ? forwarded : forwarded[0])?.split(/, /)[0]
    : req.ip;
  return ip || "127.0.0.1";
};
export const userProcedure = publicProcedure
  .use(async (opts) => {
    const ip = getFingerprint(opts.ctx.req);
    try {
      await rateLimiter.consume(ip);
    } catch (e) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "Too many requests",
      });
    }
    return opts.next();
  })
  .use(async (opts) => {
    if (!opts.ctx.user) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "We don't take kindly to out-of-town folk",
      });
    }

    return opts.next();
  });
// routes
const projectRouter = router({
  // user ai's
  add_ai_service: userProcedure
    .input(
      z.object({
        title: z.string(),
        endpoint: z.string(),
        apikey: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { title, endpoint, apikey } }) => {
      const user = ctx.user.id;

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
        user,
        title,
        endpoint,
        api_key: apikey,
        oai_schema: true,
        models: models.data.map((m) => m.id),
      });
    }),
  list_ai_services: userProcedure.query(async ({ ctx }) => {
    const user = ctx.user.id;
    const res = await pb.collection("user_ai").getFullList({
      filter: `user = "${user}"`,
    });
    return res;
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
  add_service_model: userProcedure
    .input(z.object({ service_id: z.string(), model_id: z.string() }))
    .mutation(async ({ ctx, input: { service_id, model_id } }) => {
      const user = ctx.user.id;
      const service = await pb.collection("user_ai").getOne(service_id);
      // check access
      if (service.user !== user) {
        throw new Error("Access denied");
      }
      const models = [model_id, ...((service.models as string[]) ?? [])];
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
      const ai = new OpenAI({
        apiKey: service.api_key,
        baseURL: service.endpoint,
      });
      const models = await ai.models.list();
      const oldModels = service.models as string[];
      const newModels = models.data.map((m) => m.id);
      const uniqueModels = [...new Set([...oldModels, ...newModels])];
      const res = await pb.collection("user_ai").update(id, {
        models: uniqueModels,
      });
      if (!res) {
        throw new Error("Failed to refresh models");
      }
    }),

  run: userProcedure
    .input(
      z.object({
        title: z.string(),
        count: z.number().optional(),
        flows: z.array(z.custom<FlowNode>()),
      })
    )
    .mutation(async ({ ctx, input: { flows, title, count = 1 } }) => {
      const user = ctx.user.id;
      // validation
      const main = flows.find((f) => f.data.id === "main");

      if (main?.data.blocks.length == 1) {
        throw new Error("At least two blocks required");
      }

      runDataTask({
        user,
        count,
        flows: flows,
        title,
      });
      return "ok";
    }),
  // tasks

  tasksList: userProcedure.query(async ({ ctx }) => {
    const user = ctx.user.id;
    const tasks = await pb.collection("tasks").getFullList({
      sort: "-created",
      filter: `user = "${user}"`,
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
  getProjectFromPartykit: publicProcedure
    .input(
      z.object({
        token: z.string(),
        project: z.string(),
      })
    )
    .query(async ({ input: { token, project } }) => {
      const _pb = pbInstance();
      _pb.authStore.save(token);
      await _pb.collection("users").authRefresh();
      const user = _pb.authStore.model as UsersResponse;
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid token",
        });
      }
      const projectRecord = await _pb.collection("projects").getOne(project);
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
      return projectRecord;
    }),
});

const userRouter = router({
  userExists: publicProcedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .mutation(
      async ({
        input,
      }): Promise<
        | {
            has_password: boolean;
          }
        | boolean
      > => {
        try {
          const user = await pb
            .collection("users")
            .getFirstListItem(`email = "${input.email}"`);
          const authMethods = await pb
            .collection("users")
            .listExternalAuths(user.id);
          return {
            has_password: authMethods.length == 0,
          };
        } catch (e) {
          return false;
        }
      }
    ),
  registerUser: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const user = await pb
          .collection("users")
          .getFirstListItem(`email = "${input.email}"`);

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User already exists",
          // optional: pass the original error to retain stack trace
          cause: new Error("User already exists"),
        });
      } catch (e) {}

      try {
        const res = await pb.collection("users").create({
          name: "",
          email: input.email,
          password: input.password,
          passwordConfirm: input.password,
        });
        await pb.collection("users").requestVerification(input.email);
        return res;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to register user",
          cause: e,
        });
      }
    }),
});

const routes = router({
  user: userRouter,
  project: projectRouter,
});

type AppRoutes = typeof routes;
export { AppRoutes, routes };
