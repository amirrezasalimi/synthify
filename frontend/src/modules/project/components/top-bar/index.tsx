import { Button } from "@nextui-org/react";
import { useState } from "react";
import { TbChevronLeft } from "react-icons/tb";
import ModelsModal from "../models-modal";

const TopBar = () => {
  const [isModelsModalOpen, setIsModelsModalOpen] = useState(false);
  // top center
  return (
    <>
      <ModelsModal
        isOpen={isModelsModalOpen}
        onClose={() => setIsModelsModalOpen(false)}
      />
      <div className="w-full flex justify-center items-center">
        <div className="w-3/6 flex justify-between items-center bg-white rounded-xl border mt-4 z-40 px-2 py-2">
          <div className="flex gap-2 items-center">
            <Button className="px-2 w-auto" isIconOnly variant="flat">
              <TbChevronLeft size={24} />
            </Button>
          </div>
          <div className="text-lg font-bold">Project</div>

          <div>
            <Button
              onClick={() => setIsModelsModalOpen(true)}
              className="px-2 w-auto"
              isIconOnly
              variant="flat"
            >
              Models
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopBar;
