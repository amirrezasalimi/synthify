import { useLayoutEffect, useState } from "react";
import YPartyKitProvider from "y-partykit/provider";
import { useProjectStore } from "../stores/project-context";
import { useStore } from "zustand";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import useSyncedState from "./synced-state";
import { LINKS } from "@/shared/constants";
import useProject from "./project";
import { pb_client } from "@/shared/utils/pb_client";
import { currentProjectVersion, defaultMainFlow } from "../constants";
import { trpc } from "@/shared/utils/trpc";
import makeUrl from "@/shared/utils/make-url";

const useInitial = () => {
  const store = useProjectStore();
  const { ydoc } = useStore(store);
  const state = useSyncedState();
  const params = useParams();
  const id = params.id as string;
  const [isConnected, setIsConnected] = useState(false);

  const [searchParams] = useSearchParams();
  const presetId = searchParams.get("preset");

  const nav = useNavigate();
  const project = useProject();

  useLayoutEffect(() => {
    project.project.refetch();
  }, []);
  useLayoutEffect(() => {
    const isOk = typeof project.project.data != "undefined";

    if (project.project.status === "error" && !isOk) {
      nav(LINKS.DASHBOARD);
      console.log("error");
      return;
    }
    const partyHost = import.meta.env.VITE_PARTY_HOST;

    const isLocalhost =
      location.hostname === "localhost" ||
      location.hostname === "127.0.0.1" ||
      location.hostname === "[::1]" ||
      location.hostname === "synthify.co";
    const provider = new YPartyKitProvider(partyHost, id, ydoc, {
      params() {
        return {
          "x-pb": pb_client.authStore.token,
        };
      },
      resyncInterval: 2000,
      maxBackoffTime: 5000,
      protocol: isLocalhost ? "ws" : "wss",
    });

    provider.on("synced", async (status: any) => {
      if (status) {
        setIsConnected(true);
        console.log(`Connected - ${id}`);
        firstTimeCheck();
      }
    });
    return () => {
      provider.destroy();
      provider.disconnect();
      provider.ws?.close();
    };
  }, [project.project.data, project.project.status]);

  const preset = trpc.project.getPreset.useMutation();
  const firstTimeCheck = () => {
    if (typeof ydoc.getMap("config").get("isInitialized") === "undefined") {
      if (presetId) {
        preset
          .mutateAsync(presetId)
          .then((res) => {
            const data = res.data as typeof state;
            // set nodes
            for (const key in data.nodes) {
              state.nodes[key] = data.nodes[key];
            }
            state.config.projectVersion = data.config.projectVersion;
            state.config.isInitialized = true;

            // replace page preset
            setTimeout(() => {
              nav(
                makeUrl(LINKS.PROJECT, {
                  id,
                }),
                { replace: true }
              );
            }, 500);
          })
          .catch(() => {
            state.nodes["main"] = defaultMainFlow;
            state.config.isInitialized = true;
            state.config.projectVersion = currentProjectVersion;
          });
      } else {
        state.nodes["main"] = defaultMainFlow;
        state.config.isInitialized = true;
        state.config.projectVersion = currentProjectVersion;
      }
    }
  };
  return {
    isConnected,
  };
};

export default useInitial;
