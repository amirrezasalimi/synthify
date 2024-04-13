import { trpc } from "@/shared/utils/trpc";
import useFlows from "./flows";
import toast from "react-hot-toast";
import useProject from "./project";

const useRun = () => {
  const flows = useFlows();
  const runApi = trpc.project.run.useMutation();
  const project = useProject();
  const run = (title: string, count: number = 1) => {
    return new Promise(async (resolve) => {
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
