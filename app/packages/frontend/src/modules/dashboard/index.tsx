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
                  className="py-4 p-3 border border-background-700 rounded-md w-1/2"
                >
                  <h3 className="pb-2 font-bold">{cat}</h3>
                  <div className="flex flex-wrap gap-3">
                    {
                      // sort by date
                      presets
                        .sort(
                          (a, b) =>
                            new Date(b.created).getTime() -
                            new Date(a.created).getTime()
                        )
                        .map((p) => {
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
                              {p?.title ?? "Untitled"}
                            </div>
                          );
                        })
                    }
                  </div>
                </div>
              ))}
            </div>
            <Input
              placeholder="Project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  create();
                }
              }}
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
        <div className="flex flex-col mx-auto max-w-2xl container">
          <div className="flex justify-between items-center py-8">
            <h2 className="font-bold text-2xl">Dashboard</h2>
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
          <div className="flex flex-col gap-2 w-full">
            {projects.isLoading && (
              <div className="flex justify-center items-center h-32">
                <Spinner />
              </div>
            )}
            {!projects.isLoading && projects.data?.length === 0 && (
              <div className="flex justify-center items-center h-32">
                <h3 className="text-gray-500 text-lg">No projects found</h3>
              </div>
            )}
            {projects.data?.map((p, i) => (
              <Link
                key={i}
                to={makeUrl(LINKS.PROJECT, {
                  id: p.id,
                })}
              >
                <div className="flex justify-between items-center bg-background-800 shadow-lg p-4 rounded-xl min-h-12">
                  <h3 className="font-bold text-lg">{p.title}</h3>
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
