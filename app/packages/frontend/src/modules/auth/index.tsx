import Auth from "@/shared/components/auth";
import Logo from "@/shared/components/logo";

const AuthPage = () => {
  return (
    <div className="w-screen h-screen bg-gray-100">
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="w-64 h-64">
          <Logo />
        </div>
        <Auth />
      </div>
    </div>
  );
};

export default AuthPage;
