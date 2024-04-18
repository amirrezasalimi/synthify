import { useLayoutEffect, useState } from "react";
import YPartyKitProvider from "y-partykit/provider";
import { useProjectStore } from "../stores/project-context";
import { useStore } from "zustand";
import { useNavigate, useParams } from "react-router-dom";
import useSyncedState from "./synced-state";
import { LINKS } from "@/shared/constants";
import useProject from "./project";
import { pb_client } from "@/shared/utils/pb_client";
import { currentProjectVersion, defaultMainFlow } from "../constants";

const useInitial = () => {
  const store = useProjectStore();
  const { ydoc } = useStore(store);
  const state = useSyncedState();
  const params = useParams();
  const id = params.id as string;
  const [isConnected, setIsConnected] = useState(false);

  const nav = useNavigate();
  const project = useProject();

  useLayoutEffect(() => {
    const isOk = typeof project.project.data != "undefined";

    if (project.project.status === "error" && !isOk) {
      nav(LINKS.DASHBOARD);
      console.log("error");
      return;
    }
    const partyHost = import.meta.env.VITE_PARTY_HOST;

    const provider = new YPartyKitProvider(partyHost, id, ydoc, {
      params() {
        return {
          "x-pb": pb_client.authStore.token,
        };
      },
      resyncInterval: 2000,
      maxBackoffTime: 5000,
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

  const firstTimeCheck = () => {
    if (typeof ydoc.getMap("config").get("isInitialized") === "undefined") {
      state.nodes["main"] = defaultMainFlow;
      state.config.isInitialized = true;
      state.config.projectVersion = currentProjectVersion
    }
  };
  return {
    isConnected,
  };
};

export default useInitial;
