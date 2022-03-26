import { memo, useState, useRef, useCallback, useContext, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";
import ChatStandby from "./ChatStandby";
import ChatInput from "./ChatInput";
import { connect, disconnect, sendMsg } from "./chatApi";
import { AppContext } from "App";
import classNames from "classnames";

function Chat({ props }) {
  const { userIdx, userNickname } = useContext(AppContext);

  const [msgs, setMsgs] = useState(sessionStorage.getItem("msgs") ? JSON.parse(sessionStorage.getItem("msgs")) : []);

  const chatBodyRef = useRef();

  useEffect(() => {
    scrollToBottom();
    !props.chatOpen && props.setChatIsChanged(true);
    sessionStorage.setItem("msgs", JSON.stringify(msgs));
    // console.log(msgs);
  }, [msgs]);

  const startChat = useCallback(() => {
    console.log("startChat");
    connect(userIdx, userNickname, chatBodyRef, setMsgs);
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
  }, [userIdx, userNickname]);

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  };
  const screenMd = matchMedia("min-width: 768px");
  return (
    <div
      className={classNames(
        screenMd.matches ? "absolute top-16 -right-12 h-3/4-screen w-128" : "fixed z-10 inset-0",
        "bg-slate-300 border border-2 border-slate-500 rounded-xl flex flex-col divide-y divide-neutral-700"
      )}>
      <ChatHeader setChatOpen={props.setChatOpen} endChat={endChat} chatStart={props.chatStart} />
      {props.chatStart ? (
        <>
          <ChatBody ref={chatBodyRef} msgs={msgs} userIdx={userIdx} />
          <ChatInput send={send} />
        </>
      ) : (
        <ChatStandby startChat={startChat} />
      )}
    </div>
  );
}

export default memo(Chat);
