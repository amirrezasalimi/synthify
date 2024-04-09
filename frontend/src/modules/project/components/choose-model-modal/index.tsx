import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Spinner,
} from "@nextui-org/react";
import { useCommonStore } from "../../stores/common";
import { trpc } from "@/shared/utils/trpc";
import { useState } from "react";

const ChooseModelModal = () => {
  const { isChooseModelModalOpen, toggleChooseModelModal, onChooseModel } =
    useCommonStore();
  const services = trpc.list_ai_services.useQuery();
  const [modelFilter, setModelFilter] = useState("");
  const [selectedModel, setSelectedModel] = useState<{
    service_id: string;
    model_id: string;
  } | null>(null);

  const save = () => {
    onChooseModel?.(
      selectedModel?.service_id ?? "",
      selectedModel?.model_id ?? ""
    );
    toggleChooseModelModal(false);
  };

  return (
    <Modal
      isOpen={isChooseModelModalOpen}
      onClose={() => toggleChooseModelModal(false)}
      title="Choose Model"
    >
      <ModalContent>
        <ModalHeader>Choose Model</ModalHeader>
        <ModalBody className="overflow-scroll max-h-[70vh]">
          <div className="w-full flex flex-co">
            {services.isLoading && <Spinner />}
            <RadioGroup
              className="w-full "
              value={`${selectedModel?.service_id}@${selectedModel?.model_id}`}
              onValueChange={(value) => {
                const [service_id, model_id] = value.split("@");
                setSelectedModel({ service_id, model_id });
              }}
              label="Select Model"
            >
              <Input
                placeholder="Search model"
                value={modelFilter}
                onChange={(e) => setModelFilter(e.target.value)}
              />

              {services.data?.map((service) => (
                <div className="w-full flex flex-col gap-2">
                  <h2 className="font-bold sticky bg-white top-0 z-20">
                    {service.title}
                  </h2>

                  <div className="w-full flex flex-col gap-2">
                    {((service.models as string[]) ?? [])
                      .filter((model) =>
                        model.toLowerCase().includes(modelFilter.toLowerCase())
                      )
                      ?.map((model) => (
                        <Radio
                          className="w-fu"
                          value={`${service.id}@${model}`}
                          key={model}
                        >
                          {model}
                        </Radio>
                      ))}
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        </ModalBody>
        <ModalFooter className="sticky bottom-0 bg-white">
          <button onClick={save}>Save</button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChooseModelModal;
