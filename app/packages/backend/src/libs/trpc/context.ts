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
      const res = await _pb.collection("users").authRefresh();
      if (res?.record?.id) {
        return {
          user: res.record,
          req: opts.req,
        };
      }
    }
  } catch (e) {}
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
