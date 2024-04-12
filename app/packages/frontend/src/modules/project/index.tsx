import { useRef } from "react";
import ReactFlowWrapper from "./components/react-flow-wrapper";
import { ProjectContext } from "./stores/project-context";
import useCreateProjectStore from "./stores/project";
import useInitial from "./hooks/initial";
import { CircularProgress } from "@nextui-org/react";
import TopBar from "./components/top-bar";
import Tasks from "./components/tasks";
import ModelsModal from "./components/models-modal";
import ChooseModelModal from "./components/choose-model-modal";
import ButtomBar from "./components/bottom-bar";

const ProjectInside = () => {
  const { isConnected } = useInitial();
  if (!isConnected) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }
  return (
    <div className="w-screen h-screen">
      <ChooseModelModal />
      <ModelsModal/>
       {/* top bar */}
      {/* tasks (datas) */}
      {/* flow */}
      <ReactFlowWrapper>
        <Tasks/>
        <TopBar />
        <ButtomBar />
      </ReactFlowWrapper>
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
