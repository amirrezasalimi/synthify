import { trpc } from "@/shared/utils/trpc";
import useFlows from "./flows";
import toast from "react-hot-toast";

const useRun = () => {
  const flows = useFlows();
  const runApi = trpc.run.useMutation();
  const run = (title: string, count: number = 1) => {
    return new Promise(async (resolve) => {
      runApi
        .mutateAsync({
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
