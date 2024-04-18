import { z } from "zod";
import { router, userProcedure } from "./config";
import OpenAI from "openai";
import { pb } from "@/libs/pb";
const aiRouter = router({
  processChat: userProcedure
    .input(
      z.object({
        aiServiceId: z.string(),
        aiModelId: z.string(),
        messages: z.array(z.any()),
      })
    )
    .mutation(async ({ input }) => {
      const messages = input.messages as OpenAI.ChatCompletionMessageParam[];

      let apiEndpoint = "";
      let apiKey = "";
      try {
        const aiService = await pb
          .collection("user_ai")
          .getOne(input.aiServiceId);
        if (aiService) {
          apiEndpoint = aiService.endpoint;
          apiKey = aiService.api_key;
        }
      } catch (e) {
        throw new Error("Ai Service not found");
      }
      const oai = new OpenAI({
        baseURL: apiEndpoint,
        apiKey,
      });
      const aiModel = input.aiModelId;

      const res = await oai.chat.completions.create({
        model: aiModel,
        messages,
      });
      if (!res.choices.length) throw new Error("No response from AI");
      return res.choices[0].message;
    }),
});

export default aiRouter;
