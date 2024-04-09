import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "../utils/trpc";
import toast from "react-hot-toast";

const TRPCWrapper = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 5000 },
          mutations: {
            onError(error, variables, context) {
              // @ts-ignore
              toast.error(error?.message);
            },
          },
        },
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
