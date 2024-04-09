import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "../utils/trpc";
import { getFetch, httpBatchLink, loggerLink } from "@trpc/client";
import toast from "react-hot-toast";

const url = import.meta.env.VITE_BACKEND_HOST;

const TRPCWrapper = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 5000 },
      mutations: {
        onError(error, variables, context) {
          // @ts-ignore
          toast.error(error?.message);
        },
      },
    },
  }));
  const [trpcClient] = useState(() =>
    trpc.createClient({
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
            })
          },
          headers() {
            return {};
          },
        }),
      ],

    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {/* Your app here */}
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default TRPCWrapper;
