import AuthPage from "@/modules/auth";
import Project from "@/modules/project";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedLayout from "./protected-layout";
import Dashboard from "@/modules/dashboard";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedLayout>
          <Dashboard />
        </ProtectedLayout>
      ),
    },
    {
      path: "/p/:id",
      element: (
        <ProtectedLayout>
          <Project />
        </ProtectedLayout>
      ),
    },
    {
      path: "/auth",
      element: <AuthPage />,
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Router;
