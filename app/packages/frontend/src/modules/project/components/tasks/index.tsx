import { Spinner } from "@nextui-org/react";
import {
  TasksRecord,
  TasksStatusOptions,
} from "@synthify/backend/src/types/pocketbase";
import useTasks from "../../hooks/tasks";

const Item = ({
  task,
}: {
  task: TasksRecord & {
    done_count: number;
  };
}) => {
  const statusMap = {
    "in-progress": "In Progress",
    done: "Done",
    error: "Error",
  };
  return (
    <div className="flex justify-between p-2 border rounded-lg">
      <div className="flex flex-col gap-1">
        <h2>{task.title}</h2>
        <span>
          {task.done_count}/{task.count}
        </span>
      </div>
      <span>{statusMap?.[task.status as TasksStatusOptions] ?? "Unknown"}</span>
    </div>
  );
};
const Tasks = () => {
  const helper = useTasks();

  return (
    <div className="absolute w-1/6 h-[80vh] m-8 flex flex-col rounded-xl border bg-white z-50">
      <h2 className="font-bold p-4">Datasets</h2>
      <div className="flex flex-col gap-2 overflow-scroll px-3">
        {helper.tasks.isLoading && <Spinner />}
        {helper.tasks.data?.map((task: any, i: number) => (
          <Item key={i} task={task} />
        ))}
      </div>
    </div>
  );
};

export default Tasks;
