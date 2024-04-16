import { BotIcon } from "@/shared/components/icons";
import { cn } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useLocalStorage } from "react-use";

const AiAssistantChat = ({ isOpen }: { isOpen: boolean }) => {
  const [message, setMessage] = useLocalStorage("chat-message", "");

  const msg = message as string;
  return (
    <motion.div
      className={cn(
        "absolute bottom-0 right-0 mb-6 mr-14 z-10 w-[450px] p-4 bg-white border rounded-md flex flex-col justify-between",
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
      {/* bottom */}
      <div></div>
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
        className="absolute z-10 bottom-0 right-0 mb-6 px-4 flex gap-3 justify-center items-center rounded-md h-10  border bg-gradient-to-br from-blue-500 to-blue-700 text-white cursor-pointer overflow-hidden select-none"
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
