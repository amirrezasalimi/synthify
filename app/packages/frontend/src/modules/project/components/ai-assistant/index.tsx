import { BotIcon } from "@/shared/components/icons";
import { Button, cn } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { TbSettings } from "react-icons/tb";
import { useLocalStorage } from "react-use";
import useChat from "./hooks/chat";

const AiAssistantChat = ({ isOpen }: { isOpen: boolean }) => {
  const [message, setMessage] = useLocalStorage("chat-message", "");
  const [showSettings, setShowSettings] = useState(false);
  const msg = message as string;

  const chat = useChat();
  return (
    <motion.div
      className={cn(
        "absolute bottom-0 right-0 mb-6 mr-14 z-10 w-[450px] p-2 bg-background-800 border-background-700 border rounded-md flex flex-col justify-between",
        isOpen ? "block" : "hidden"
      )}
      initial={{
        height: isOpen ? "70%" : 0,
      }}
      animate={{
        height: isOpen ? "70%" : 0,
      }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <div className="flex justify-between">
          <div className="px-2 py-2">
            {showSettings ? "Settings" : "Ai Assistant"}
          </div>
          <div>
            <Button
              isIconOnly
              onClick={() => setShowSettings((prev) => !prev)}
              variant={showSettings ? "solid" : "light"}
            >
              <TbSettings size={20} />
            </Button>
          </div>
        </div>
        {/* settings */}
        <motion.div
          className="bg-background-700 overflow-hidden rounded-md mt-2"
          initial={{
            height: 0,
          }}
          animate={{
            height: showSettings ? "auto" : 0,
          }}
        >
          <div className="w-full h-full p-2">
            <Button onClick={chat.changeModel} fullWidth variant="ghost">
              {chat.selectedModelId || "Select a model"}
            </Button>
          </div>
        </motion.div>
      </div>
      {/* bottom */}

      <div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full resize-none border rounded-md p-2 outline-none min-h-8 h-auto max-h-[120px]"
          placeholder="Type a message"
          rows={msg.split("\n").length > 1 ? msg.split("\n").length : undefined}
        />
      </div>
    </motion.div>
  );
};

const AiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <AiAssistantChat isOpen={isOpen} />
      <motion.div
        onClick={() => setIsOpen((prev) => !prev)}
        className="absolute z-10 bottom-0 right-0 mb-6 px-4 flex gap-3 justify-center items-center rounded-md h-10  border bg-secondary border-secondary-700 text-background cursor-pointer overflow-hidden select-none"
        initial={{
          width: "fit-content",
          transformOrigin: "100% 100%",
        }}
        animate={{
          rotate: !isOpen ? 0 : 90,
          marginRight: !isOpen ? "2rem" : "3rem",
        }}
        transition={{ duration: 0.3 }}
      >
        <BotIcon className={"w-6 h-6 min-w-min "} />
        <div className={"whitespace-nowrap transition-all overflow-hidden"}>
          Ai assistant
        </div>
      </motion.div>
    </>
  );
};

export default AiAssistant;
