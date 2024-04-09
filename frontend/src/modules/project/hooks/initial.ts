import { useLayoutEffect, useState } from "react";
import YPartyKitProvider from "y-partykit/provider";
import { useProjectStore } from "../stores/project-context";
import { useStore } from "zustand";
import { useParams } from "react-router-dom";
import useSyncedState from "./synced-state";

const useInitial = () => {
  const store = useProjectStore();
  const { ydoc } = useStore(store);
  const state = useSyncedState();
  const params = useParams();
  const id = params.id as string;
  const [isConnected, setIsConnected] = useState(false);
  useLayoutEffect(() => {
    const provider = new YPartyKitProvider("localhost:1999", id, ydoc);

    provider.on("synced", (status: any) => {
      if (status) {
        setIsConnected(true);
        console.log(`Connected - ${id}`);
        firstTimeCheck();
      }
    });
    return () => {
      provider.destroy();
    };
  }, []);

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
