import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/auth";
import { useEffect } from "react";
import { LINKS } from "../constants";
import { CircularProgress } from "@nextui-org/react";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { status, isLogin } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (status == "success" && !isLogin) {
      nav(LINKS.AUTH);
    }
  }, [status, isLogin]);
  return (
    <>
      {status == "loading" && (
        <div className="flex justify-center items-center h-screen">
          <CircularProgress size="lg" />
        </div>
      )}
      {status == "success" && isLogin && <>{children}</>}
    </>
  );
};

export default ProtectedLayout;
