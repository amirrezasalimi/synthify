import { Elysia } from "elysia";
import { trpc } from "@elysiajs/trpc";
import { cors } from "@elysiajs/cors";
import createTrpcContext from "./libs/trpc/context";
import { routes } from "@/routes";
import ImportPresets from "./services/import-presets";
ImportPresets();
const elysia = new Elysia()
  .use(
    cors({
      origin: "*",
    })
  )
  .use(
    trpc(routes, {
      createContext: createTrpcContext,
    })
  )

  .get("/", async () => {
    return { message: "Hello World" };
  })
  .listen({
    port: 3001,
    hostname: "0.0.0.0",
  });

console.log(
  `Server is running on port ${elysia.server.hostname}:${elysia.server.port}`
);
