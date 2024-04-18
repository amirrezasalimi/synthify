import { createContext, useContext } from "react";
import { ProjectStoreReturnType } from "./project";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const ProjectContext = createContext<ProjectStoreReturnType>(
  {} as ProjectStoreReturnType
);

export const useProjectStore = () => {
  return useContext(ProjectContext);
};
