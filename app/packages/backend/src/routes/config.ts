import { TrpcContext } from "@/libs/trpc/context";
import { TRPCError, initTRPC } from "@trpc/server";
import { RateLimiterMemory } from "rate-limiter-flexible";

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