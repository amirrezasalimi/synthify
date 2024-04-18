import useSyncedState from "@/modules/project/hooks/synced-state";
import { useCommonStore } from "@/modules/project/stores/common";
import { trpc } from "@/shared/utils/trpc";
import toast from "react-hot-toast";

const godPrompt = () => {
  return `
  You are an AI assistant, and we possess a tool named 'Synthify.' This tool utilizes various flows and blocks to create synthesized datasets with large language models. When I provide you with a prompt and a desired data sample, your task is to discern the requirements and identify the precise process—namely, the necessary flows and blocks—and execute them on my behalf.
  
  Below is the documentation for the JSON inputs required by the 'Synthify' tool:
  
  ### Flow and Blocks:
  
  Here is a sample flow for creating a question dataset:
  
  [
    {
      "name": "main-flow",
      "blocks": [
        {
          "name": "categories",
          "type": "list",
          "prompt": "make a list of different shopping categories, without numerical or dash prefixes, no extra commentary, separated by a newline",
          "separator": "\n"
        },
        {
          "name": "question",
          "type": "text",
          "prompt": "formulate a question using category {rand(categories)}, ensuring to add a question mark at the end, without providing an answer or extra commentary."
        },
        {
          "name": "output",
          "type": "data",
          "prompt": "{question}"
        }
      ]
    }
  ]
  
  Different block types include: text, list, run-flow, and merge.
  
  - List: Create a list of items, selecting one each time either randomly or intentionally.
  - Text: Write a prompt, and a LLM will provide an answer.
  - Merge: Primarily used for merging texts or incorporating JavaScript scripts.
  - Run-flow: Executes other flows. For more complex tasks that require multiple flows, this feature enables modular flows for a streamlined execution.
  - Data: This block type is always positioned at the end of the flow, allowing the result to be compiled and presented.
  
  ### Sample of 'run-flow' block:
  
  {
    "type": "run-flow",
    "flow": "flow-name"
  }
  
  In all "prompt" fields, you can use expressions such as {block_name} to pull the generated content from other blocks or even from the "output" block of other flows. When running a flow, {flow_name} can be used to access the output of the flow being executed in your current main flow.
  
  The rand() function is also available for use, which can accept an array, rand(min,max), or rand(n) for generating a random number. Furthermore, any JavaScript inline code can be included within {} brackets, such as {Math.random(1)}.
  
  #### Notes:
  - Avoid using AI prompts for simple tasks, such as generating random numbers, merging texts, or requesting very large texts. Optimize the process by decomposing the problem into distinct blocks.
  - Employ the 'merge' block for merging texts or executing JavaScript code. The 'text' block is exclusively for generating AI text.
  - In 'text' or 'list' blocks, clearly state your requirements to the AI in detail, such as 'no extra commentary, in the following format:\n...'
  - give ai sample/examples as much you can for better understanding of what you want from it.
  - return all the blocks and blocks in single json.
  - be creative in the whole process , understand the need of prompt.
  `;
};

const useChat = () => {
  const sendMsg = trpc.ai.processChat.useMutation();
  const toggleChooseAiModel = useCommonStore(
    (state) => state.toggleChooseModelModal
  );

  const { chat } = useSyncedState();
  const changeModel = () => {
    toggleChooseAiModel(true, (service, model) => {
      chat.selectedModelId = model;
      chat.selectedServiceId = service;
      console.log(
        "Selected model",
        chat.selectedModelId,
        chat.selectedServiceId
      );
    });
  };

  const sendMessage = (message: string) => {
    return new Promise((resolve, reject) => {
      if (!chat.selectedModelId || !chat.selectedServiceId) {
        toast("Please select a model first");
      }
      if (!chat.messages) {
        chat.messages = [];
      }
      if (chat.messages?.length) {
        chat.messages.push({
          role: "user",
          content: message,
        });
      } else {
        chat.messages.push({
          role: "system",
          content: godPrompt(),
        });
        chat.messages.push({
          role: "user",
          content: message,
        });
      }
      console.log("Sending message", JSON.stringify(chat.messages, null, 2));
      
      sendMsg
        .mutateAsync({
          aiModelId: chat.selectedModelId || "",
          aiServiceId: chat.selectedServiceId || "",
          messages: chat.messages,
        })
        .then((res) => {
          chat.messages?.push(res);
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    });
  };
  return {
    messages: chat.messages,
    clearMessages: () => {},
    changeModel,
    selectedModelId: chat.selectedModelId,
    sendMessage,
    sendMessageIsLoading: sendMsg.isLoading,
  };
};

export default useChat;
