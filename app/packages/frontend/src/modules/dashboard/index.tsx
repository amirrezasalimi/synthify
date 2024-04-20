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
  cn,
} from "@nextui-org/react";
import {
  PresetsRecord,
  PresetsResponse,
} from "@synthify/backend/src/types/pocketbase";
import { useState } from "react";
import toast from "react-hot-toast";
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
      let params = "";
      if (selectedPresetId) {
        params = `?preset=${selectedPresetId}`;
      }
      nav(`${makeUrl(LINKS.PROJECT, { id })}${params}`);
    });
  };
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  const presets = trpc.project.presets.useQuery();

  const groupBycategory = (
    presets: Partial<PresetsResponse<unknown, unknown>>[]
  ) => {
    const categories: Record<
      string,
      Partial<PresetsResponse<unknown, unknown>>[]
    > = {};
    presets.forEach((p) => {
      const cat = p.category ?? "Uncategorized";
      if (!categories[cat]) {
        categories[cat] = [];
      }
      categories[cat].push(p);
    });
    return categories;
  };
  const categories = groupBycategory(presets.data ?? []) as Record<
    string,
    PresetsResponse[]
  >;

  return (
    <>
      <Modal
        size="lg"
        isOpen={addProjectModalOpen}
        onClose={() => setAddProjectModalOpen(false)}
      >
        <ModalContent>
          <ModalHeader>Add Project</ModalHeader>
          <ModalBody>
            <h2 className="font-bold">Presets</h2>
            <div className="flex gap-3">
              {Object.entries(categories).map(([cat, presets]) => (
                <div
                  key={cat}
                  className="border border-background-700 p-3 rounded-md py-4 w-1/2"
                >
                  <h3 className="font-bold pb-2">{cat}</h3>
                  <div className="flex gap-3 flex-wrap">
                    {presets.map((p) => {
                      const data = p?.data || {};
                      const hasData = Object.keys(data).length > 0;

                      return (
                        <div
                          key={p.id}
                          className={cn(
                            "w-full bg-background-800 p-2 rounded-xl cursor-pointer border border-background-600",
                            selectedPresetId === p.id && " border-cyan-700",
                            !hasData && "opacity-50"
                          )}
                          onClick={() => {
                            if (!hasData) return toast("coming soon");
                            setSelectedPresetId(p.id);
                          }}
                        >
                          {p.title}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
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
      <div className="w-screen h-screen">
        <div className="container mx-auto max-w-2xl flex flex-col">
          <div className="flex justify-between items-center py-8">
            <h2 className="text-2xl font-bold ">Dashboard</h2>
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
                <div className="bg-background-800 shadow-lg rounded-xl p-4 min-h-12 flex justify-between items-center">
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
