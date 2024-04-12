import Avatar from "@/shared/components/avatar";
import { LINKS } from "@/shared/constants";
import useAuth from "@/shared/hooks/auth";
import makeUrl from "@/shared/utils/make-url";
import { trpc } from "@/shared/utils/trpc";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const projects = trpc.project.projectsList.useQuery();

  const addProject = trpc.project.createProject.useMutation();
  const [addProjectModalOpen, setAddProjectModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");

  const nav = useNavigate();
  const create = () => {
    addProject.mutateAsync({ title: projectName }).then((id) => {
      setAddProjectModalOpen(false);
      nav(makeUrl(LINKS.PROJECT, { id }));
    });
  };
  return (
    <>
      <Modal
        isOpen={addProjectModalOpen}
        onClose={() => setAddProjectModalOpen(false)}
      >
        <ModalContent>
          <ModalHeader>Add Project</ModalHeader>
          <ModalBody>
            <Input
              placeholder="Project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={addProject.isLoading}
              onClick={create}
              variant="solid"
              color="primary"
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div className="w-screen h-screen bg-gray-100">
        <div className="container mx-auto max-w-2xl flex flex-col">
          <div className="flex justify-between items-center py-8">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
            <Link to={LINKS.AUTH}>
              <Avatar name={user.email} />
            </Link>
          </div>
          <div className="py-4">
            <Button
              color="primary"
              onClick={() => setAddProjectModalOpen(true)}
            >
              Add project
            </Button>
          </div>
          <div className="w-full flex flex-col gap-2">
            {projects.isLoading && (
              <div className="flex justify-center items-center h-32">
                <Spinner />
              </div>
            )}
            {!projects.isLoading && projects.data?.length === 0 && (
              <div className="flex justify-center items-center h-32">
                <h3 className="text-lg text-gray-500">No projects found</h3>
              </div>
            )}
            {projects.data?.map((p, i) => (
              <Link
                key={i}
                to={makeUrl(LINKS.PROJECT, {
                  id: p.id,
                })}
              >
                <div className=" bg-white shadow-lg rounded-xl p-4 min-h-12 flex justify-between items-center">
                  <h3 className="text-lg font-bold">{p.title}</h3>
                  <Button variant="bordered">Go to project</Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
