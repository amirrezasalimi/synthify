import { useLayoutEffect } from "react";
import YPartyKitProvider from "y-partykit/provider";
import { useProjectStore } from "../stores/project-context";
import { useStore } from "zustand";
import { useParams } from "react-router-dom";

const useInitial = () => {
  const store = useProjectStore();
  const { ydoc } = useStore(store);

  const params = useParams();
  const id = params.id as string;
  useLayoutEffect(() => {
    const provider = new YPartyKitProvider("localhost:1999", id, ydoc);

    return () => {
      provider.destroy();
    };
  }, []);

  return {};
};

export default useInitial;
