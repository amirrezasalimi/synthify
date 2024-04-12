import { useLayoutEffect, useState } from "react";
import YPartyKitProvider from "y-partykit/provider";
import { useProjectStore } from "../stores/project-context";
import { useStore } from "zustand";
import { useNavigate, useParams } from "react-router-dom";
import useSyncedState from "./synced-state";
import { LINKS } from "@/shared/constants";
import useProject from "./project";

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
    console.log("project ->", project.project.status, isOk);

    if (project.project.status === "error" && !isOk) {
      nav(LINKS.DASHBOARD);
      console.log("error");
      return;
    }
    const partyHost = import.meta.env.VITE_PARTY_HOST;
    const provider = new YPartyKitProvider(partyHost, id, ydoc);

    provider.on("synced", async (status: any) => {
      if (status) {
        setIsConnected(true);
        console.log(`Connected - ${id}`);
        firstTimeCheck();
      }
    });
    return () => {
      provider.destroy();
    };
  }, [project.project.data, project.project.status]);

  const firstTimeCheck = () => {
    if (typeof ydoc.getMap("config").get("isInitialized") === "undefined") {
      state.nodes["main"] = {
        id: "main",
        type: "flow",
        data: {
          id: "main",
          name: "Main Flow",
          color: "#3894FF",
          blocks: [
            {
              id: "prompt",
              name: "Prompt",
              prompt: "",
              type: "text",
              order: 0,
              ai_config: {},
              settings: {},
            },
          ],
        },
        position: { x: 100, y: 100 },
      };
      state.config.isInitialized = true;
    }
  };
  return {
    isConnected,
  };
};

export default useInitial;
