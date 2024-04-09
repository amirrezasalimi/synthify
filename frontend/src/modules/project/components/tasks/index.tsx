import { Spinner } from "@nextui-org/react";
import { TasksRecord } from "../../../../../../backend/src/types/pocketbase";
import useTasks from "../../hooks/tasks";

const Item = ({ task }: { task: TasksRecord }) => {
  return <div>
    <h2>
      {task.title}
    </h2>
  </div>;
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
