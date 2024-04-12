import { trpc } from "@/shared/utils/trpc";

const useTasks = () => {
  const tasks = trpc.project.tasksList.useQuery(undefined, {
    refetchInterval: 2000,
  });

  return {
    tasks,
  };
};

export default useTasks;
