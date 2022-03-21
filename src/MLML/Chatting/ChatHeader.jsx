import React from "react";
import { FaRegWindowMinimize } from "react-icons/fa";
import { HiX } from "react-icons/hi";

const ChatHeader = ({ setChatOpen, endChat, chatStart }) => {
  return (
    <div className="flex flex-row justify-between items-center px-2 pt-1">
      <h3 className="text-xl">공개 채팅방</h3>
      <div className="space-x-1">
        <FaRegWindowMinimize onClick={() => setChatOpen(false)} className="inline w-6 h-6 cursor-pointer pb-1" />
        <HiX onClick={() => (chatStart ? endChat(false) : setChatOpen(false))} className="inline w-7 h-7 cursor-pointer" />
      </div>
    </div>
  );
};

export default React.memo(ChatHeader);
