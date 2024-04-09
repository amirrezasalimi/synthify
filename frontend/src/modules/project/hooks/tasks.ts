import { trpcApi } from "@/shared/utils/trpc";
import { useQuery } from "@tanstack/react-query";
const useTasks = () => {
  const tasks = useQuery(["tasks"], () => trpcApi.tasksList.query());

  return {
    tasks,
  };
};

export default useTasks;
