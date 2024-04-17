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
import DatasetModal from "./components/dataset-modal";
import { Link } from "react-router-dom";
import { LINKS } from "@/shared/constants";
import TopToolBar from "./components/top-tool-bar";

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
    <div className="w-screen h-screen flex">
      <ChooseModelModal />
      <DatasetModal />
      <ModelsModal />
      {/* left */}
      <div className="flex flex-col h-full flex-1 w-2/12  border-r-background-700 border-r min-w-[250px]">
        {/* logo */}
        <div className="w-full h-16 max-h-16 min-h-16 border-b border-b-background-700 flex items-center px-4">
          <Link to={LINKS.DASHBOARD}>
            <img src="/logo-full.svg" alt="logo" />
          </Link>
        </div>
        <Tasks />
      </div>
      {/* right */}
      <div className="w-10/12 flex flex-col justify-between">
        {/* top bar */}

        <div className="w-full border-b border-background-700 h-16 min-h-16 max-h-16 px-4">
          <TopBar />
        </div>
        <div className="flex h-12 min-h-12 px-4 border-b border-b-background-700">
          <TopToolBar />
        </div>

        {/* canvas */}
        <div className="relative w-full h-full">
          <ReactFlowWrapper>{/* <ButtomBar /> */}</ReactFlowWrapper>
        </div>
      </div>
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
