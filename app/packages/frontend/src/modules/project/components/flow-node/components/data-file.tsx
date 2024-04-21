import useProject from "@/modules/project/hooks/project";
import { trpc } from "@/shared/utils/trpc";
import { Button, Spinner } from "@nextui-org/react";
import { useLayoutEffect, useRef } from "react";
import { TbPlus } from "react-icons/tb";

interface Props {
  type: "json" | "text" | "parquet";
  block_data_id: string;
  onChangeDataId: (block_data_id: string | null) => void;
}

function getBase64(file: File): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

const DataFile = ({ onChangeDataId, block_data_id }: Props) => {
  const project = useProject();
  const fileRef = useRef<HTMLInputElement>(null);

  const currentData = trpc.project.getBlockFile.useMutation();
  useLayoutEffect(() => {
    if (!block_data_id || block_data_id == "") return;
    console.log({ block_data_id });

    currentData.mutate(block_data_id);
  }, [block_data_id]);
  const addFile = trpc.project.add_block_file.useMutation();

  const allowedTypes = [
    "application/json",
    "text/plain",
    "application/x-parquet",
  ];

  const onChange = async (file: File) => {
    // convert to base64
    const base64 = await getBase64(file);
    if (!base64) return;
    console.log({ base64 });

    // add to project
    const res = await addFile.mutateAsync({
      projectId: project.id,
      file_base64: base64,
      file_name: file.name,
    });
    // update block data id
    onChangeDataId(res.id);
  };

  return (
    <div className="flex flex-col items-center gap-2 border rounded-md p-4 border-background-600">
      <input
        hidden
        type="file"
        ref={fileRef}
        accept={allowedTypes.join(",")}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          onChange(file);
        }}
      />
      {currentData.isLoading && <Spinner />}
      <span>
        {currentData.data ? currentData.data.file : "No file selected"}
      </span>
      <Button
        onClick={() => {
          fileRef.current?.click();
        }}
        isLoading={addFile.isLoading}
      >
        <TbPlus />
        {currentData.data ? "Replace file" : "Add file"}
      </Button>
    </div>
  );
};

export default DataFile;
