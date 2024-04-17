import { Button } from "@nextui-org/react";
import { TbChevronLeft } from "react-icons/tb";
import { useCommonStore } from "../../stores/common";
import Avatar from "@/shared/components/avatar";
import { Link } from "react-router-dom";
import { LINKS } from "@/shared/constants";
import useAuth from "@/shared/hooks/auth";
import useProject from "../../hooks/project";

const TopBar = () => {
  const { user } = useAuth();
  const project = useProject();

  return (
    <>
      <div className="w-full h-full flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <Link to={LINKS.DASHBOARD}>
            <Button className="px-2 w-auto" isIconOnly variant="flat">
              <TbChevronLeft size={24} />
            </Button>
          </Link>
        </div>
        <div className="text-lg font-bold">{project.project.data?.title}</div>
        <div className="flex gap-2 items-center">
          <Link to={LINKS.AUTH}>
            <Avatar name={user.email} />
          </Link>
        </div>
      </div>
    </>
  );
};

export default TopBar;
