import { trpc } from "@/shared/utils/trpc";
import { Button, Card, CardBody } from "@nextui-org/react";

const Project = () => {
  const test = trpc.greet.useQuery();
  console.log(test.data);
  
  return (
    <div>
      <h1>Project</h1>
      <Card>
        <CardBody>
          <p>{test.data}</p>
        </CardBody>
      </Card>
      <Button>
        Hi
      </Button>
    </div>
  );
};

export default Project;
