import { pbInstance } from "@/libs/pb";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { UsersResponse } from "@/types/pocketbase";
import { inferAsyncReturnType } from "@trpc/server";

const createTrpcContext = async function (
  opts: FetchCreateContextFnOptions
): Promise<{
  user: UsersResponse<unknown>;
  req: FetchCreateContextFnOptions["req"];
}> {
  try {
    const xPb = opts.req.headers.get("x-pb");
    if (xPb) {
      const _pb = pbInstance();
      _pb.authStore.save(xPb);
      if (_pb.authStore.isValid) {
        const res = await _pb.collection("users").authRefresh();
        if (res?.record) {
          return {
            user: res.record,
            req: opts.req,
          };
        }
      } else {
        // throw Error("Invalid token");
      }
    }
  } catch (e) {
    // console.log("context error:",e);
  }
  // todo: find better approach
  return {
    req: opts.req,
  } as {
    user: UsersResponse<unknown>;
    req: FetchCreateContextFnOptions["req"];
  }
};
export default createTrpcContext;
export type TrpcContext = inferAsyncReturnType<typeof createTrpcContext>;
