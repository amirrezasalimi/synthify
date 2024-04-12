import { trpc } from "@/shared/utils/trpc";
import { useParams } from "react-router-dom";

const useProject = () => {
  const params = useParams();
  const id = params.id as string;
  const project = trpc.project.getProject.useQuery(id, {
    staleTime: Infinity,
    cacheTime: Infinity,
    retry: 0,
  });
  return {
    id,
    project,
  };
};

export default useProject;
