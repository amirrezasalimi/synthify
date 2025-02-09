import { BotIcon } from "@/shared/components/icons";
import { Button, cn } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { TbSend, TbSettings, TbTrash } from "react-icons/tb";
import { useLocalStorage } from "react-use";
import useChat from "./hooks/chat";
import useDataImporter from "../../hooks/data-importer";

const AiAssistantChat = ({ isOpen }: { isOpen: boolean }) => {
  const [message, setMessage] = useLocalStorage("chat-message", "");
  const [showSettings, setShowSettings] = useState(false);
  const importer = useDataImporter();
  const msg = message as string;

  const chat = useChat();

  const send = () => {
    chat.sendMessage(msg).then(() => {
      setMessage("");
    });
  };

  const messagesRef = useRef<HTMLDivElement>(null);

  const [showBottomShadow, setShowBottomShadow] = useState(false);

  useEffect(() => {
    if (messagesRef.current) {
      const el = messagesRef.current;
      el.addEventListener("scroll", () => {
        setShowBottomShadow(el.scrollTop + el.clientHeight < el.scrollHeight);
      });
    }
  }, []);

  const clearChat = () => {
    chat.clearMessages();
  };

  const isValidJson = (schema: string): boolean => {
    try {
      let cleaned = schema.trim();
      if (cleaned.startsWith("```json")) {
        cleaned = cleaned.replace(/^```json\s*/, "");
      } else if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```\s*/, "");
      }
      if (cleaned.endsWith("```")) {
        cleaned = cleaned.replace(/\s*```$/, "");
      }
      JSON.parse(cleaned);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <motion.div
      className={cn(
        "absolute bottom-0 right-0 mb-6 mr-14 z-10 w-[450px] bg-background-800 border-background-700 border rounded-md flex flex-col overflow-hidden"
      )}
      initial={{
        opacity: 1,
        height: isOpen ? "70vh" : 0,
      }}
      animate={{
        height: isOpen ? "70vh" : 0,
        opacity: isOpen ? 1 : 0,
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative flex flex-col h-full">
        <div className="top-0 z-10 absolute flex justify-between items-center bg-background-800 bg-opacity-80 backdrop-blur-lg backdrop-filter px-4 w-full h-12">
          <div>{showSettings ? "Settings" : "Ai Assistant"}</div>
          <div className="flex gap-2">
            <Button isIconOnly onClick={clearChat} variant={"light"}>
              <TbTrash size={20} />
            </Button>
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
          className="bg-background-700 my-2 w-full overflow-hidden"
          initial={{
            height: 0,
          }}
          animate={{
            height: showSettings ? "auto" : 0,
          }}
        >
          <div className="mt-[4rem] p-2 w-full h-full">
            <Button onClick={chat.changeModel} fullWidth variant="ghost">
              {chat.selectedModelId || "Select a model"}
            </Button>
          </div>
        </motion.div>
        {/* chat */}
        <motion.div
          ref={messagesRef}
          className="relative flex flex-col gap-2 px-4 pt-[2rem] pb-[140px] overflow-y-auto"
          animate={{
            opacity: showSettings ? 0 : 1,
            height: showSettings ? 0 : "100%",
          }}
        >
          {/* gradient shadow */}
          {showBottomShadow && (
            <div className="bottom-2 sticky bg-gradient-to-t from-background-800 to-transparent w-full h-4"></div>
          )}
          {chat.messages?.map((msg, i) => {
            const content = msg.content as string;
            if (msg.role === "system") return null;
            return (
              <div
                key={i}
                className={cn(
                  "px-2 py-1 rounded-md max-w-fit",
                  msg.role === "user"
                    ? "bg-primary text-background"
                    : "bg-secondary text-background"
                )}
              >
                <div className="size-full"></div>
                {isValidJson(content) && (
                  <Button
                    color="default"
                    variant="ghost"
                    size="sm"
                    onClick={() => importer.importData(content)}
                  >
                    Import
                  </Button>
                )}
              </div>
            );
          })}
        </motion.div>
        {/* bottom */}

        <div className="bottom-0 absolute bg-background-700 bg-opacity-80 backdrop-blur-lg backdrop-filter border-t border-background-600 w-full h-[120px]">
          <textarea
            disabled={chat.sendMessageIsLoading}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-transparent p-2 w-full h-full outline-none resize-none"
            placeholder="ask what you want"
            rows={
              msg.split("\n").length > 1 ? msg.split("\n").length : undefined
            }
            // ctrl or cmd + enter
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                send();
              }
            }}
          />
          <Button
            isLoading={chat.sendMessageIsLoading}
            onClick={send}
            isIconOnly
            variant="light"
            className="right-2 bottom-2 absolute"
          >
            <TbSend size={20} />
          </Button>
        </div>
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
        onClick={() => {
          // return toast("coming soon");
          setIsOpen((prev) => !prev);
        }}
        className="right-0 bottom-0 z-10 absolute flex justify-center items-center gap-3 border-secondary-700 bg-secondary mb-6 px-4 border rounded-md h-10 text-background cursor-pointer overflow-hidden select-none"
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
          Ai assistant (experimental)
        </div>
      </motion.div>
    </>
  );
};

export default AiAssistant;
