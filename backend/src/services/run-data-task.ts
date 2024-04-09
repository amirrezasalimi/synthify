import { FlowNode } from "@/modules/project/types/flow-data";
import { pb } from "../libs/pb";
import { TasksRecord } from "../types/pocketbase";

const runDataTask = ({
  count,
  title,
  flows,
}: {
  count: number;
  title: string;
  flows: FlowNode[];
}) => {
  pb.collection("tasks").create({
    count,
    title,
    flows,
    status: "running",
    // user: "1",
  } as TasksRecord);
};

export default runDataTask;
