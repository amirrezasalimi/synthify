import useSyncedState from "@/modules/project/hooks/synced-state";
import { useCommonStore } from "@/modules/project/stores/common";

const useChat = () => {
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
  return {
    messages: [],
    sendMessage: (message: string) => {},
    clearMessages: () => {},
    changeModel,
    selectedModelId: chat.selectedModelId,
  };
};

export default useChat;
