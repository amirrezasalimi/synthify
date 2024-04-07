import { createTRPCReact } from "@trpc/react-query";
import { Router } from "../../../../backend/src/routes";
export const trpc = createTRPCReact<Router>();
