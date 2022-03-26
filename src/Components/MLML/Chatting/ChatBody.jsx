import { forwardRef, memo } from "react";
import ChatMsg from "./ChatMsg";
import ChatAnnounce from "./ChatAnnounce";

const ChatBody = ({ msgs, userIdx }, ref) => {
  return (
    <div ref={ref} className="chatting-scroll w-full h-full max-h-full overflow-y-auto overscroll-none p-2 space-y-2">
      {msgs.map((msg, index) => {
        return msg.type === 1 ? <ChatMsg key={index} idx={userIdx} msg={msg} /> : <ChatAnnounce key={index} msg={msg} />;
      })}
    </div>
  );
};

export default memo(forwardRef(ChatBody));
