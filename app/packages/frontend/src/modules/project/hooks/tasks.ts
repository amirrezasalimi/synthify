import { trpc } from "@/shared/utils/trpc";
import useProject from "./project";

const useTasks = () => {
  const project = useProject();
  const tasks = trpc.project.tasksList.useQuery(
    {
      project: project.id,
    },
    {
      refetchInterval: 2500,
    }
  );

  return {
    tasks,
  };
};

export default useTasks;
