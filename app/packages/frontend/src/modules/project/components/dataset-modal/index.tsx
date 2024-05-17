import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  Tab,
  Tabs,
  cn,
} from "@nextui-org/react";
import useProject from "../../hooks/project";
import { useCommonStore } from "../../stores/common";
import { trpc, trpcApi } from "@/shared/utils/trpc";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useReactFlow } from "reactflow";
const DatasetModal = () => {
  const { datasetModalTaskId, isDatasetModalOpen, toggleDatasetModal } =
    useCommonStore();
  const project = useProject();
  const task = trpc.project.getTask.useQuery(datasetModalTaskId as string, {
    enabled: isDatasetModalOpen,
  });

  const firstPage = trpc.project.datasetItems.useQuery(
    {
      task: datasetModalTaskId as string,
      page: 1,
      project: project.id,
    },
    {
      enabled: isDatasetModalOpen,
    }
  );
  const datas = useInfiniteQuery(
    ["datas", datasetModalTaskId],
    async ({ pageParam = 1 }) => {
      return await trpcApi.project.datasetItems.query({
        task: datasetModalTaskId as string,
        page: pageParam,
        project: project.id,
      });
    },
    {
      enabled: isDatasetModalOpen,
    }
  );

  const download = trpc.project.downloadDataset.useMutation();
  const downloadDataset = async () => {
    download
      .mutateAsync({
        task: datasetModalTaskId as string,
        project: project.id,
      })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "dataset.jsonl");
        document.body.appendChild(link);
        link.click();
      });
  };

  const [logsPage, setLogsPage] = useState(1);
  const logs = trpc.project.getTaskLogs.useQuery(
    {
      id: datasetModalTaskId as string,
      page: logsPage,
    },
    {
      enabled: isDatasetModalOpen,
    }
  );
  useEffect(() => {
    return () => {
      setLogsPage(1);
    };
  }, []);

  const rf = useReactFlow();
  const goToBlock = (flowId: string, blockId: string) => {
    toggleDatasetModal(false, "");
    rf.fitView({
      nodes: [{ id: flowId }],
      duration: 500,
      maxZoom: 1,
    });
  };
  return (
    <Modal
      size="2xl"
      isOpen={isDatasetModalOpen}
      onClose={() => toggleDatasetModal(false, "")}
    >
      <ModalContent>
        <ModalHeader>Dataset {task.data?.title}</ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-2 py-4 h-[70vh] overflow-hidden">
            {datas.isLoading && <Spinner />}
            {!datas.isLoading && (
              <>
                <div className="relative">
                  <Button
                    color="primary"
                    isLoading={datas.isFetching}
                    onClick={downloadDataset}
                    size="md"
                    className="ml-2 absolute top-0 right-0 z-10"
                  >
                    Download
                  </Button>
                  <Tabs aria-label="Options">
                    <Tab
                      key="Datas"
                      title={`Datas (${firstPage.data?.totalItems ?? 0})`}
                    >
                      <Card className="w-full max-h-[60vh] overflow-y-auto">
                        <CardBody>
                          <div className="flex flex-col gap-2 h-full overflow-y-auto">
                            {datas.data?.pages.map((page) => {
                              return (
                                <div className="flex flex-col gap-2 divide-y">
                                  {page.items.map((item) => {
                                    return (
                                      <div
                                        key={item.id}
                                        className="w-full p-4 max-h-[30vh] overflow-y-auto"
                                      >
                                        <pre className="whitespace-break-spaces w-full h-full">
                                          {JSON.stringify(item.data, null, 2)}
                                        </pre>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })}
                          </div>
                        </CardBody>
                      </Card>
                    </Tab>
                    <Tab key="Logs" title={`Logs`}>
                      <Card className="w-full max-h-[60vh] h-full overflow-y-auto">
                        <CardBody>
                          <div className="flex flex-col gap-2 h-full">
                            {logs.data?.totalItems === 0 && (
                              <div className="w-full flex gap-2 justify-center p-4 max-h-[30vh] overflow-y-auto">
                                No logs
                              </div>
                            )}
                            {logs.isFetching && (
                              <div className="w-full flex justify-center gap-2 p-4 max-h-[30vh] overflow-y-auto">
                                <Spinner />
                              </div>
                            )}
                            {logs.data?.items.map((log) => {
                              return (
                                <div
                                  key={log.id}
                                  className="w-full flex gap-4 items-center p-2 h-full max-h-[30vh] overflow-hidden"
                                >
                                  <span
                                    className={cn(
                                      "text-xs font-bold rounded-lg px-2 py-1 w-32 bg-white/10 text-center",
                                      log.type === "debug" &&
                                        "bg-blue-100 text-blue-800",
                                      log.type === "info" &&
                                        "bg-green-100 text-green-800",
                                      log.type === "error" &&
                                        "bg-red-100 text-red-800"
                                    )}
                                  >
                                    {log.type}
                                  </span>
                                  <pre className="whitespace-break-spaces flex items-center justify-between w-full h-full text-sm relative">
                                    {log.message}
                                    {(log.meta as unknown as any)?.blockId !==
                                      undefined && (
                                      <Button
                                        color="default"
                                        size="sm"
                                        onClick={() => {
                                          goToBlock(
                                            (log.meta as unknown as any).flowId,
                                            (log.meta as unknown as any).blockId
                                          );
                                        }}
                                      >
                                        Go to block
                                      </Button>
                                    )}
                                  </pre>
                                </div>
                              );
                            })}
                          </div>
                        </CardBody>
                      </Card>
                    </Tab>
                  </Tabs>
                </div>
              </>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default DatasetModal;
