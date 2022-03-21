import { memo, useState, useRef, useCallback, useContext, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";
import ChatStandby from "./ChatStandby";
import ChatInput from "./ChatInput";
import { connect, disconnect, sendMsg } from "./chatApi";
import { AppContext } from "App";

function Chat({ props, handleImgError }) {
  const { userIdx, userNickname } = useContext(AppContext);

  const [msgs, setMsgs] = useState([]);
  console.log(msgs);

  const chatBodyRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
    !props.chatOpen && props.setChatIsChanged(true);
  }, [msgs]);

  const startChat = useCallback(() => {
    console.log("startChat");
    connect(userIdx, userNickname, chatBodyRef, msgs, setMsgs);
    props.setChatStart(true);
  }, [userIdx, userNickname]);

  const send = useCallback(
    (msg) => {
      console.log(msg);
      sendMsg(userIdx, userNickname, msg);
    },
    [userIdx, userNickname]
  );

  const endChat = useCallback(() => {
    console.log("endChat");
    try {
      setMsgs([]);
      disconnect(userIdx, userNickname);
    } catch (error) {
      console.log(error);
    }
    props.setChatStart(false);
  }, []);

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  };

  return (
    <div className="absolute top-16 -right-12 h-3/4-screen w-128 bg-slate-300 border border-2 border-slate-500 rounded-xl flex flex-col divide-y divide-neutral-700">
      <ChatHeader setChatOpen={props.setChatOpen} endChat={endChat} chatStart={props.chatStart} />
      {props.chatStart ? (
        <>
          <ChatBody ref={chatBodyRef} msgs={msgs} handleImgError={handleImgError} userIdx={userIdx} />
          <ChatInput send={send} />
        </>
      ) : (
        <ChatStandby startChat={startChat} />
      )}
    </div>
  );
}

export default memo(Chat);
