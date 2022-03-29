import React from "react";
import styled from "styled-components";
import { FiSend } from "react-icons/fi";

const StyledTextArea = styled.textarea`
  ::-webkit-scrollbar {
    display: none;
    width: 0 !important;
  }
`;

const ChatInput = ({ send }) => {
  const [input, setInput] = React.useState("");

  const inputRef = React.useRef(null);

  const handleSendMsg = () => {
    // const inputMsg = input.replaceAll(/(\n|\r\n)/g, "<br/>");
    if (input.length !== 0 && !input.startsWith("\n")) {
      send(input);
      setInput("");
      inputRef.current.value = "";
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      process.env.REACT_APP_STATUS === "development" && console.log("enter");
      e.preventDefault();
      handleSendMsg();
    } else {
      process.env.REACT_APP_STATUS === "development" && console.log("enter shift");
    }
  };

  return (
    <div className="w-full flex flex-row space-x-2 p-2 items-center">
      <StyledTextArea
        ref={inputRef}
        className="flex-1 p-1 max-h-8 border-solid border-2 border-slate-500 rounded-lg text-sm overscroll-none placeholder:text-xs"
        placeholder="메시지를 입력해주세요!"
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleEnter}></StyledTextArea>
      <FiSend onClick={handleSendMsg} className="inline w-7 h-7 cursor-pointer" />
    </div>
  );
};

export default React.memo(ChatInput);
