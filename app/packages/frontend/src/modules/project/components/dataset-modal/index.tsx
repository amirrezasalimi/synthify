import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";
import useProject from "../../hooks/project";
import { useCommonStore } from "../../stores/common";
import { trpc, trpcApi } from "@/shared/utils/trpc";
import { useInfiniteQuery } from "@tanstack/react-query";
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
  return (
    <Modal
      size="2xl"
      isOpen={isDatasetModalOpen}
      onClose={() => toggleDatasetModal(false, "")}
    >
      <ModalContent>
        <ModalHeader>Dataset {task.data?.title}</ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-2 py-4">
            {datas.isLoading && <Spinner />}
            {!datas.isLoading && (
              <>
                <div className="py-1 flex items-center justify-between gap-2">
                  <span>count: {firstPage.data?.totalItems ?? 0}</span>
                  <Button
                    color="primary"
                    isLoading={datas.isFetching}
                    onClick={downloadDataset}
                    size="md"
                    className="ml-2"
                  >
                    Download
                  </Button>
                </div>
                <div className="flex flex-col gap-2 max-h-[70vh] overflow-scroll px-4">
                  {datas.data?.pages.map((page) => {
                    return (
                      <div className="flex flex-col gap-2">
                        {page.items.map((item) => {
                          return (
                            <div
                              key={item.id}
                              className="w-full p-4 border rounded-lg max-h-[30vh] overflow-scroll"
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
              </>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default DatasetModal;
