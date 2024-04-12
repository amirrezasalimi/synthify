import { createContext, useContext } from "react";
import useCreateProjectStore from "./project";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const ProjectContext = createContext<typeof useCreateProjectStore>(null);

export const useProjectStore = () => {
  return useContext(ProjectContext);
};
