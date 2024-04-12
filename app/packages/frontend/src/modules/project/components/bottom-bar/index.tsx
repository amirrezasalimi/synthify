import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import { useState } from "react";
import useRun from "../../hooks/run";
import useFlows from "../../hooks/flows";

const ButtomBar = () => {
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
      <div className="absolute bottom-4 w-full flex justify-center">
        <div className="bg-white w-1/6 rounded-xl px-4 py-2 z-10 border shadow-sm flex gap-4 justify-center items-center">
          <Button color="primary" onClick={() => setModalOpen(true)}>
            Run
          </Button>
          <Button onClick={flows.addEmptyFlow}>Add Flow</Button>
        </div>
      </div>
    </>
  );
};

export default ButtomBar;
