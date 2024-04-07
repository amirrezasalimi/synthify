import Project from "@/modules/project";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/p/:id",
      element: <Project />,
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Router;
