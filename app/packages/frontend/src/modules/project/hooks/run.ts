import { trpc } from "@/shared/utils/trpc";
import useFlows from "./flows";
import toast from "react-hot-toast";
import useProject from "./project";
import { useReactFlow } from "reactflow";

const useRun = () => {
  const flows = useFlows();
  const runApi = trpc.project.run.useMutation();
  const project = useProject();

  const rf = useReactFlow();
  const softValidation = () => {
    for (const flow of flows.nodes) {
      for (const block of flow.data.blocks) {
        if (block.type == "llm" || block.type == "list") {
          if (!block.ai_config.service) {
            toast.error("Please select AI service for all LLM/List blocks");
            rf.fitView({
              nodes: [{ id: flow.id }],
              duration: 500,
              maxZoom: 1,
            });
            return false;
          }
        }
      }
    }
    return true;
  };
  const run = (title: string, count: number = 1) => {
    return new Promise(async (resolve) => {
      const isValid = softValidation();
      if (!isValid) {
        resolve(false);
      }
      runApi
        .mutateAsync({
          projectId: project.id,
          title,
          count,
          flows: flows.nodes,
        })
        .then(() => {
          toast.success("Task is running");
          resolve(true);
        });
    });
  };
  const isLoading = runApi.isLoading;
  return {
    flows,
    run,
    isLoading,
  };
};

export default useRun;
