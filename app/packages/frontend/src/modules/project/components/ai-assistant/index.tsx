import { BotIcon } from "@/shared/components/icons";
import { Button, cn } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { TbSend, TbSettings } from "react-icons/tb";
import { useLocalStorage } from "react-use";
import useChat from "./hooks/chat";
import toast from "react-hot-toast";

const AiAssistantChat = ({ isOpen }: { isOpen: boolean }) => {
  const [message, setMessage] = useLocalStorage("chat-message", "");
  const [showSettings, setShowSettings] = useState(false);
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
      <div className="flex flex-col relative h-full">
        <div className="w-full flex justify-between h-12 bg-background-800 z-10 absolute top-0 px-4 items-center bg-opacity-80 backdrop-filter backdrop-blur-lg">
          <div>{showSettings ? "Settings" : "Ai Assistant"}</div>
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
          className="w-full bg-background-700 overflow-hidden my-2"
          initial={{
            height: 0,
          }}
          animate={{
            height: showSettings ? "auto" : 0,
          }}
        >
          <div className="w-full h-full p-2 mt-[4rem]">
            <Button onClick={chat.changeModel} fullWidth variant="ghost">
              {chat.selectedModelId || "Select a model"}
            </Button>
          </div>
        </motion.div>
        {/* chat */}
        <motion.div
          ref={messagesRef}
          className="overflow-y-auto flex flex-col gap-2 relative pt-[2rem] pb-[140px] px-4"
          animate={{
            opacity: showSettings ? 0 : 1,
            height: showSettings ? 0 : "100%",
          }}
        >
          {/* gradient shadow */}
          {showBottomShadow && (
            <div className="sticky bottom-2 w-full h-4 bg-gradient-to-t from-background-800 to-transparent"></div>
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
                {content}
              </div>
            );
          })}
        </motion.div>
        {/* bottom */}

        <div className="w-full h-[120px] absolute bottom-0 border-t border-background-600 bg-background-700 bg-opacity-80 backdrop-filter backdrop-blur-lg">
          <textarea
            disabled={chat.sendMessageIsLoading}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-full resize-none  p-2 outline-none bg-transparent"
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
            className="absolute bottom-2 right-2"
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
          return toast("coming soon");
          setIsOpen((prev) => !prev);
        }}
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
