import {
    createTRPCReact,
    getFetch,
    httpBatchLink,
    loggerLink,
} from "@trpc/react-query";
import { createTRPCProxyClient } from "@trpc/client";
import { Router } from "../../../../backend/src/routes";
export const trpc = createTRPCReact<Router>();
const url = import.meta.env.VITE_BACKEND_HOST;

const config: any = {
  links: [
    loggerLink({
      enabled: () => true,
    }),
    httpBatchLink({
      url: `${url}/trpc`,
      fetch: async (input, init?) => {
        const fetch = getFetch();
        return fetch(input, {
          ...init,
        });
      },
      headers() {
        return {};
      },
    }),
  ],
};
export const trpcClient = trpc.createClient(config);
export const trpcApi = createTRPCProxyClient<Router>(config);
