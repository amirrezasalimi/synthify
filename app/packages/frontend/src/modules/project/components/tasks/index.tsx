import { Spinner, cn } from "@nextui-org/react";
import {
  TasksRecord,
  TasksStatusOptions,
} from "@synthify/backend/src/types/pocketbase";
import useTasks from "../../hooks/tasks";
import { useCommonStore } from "../../stores/common";

const Item = ({
  task,
}: {
  task: TasksRecord & {
    done_count: number;
  };
}) => {
  const statusColors = {
    ["in-progress"]: "bg-warning-800",
    done: "bg-success-800",
    error: "bg-error-800",
  };

  const title = task.title == "" ? "untitled" : task.title;
  return (
    <div className="flex justify-between p-2  rounded-lg bg-background-700/70 items-center">
      <div className="flex flex-col gap-1">
        <h2>{title}</h2>
        <span>
          {task.done_count}/{task.count}
        </span>
      </div>
      <span
        className={cn(
          "rounded-full w-3 h-3",
          statusColors[task.status as TasksStatusOptions]
        )}
      />
    </div>
  );
};
const Tasks = () => {
  const helper = useTasks();
  const { toggleDatasetModal } = useCommonStore();

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="px-4 flex items-center h-12 min-h-12 max-h-12  border-b border-b-background-700">
        <h2 className="font-bold">Datasets</h2>
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto px-3 py-4 h-[calc(100vh-(3rem+4rem))]">
        {helper.tasks.isLoading && <Spinner />}
        {helper.tasks.data?.map((task: any, i: number) => (
          <div
            key={i}
            onClick={() => {
              toggleDatasetModal(true, task.id);
            }}
          >
            <Item task={task} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
