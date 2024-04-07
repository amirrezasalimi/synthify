import { useRef } from "react";
import Flows from "./components/flows";
import { ProjectContext } from "./stores/project-context";
import useCreateProjectStore from "./stores/project";
import useInitial from "./hooks/initial";

const ProjectInside = () => {
  useInitial();
  return (
    <div className="w-screen h-screen">
      {/* tasks (datas) */}
      {/* flow */}
      <Flows />
    </div>
  );
};
const Project = () => {
  const store = useRef(useCreateProjectStore);
  return (
    <ProjectContext.Provider value={store.current}>
      <ProjectInside />
    </ProjectContext.Provider>
  );
};
export default Project;
