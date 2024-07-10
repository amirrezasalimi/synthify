import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Radio,
  RadioGroup,
  Spinner,
} from "@nextui-org/react";
import { useCommonStore } from "../../stores/common";
import { trpc } from "@/shared/utils/trpc";
import { useState } from "react";

const ChooseModelModal = () => {
  const {
    isChooseModelModalOpen,
    toggleChooseModelModal,
    onChooseModel,
    toggleConfigModel,
  } = useCommonStore();
  const services = trpc.project.list_ai_services.useQuery();
  const [modelFilter, setModelFilter] = useState("");

  const selectedModel = {
    service_id: "",
    model_id: "",
  };
  return (
    <Modal
      isOpen={isChooseModelModalOpen}
      onClose={() => toggleChooseModelModal(false)}
      title="Choose Model"
    >
      <ModalContent>
        <ModalHeader>Choose Model</ModalHeader>
        <ModalBody className="max-h-[70vh] overflow-scroll">
          <div className="flex flex-co w-full">
            {services.isLoading && <Spinner />}
            <RadioGroup
              className="w-full"
              value={`${selectedModel?.service_id}@${selectedModel?.model_id}`}
              onValueChange={(value) => {
                const [service_id, model_id] = value.split("@");
                onChooseModel?.(service_id ?? "", model_id ?? "");
                toggleChooseModelModal(false);
              }}
            >
              {!services.isLoading && !!services.data?.length && (
                <Input
                  placeholder="Search model"
                  value={modelFilter}
                  onChange={(e) => setModelFilter(e.target.value)}
                />
              )}

              {!services.isLoading && services.data?.length === 0 && (
                <div className="flex flex-col justify-center items-center gap-4 py-4 w-full">
                  <span>No AI's found</span>
                  <Button
                    onClick={() => {
                      toggleConfigModel(true);
                    }}
                  >
                    Add New
                  </Button>
                </div>
              )}

              {services.data?.map((service) => (
                <div className="flex flex-col gap-2 w-full">
                  <h2 className="top-[-8px] z-20 sticky bg-background-800 py-2 font-bold">
                    {service.title}
                  </h2>

                  <div className="flex flex-col gap-2 w-full">
                    {(service.models ?? [])
                      .filter((model) =>
                        (model?.name || model?.id)
                          ?.toLowerCase()
                          .includes(modelFilter.toLowerCase())
                      )
                      ?.map((model) => (
                        <Radio
                          className="w-full"
                          value={`${service.id}@${model.id}`}
                          key={model.id}
                          classNames={{
                            base: "flex !max-w-full",
                          }}
                        >
                          {model?.name || model?.id || "unknown"}
                        </Radio>
                      ))}
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ChooseModelModal;
