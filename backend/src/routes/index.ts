import { initTRPC } from "@trpc/server";

const t = initTRPC.create();
const p = t.procedure;

const router = t.router({
  greet: p.query(({ input }) => {
    return `Hello world`;
  }),
});

export type Router = typeof router;
export default router;
