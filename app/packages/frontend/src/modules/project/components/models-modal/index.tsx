import { trpc } from "@/shared/utils/trpc";
import {
  Button,
  Card,
  CardBody,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  cn,
} from "@nextui-org/react";
import { useLayoutEffect, useState } from "react";
import toast from "react-hot-toast";
import { TbPlus, TbReload, TbTrash } from "react-icons/tb";
import { useCommonStore } from "../../stores/common";

const ModelsModal = () => {
  const { isConfigModelOpen, toggleConfigModel } = useCommonStore();
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [modelName, setModelName] = useState<string>("");
  const [serviceTitle, setServiceTitle] = useState("");
  const [serviceEndpoint, setServiceEndpoint] = useState("");
  const [serviceApiKey, setServiceApiKey] = useState("");
  const addService = trpc.project.add_ai_service.useMutation();
  const addNewService = async () => {
    addService
      .mutateAsync({
        title: serviceTitle,
        endpoint: serviceEndpoint,
        apikey: serviceApiKey,
      })
      .then(() => {
        // clear
        setServiceTitle("");
        setServiceEndpoint("");
        setServiceApiKey("");

        setAddModalOpen(false);
        toast.success("Service added successfully");
      });
  };
  const removeService = trpc.project.remove_ai_service.useMutation();
  const addModel = trpc.project.add_service_model.useMutation();
  const refreshModels = trpc.project.refresh_service_models.useMutation();
  const removeModel = trpc.project.remove_service_model.useMutation();

  const services = trpc.project.list_ai_services.useQuery();
  useLayoutEffect(() => {
    if (isConfigModelOpen) services.refetch();
  }, [isConfigModelOpen]);

  const [showMoreModels, setShowMoreModels] = useState<{
    [key: string]: boolean;
  }>({});

  return (
    <>
      <Modal
        isOpen={isConfigModelOpen}
        onClose={() => toggleConfigModel(false)}
        title="Config Ai's"
      >
        {/* add modal */}
        <Modal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          title="Add Model"
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">Add Model</ModalHeader>
            <ModalBody>
              <Input
                variant="bordered"
                placeholder="Open Router"
                label="Name"
                value={serviceTitle}
                onChange={(e) => setServiceTitle(e.target.value)}
              />
              <Input
                variant="bordered"
                placeholder="https://openrouter.ai/api/v1"
                label="Endpoint"
                value={serviceEndpoint}
                onChange={(e) => setServiceEndpoint(e.target.value)}
              />
              <Input
                variant="bordered"
                placeholder="sk-123456"
                label="API Key"
                value={serviceApiKey}
                onChange={(e) => setServiceApiKey(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                isLoading={addService.isLoading}
                onClick={addNewService}
                className="w-full"
                variant="solid"
                color="primary"
              >
                Add
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <ModalContent className="max-h-[80vh] overflow-auto">
          <ModalHeader className="flex flex-col gap-1 sticky top-0 bg-white z-10">
            Config Ai's
            <Button onClick={() => setAddModalOpen(true)}>Add New</Button>
          </ModalHeader>
          <ModalBody className="">
            {/* ai's */}
            {services.isLoading && <Spinner />}
            {services.data?.map((service) => (
              <Card
                key={service.id}
                className="border bg-gray-50"
                shadow="none"
                radius="sm"
              >
                <CardBody className="flex flex-col gap-2">
                  <div className="flex  justify-between">
                    <div className="flex flex-col gap-2">
                      <h2 className="font-bold tetx-md">{service.title}</h2>
                      <span>{service.endpoint}</span>
                    </div>
                    <div>
                      <TbTrash
                        className="cursor-pointer hover:text-red-500"
                        size={24}
                        onClick={() => {
                          if (removeService.isLoading) return;
                          removeService.mutateAsync(service.id).then(() => {
                            services.refetch();
                            toast.success("Service removed successfully");
                          });
                        }}
                      />
                    </div>
                  </div>
                  <Divider />
                  <div className="flex flex-col">
                    <div className="flex gap-2 items-center">
                      <h3 className="font-medium">
                        models({(service?.models as string)?.length ?? 0})
                      </h3>
                      <TbReload
                        className={cn(
                          "cursor-pointer hover:text-blue-500",
                          refreshModels.isLoading && "animate-spin"
                        )}
                        size={16}
                        onClick={() => {
                          if (refreshModels.isLoading) return;
                          refreshModels.mutateAsync(service.id).then(() => {
                            services.refetch();
                            toast.success("Models refreshed successfully");
                          });
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-1 py-2 max-h-[20vh] overflow-scroll">
                      {((service?.models as string[]) ?? []).map((model) => (
                        <div key={model} className="flex gap-2 items-center">
                          <div>
                            <h4 className="text-sm">{model}</h4>
                          </div>
                          <div>
                            <TbPlus
                              className="cursor-pointer hover:text-red-500 rotate-45"
                              size={16}
                              onClick={() => {
                                if (removeModel.isLoading) return;
                                removeModel
                                  .mutateAsync({
                                    service_id: service.id,
                                    model_id: model,
                                  })
                                  .then(() => {
                                    services.refetch();
                                    toast.success("Model removed successfully");
                                  });
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 items-center mt-4">
                      <Input
                        variant="bordered"
                        placeholder="cohere/command-r-plus"
                        label="Model Name"
                        size="sm"
                        value={modelName}
                        onChange={(e) => setModelName(e.target.value)}
                      />
                      <Button
                        onClick={() => {
                          addModel
                            .mutateAsync({
                              service_id: service.id,
                              model_id: modelName,
                            })
                            .then(() => {
                              setModelName("");
                              services.refetch();
                              toast.success("Model added successfully");
                            });
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModelsModal;
