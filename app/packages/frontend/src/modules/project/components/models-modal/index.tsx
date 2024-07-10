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
  const [serviceName, setServiceName] = useState("");
  const [serviceEndpoint, setServiceEndpoint] = useState("");
  const [serviceApiKey, setServiceApiKey] = useState("");
  const addService = trpc.project.add_ai_service.useMutation();

  const utils = trpc.useUtils();

  const addNewService = async () => {
    addService
      .mutateAsync({
        name: serviceName,
        endpoint: serviceEndpoint,
        apikey: serviceApiKey,
      })
      .then(() => {
        utils.project.list_ai_services.refetch();
        // clear
        setServiceName("");
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
          title="Add ai service"
        >
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              Add ai service
            </ModalHeader>
            <ModalBody>
              <Input
                variant="bordered"
                placeholder="Open Router"
                label="Name"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
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
          <ModalHeader>Config Ai's</ModalHeader>
          <ModalBody>
            {/* ai's */}
            {services.isLoading && <Spinner />}
            {!services.isLoading && services.data?.length === 0 && (
              <div className="flex justify-center items-center h-32">
                <h3 className="text-gray-500 text-lg">No ai services found</h3>
              </div>
            )}
            {services.data?.map((service) => (
              <Card
                key={service.id}
                className="border border-background-600"
                shadow="none"
                radius="sm"
              >
                <CardBody className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <div className="flex flex-col gap-2">
                      <h2 className="font-bold tetx-md">{service.title}</h2>
                      <span>{service.endpoint}</span>
                    </div>
                    <div>
                      <TbTrash
                        className="hover:text-red-500 cursor-pointer"
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
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">
                        models({service?.models?.length ?? 0})
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
                    <div className="flex flex-col gap-1 py-2 max-h-[20vh] overflow-y-scroll">
                      {(service?.models ?? []).map((model) => (
                        <div key={model.id} className="flex items-center gap-2">
                          <div>
                            <h4 className="text-sm">
                              {model?.name || model?.id || `unknown`}
                            </h4>
                          </div>
                          <div>
                            <TbPlus
                              className="hover:text-red-500 cursor-pointer rotate-45"
                              size={16}
                              onClick={() => {
                                if (removeModel.isLoading) return;
                                removeModel
                                  .mutateAsync({
                                    service_id: service.id,
                                    model_id: model.id,
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
                    <div className="flex items-center gap-2 mt-4">
                      <Input
                        variant="bordered"
                        placeholder="cohere/command-r-plus"
                        label="Model Name"
                        size="sm"
                        value={modelName}
                        onChange={(e) => setModelName(e.target.value)}
                      />
                      <Button
                        isIconOnly
                        size="lg"
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
                        <TbPlus size={16} />
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              className="my-2"
              onClick={() => setAddModalOpen(true)}
            >
              Add New
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModelsModal;
