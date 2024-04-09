import { Spinner } from "@nextui-org/react";
import {
  TasksRecord,
  TasksStatusOptions,
} from "../../../../../../backend/src/types/pocketbase";
import useTasks from "../../hooks/tasks";

const Item = ({ task }: { task: TasksRecord }) => {
  const statusMap = {
    "in-progress": "In Progress",
    done: "Done",
    error: "Error",
  };
  return (
    <div className="flex justify-between p-2 border rounded-lg">
      <div className="flex flex-col gap-1">
        <h2>{task.title}</h2>
        <span>{task.count}</span>
      </div>
      <span>{statusMap?.[task.status as TasksStatusOptions] ?? "Unknown"}</span>
    </div>
  );
};
const Tasks = () => {
  const helper = useTasks();

  return (
    <div className="absolute w-1/6 h-[80vh] m-8 flex flex-col rounded-xl border bg-white p-4 z-50">
      <h2 className="font-bold">Datasets</h2>
      <div className="flex flex-col mt-4  gap-2">
        {helper.tasks.isLoading && <Spinner />}
        {helper.tasks.data?.map((task) => (
          <Item task={task} />
        ))}
      </div>
    </div>
  );
};

export default Tasks;
