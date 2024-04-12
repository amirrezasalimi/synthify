import { Button } from "@nextui-org/react";
import { TbChevronLeft } from "react-icons/tb";
import { useCommonStore } from "../../stores/common";
import Avatar from "@/shared/components/avatar";
import { Link } from "react-router-dom";
import { LINKS } from "@/shared/constants";
import useAuth from "@/shared/hooks/auth";
import useProject from "../../hooks/project";

const TopBar = () => {
  const { toggleConfigModel } = useCommonStore();
  const { user } = useAuth();
  const project = useProject();

  return (
    <>
      <div className="w-full flex justify-center items-center">
        <div className="w-3/6 flex justify-between items-center bg-white rounded-xl border mt-4 z-40 px-2 py-2">
          <div className="flex gap-2 items-center">
            <Link to={LINKS.DASHBOARD}>
              <Button className="px-2 w-auto" isIconOnly variant="flat">
                <TbChevronLeft size={24} />
              </Button>
            </Link>
          </div>
          <div className="text-lg font-bold">{project.project.data?.title}</div>

          <div className="flex gap-2 items-center">
            <Button
              onClick={() => toggleConfigModel(true)}
              className="px-2 w-auto"
              isIconOnly
              variant="flat"
            >
              Models
            </Button>
            <Link to={LINKS.AUTH}>
              <Avatar name={user.email} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopBar;
