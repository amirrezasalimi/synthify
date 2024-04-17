import { Button } from "@nextui-org/react";
import { useCommonStore } from "../../stores/common";
import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import { useState } from "react";
import useRun from "../../hooks/run";
import useFlows from "../../hooks/flows";
import { TbPlus } from "react-icons/tb";

const TopToolBar = () => {
  const { toggleConfigModel } = useCommonStore();
  const flows = useFlows();
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [dataCount, setDataCount] = useState(1);
  const helper = useRun();

  return (
    <>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <ModalContent>
          <ModalHeader>Run Task</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-2">
              <Input
                variant="bordered"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Input
                variant="bordered"
                placeholder="Data Count"
                type="number"
                value={String(dataCount)}
                onChange={(e) => setDataCount(Number(e.target.value))}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                className="w-auto"
                isLoading={helper.isLoading}
                color="primary"
                onClick={() => {
                  helper.run(title, dataCount).then(() => {
                    setModalOpen(false);
                  });
                }}
              >
                Run
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <div className="w-full h-full flex justify-between items-center">
        <div>
          <Button variant="bordered" onClick={flows.addEmptyFlow} size="sm">
            <TbPlus size={16} />
            Add Flow
          </Button>
        </div>
        <div className="flex gap-3">
          <Button
            size="sm"
            variant="bordered"
            onClick={() => toggleConfigModel(true)}
            className="px-2 w-auto"
          >
            Models
          </Button>
          <Button size="sm" color="primary" onClick={() => setModalOpen(true)}>
            Run
          </Button>
        </div>
      </div>
    </>
  );
};

export default TopToolBar;
