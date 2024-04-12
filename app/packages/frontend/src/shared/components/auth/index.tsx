"use client";
import useAuth from "@/shared/hooks/auth";
import { ReactNode, useState } from "react";
import clsx from "clsx";
import { Avatar, Button, CircularProgress, Input } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import useAuthFlow from "./hooks/auth-flow";
import { Link, useNavigate } from "react-router-dom";
import { trpc } from "@/shared/utils/trpc";
import toast from "react-hot-toast";
import { pb_client } from "@/shared/utils/pb_client";
import { TbArrowLeft, TbChevronRight } from "react-icons/tb";
import { LINKS } from "@/shared/constants";

const ProviderItem = ({
  icon,
  provider,
  loading,
  onClick,
}: {
  provider: string;
  icon: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "w-full p-3 border border-gray-300/10 cursor-pointer bg-white rounded-2xl gap-4 shadow-[0px_4px_4px_0px_#E2E8F0] justify-center items-center inline-flex",
        loading ? "opacity-50 cursor-wait" : "hover:opacity-80"
      )}
    >
      {icon}
      <span className="text-center text-zinc-800 text-lg font-normal">
        Continue With {provider}
      </span>
    </div>
  );
};
const Auth = ({ head = true }: { head?: boolean }) => {
  const auth = useAuthFlow();
  const { isLogin, refresh, logout, user, status } = useAuth();
  const nav = useNavigate();
  const authCheck = status == "loading";
  const isLoginned = status == "success" && isLogin;

  const checkUserExists = trpc.user.userExists.useMutation();
  const register = trpc.user.registerUser.useMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"email" | "verify" | "login" | "register">(
    "email"
  );
  const checkeEmail = async () => {
    setPassword("");
    checkUserExists.mutateAsync({ email }).then((res) => {
      if (email.trim() == "") return toast.error("Email is required");

      if (typeof res != "boolean" && !res.has_password) {
        return toast.error("Email already registered with oauth provider");
      }
      if (res) {
        setStep("login");
      } else {
        setStep("register");
      }
    });
  };
  const loginAction = useMutation({
    mutationFn: async () => {
      return await pb_client
        .collection("users")
        .authWithPassword(email, password)
        .then((res) => {
          if (res) {
            refresh();
            nav(LINKS.DASHBOARD);
          }
        });
    },
    onError(error) {
      // @ts-ignore
      if (error.message.includes("Failed to authenticate.")) {
        return toast.error("Wrong password");
      }
      // @ts-ignore
      toast.error(error.message);
    },
  });
  const registerAction = async () => {
    register
      .mutateAsync({
        email,
        password,
      })
      .then(() => {
        toast.success("Account created successfully");
        return loginAction.mutateAsync();
      });
  };
  return (
    <div className="w-full md:w-[400px] flex flex-col justify-center items-center">
      {authCheck && (
        <>
          <CircularProgress size="lg" />
        </>
      )}
      {isLoginned && (
        <>
          <div className="w-full flex justify-start py-6">
            <span className="text-center text-black text-xl font-semibold">
              continue as
            </span>
          </div>
          <Link className="w-full" to={LINKS.DASHBOARD}>
            <div
              className="w-full px-6 py-4 flex bg-white rounded-2xl justify-between items-center cursor-pointer hover:bg-white/60 transition-all
                    "
            >
              <div className="flex gap-3 items-center">
                <Avatar name={user?.username || ""} src={user?.avatar} />
                <div className="flex flex-col justify-center items-start">
                  <span className="text-black font-semibold">
                    {user?.username}
                  </span>
                  <span className=" text-black">{user?.email}</span>
                </div>
              </div>
              <TbChevronRight className="text-gray-400 w-[32px] h-[32px]" />
            </div>
          </Link>
          <div className="w-full mt-4 flex flex-col gap-2 text-center ">
            <span className="text-red-500 cursor-pointer" onClick={logout}>
              Logout
            </span>
          </div>
        </>
      )}
      {!authCheck && !isLogin && (
        <>
          {head && (
            <div className="w-full flex justify-start py-4">
              <span className="text-center text-black text-xl font-semibold">
                {step == "login" && "welcome back"}
                {step == "register" && "welcome | register"}
                {step == "email" && "welcome"}
              </span>
            </div>
          )}
          <div className="w-full flex flex-col gap-2 py-4">
            <div>
              <span className="text-center text-black text-xl font-semibold"></span>
            </div>
            {step == "email" && (
              <>
                <Input
                  fullWidth
                  placeholder="Email"
                  type="email"
                  autoComplete="email"
                  variant="bordered"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                  isLoading={checkUserExists.isLoading}
                  onClick={checkeEmail}
                  fullWidth
                  size="lg"
                  className="bg-blue-500 text-white"
                >
                  Continue
                </Button>
              </>
            )}
            {step == "login" && (
              <>
                <div className="flex gap-2 items-center">
                  <TbArrowLeft
                    fontSize={24}
                    onClick={() => setStep("email")}
                    className="text-black cursor-pointer"
                  />
                  <div className="text-black text-md font-semibold">
                    Login as &nbsp;
                    <span className="text-blue-500">{email}</span>
                  </div>
                </div>
                <Input
                  fullWidth
                  placeholder="Password"
                  type="password"
                  autoComplete="current-password"
                  variant="bordered"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  onClick={() => loginAction.mutate()}
                  isLoading={loginAction.isLoading}
                  fullWidth
                  size="lg"
                  className="bg-blue-500 text-white"
                >
                  Login
                </Button>
              </>
            )}
            {step == "register" && (
              <>
                <div className="flex gap-2 items-center">
                  <TbArrowLeft
                    fontSize={24}
                    onClick={() => setStep("email")}
                    className="text-black cursor-pointer"
                  />
                  <div className="text-black text-md font-semibold">
                    Register as &nbsp;
                    <span className="text-blue-500">{email}</span>
                  </div>
                </div>
                <Input
                  className="mt-2"
                  fullWidth
                  placeholder="Password"
                  type="password"
                  autoComplete="new-password"
                  variant="bordered"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  onClick={registerAction}
                  isLoading={register.isLoading || loginAction.isLoading}
                  fullWidth
                  size="lg"
                  className="bg-blue-500 text-white"
                >
                  Register
                </Button>
              </>
            )}
          </div>
          {/* login with oauth providers */}
          <div className="w-full mt-4 flex flex-col gap-2">
            <ProviderItem
              onClick={() => auth.open("github")}
              loading={auth.currentAuthLoading == "github"}
              provider="Github"
              icon={
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_58_1597)">
                    <path
                      d="M16 0C24.84 0 32 7.16 32 16C31.9991 19.3524 30.947 22.6201 28.9917 25.3432C27.0364 28.0664 24.2763 30.1077 21.1 31.18C20.3 31.34 20 30.84 20 30.42C20 29.88 20.02 28.16 20.02 26.02C20.02 24.52 19.52 23.56 18.94 23.06C22.5 22.66 26.24 21.3 26.24 15.16C26.24 13.4 25.62 11.98 24.6 10.86C24.76 10.46 25.32 8.82 24.44 6.62C24.44 6.62 23.1 6.18 20.04 8.26C18.76 7.9 17.4 7.72 16.04 7.72C14.68 7.72 13.32 7.9 12.04 8.26C8.98 6.2 7.64 6.62 7.64 6.62C6.76 8.82 7.32 10.46 7.48 10.86C6.46 11.98 5.84 13.42 5.84 15.16C5.84 21.28 9.56 22.66 13.12 23.06C12.66 23.46 12.24 24.16 12.1 25.2C11.18 25.62 8.88 26.3 7.44 23.88C7.14 23.4 6.24 22.22 4.98 22.24C3.64 22.26 4.44 23 5 23.3C5.68 23.68 6.46 25.1 6.64 25.56C6.96 26.46 8 28.18 12.02 27.44C12.02 28.78 12.04 30.04 12.04 30.42C12.04 30.84 11.74 31.32 10.94 31.18C7.75328 30.1193 4.98147 28.082 3.01778 25.3573C1.05409 22.6325 -0.00176096 19.3586 2.20462e-06 16C2.20462e-06 7.16 7.16 0 16 0Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_58_1597">
                      <rect width="32" height="32" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              }
            />
          </div>
        </>
      )}
    </div>
  );
};
export default Auth;
