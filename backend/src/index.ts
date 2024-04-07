import { Elysia } from "elysia";
import { trpc } from "@elysiajs/trpc";
import router from "./routes";
import { cors } from "@elysiajs/cors";

const elysia = new Elysia()
  .use(trpc(router))
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
