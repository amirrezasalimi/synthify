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

const RunTask = () => {
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
      <Button
        color="primary"
        className="absolute bottom-6 right-6 z-10"
        onClick={() => setModalOpen(true)}
      >
        Run
      </Button>
    </>
  );
};

export default RunTask;
