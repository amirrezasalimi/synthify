
import { router } from "./config";
import { projectRouter } from "./project";
import { userRouter } from "./user";



const routes = router({
  user: userRouter,
  project: projectRouter,
});

type AppRoutes = typeof routes;
export { AppRoutes, routes };
