import {
  createTRPCReact,
  getFetch,
  httpBatchLink,
  loggerLink,
} from "@trpc/react-query";
import { createTRPCProxyClient } from "@trpc/client";

import { AppRoutes } from "@synthify/backend";
import { pb_client } from "./pb_client";
export const trpc = createTRPCReact<AppRoutes>();
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
        if (pb_client.authStore.isValid) {
          return {
            "x-pb": pb_client.authStore.token,
          };
        }
        return {};
      },
    }),
  ],
};
export const trpcClient = trpc.createClient(config);
export const trpcApi = createTRPCProxyClient<AppRoutes>(config);
