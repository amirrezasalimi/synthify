import { Elysia } from "elysia";
import { trpc } from "@elysiajs/trpc";
import { cors } from "@elysiajs/cors";
import createTrpcContext from "./libs/trpc/context";
import {routes } from "@/routes";
const elysia = new Elysia()
  .use(
    trpc(routes, {
      createContext: createTrpcContext,
    })
  )
  .use(
    cors({
      origin: "*",
    })
  )
  .get("/", async () => {
    return {};
  })
  .listen(3002);

console.log(`Server is running on port ${elysia.server.port}`);

