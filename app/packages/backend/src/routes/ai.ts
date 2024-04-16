import { z } from "zod";
import { router, userProcedure } from "./config";
const aiRouter = router({
    process: userProcedure.input(z.object({
        messages: z.array(z.string()),
    })).mutation(async ({ input }) => {

    }),
});

export default aiRouter;
