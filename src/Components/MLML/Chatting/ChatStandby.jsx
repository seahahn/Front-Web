import React from "react";

const ChatStandby = ({ startChat }) => {
  return (
    <div className="w-full h-full flex flex-col justify-center content-center space-y-4 p-2 border border-1 border-black rounded-lg">
      <p className="text-center">
        AI Play를 이용 중인 분들과 이야기를 나눌 수 있는 공간입니다.
        <br />
        채팅을 시작하려면 채팅 시작을 누르세요!
      </p>
      <button
        type="button"
        onClick={() => startChat(true)}
        className="w-1/3 self-center bg-primary-500 hover:bg-primary-700 text-white text-md font-bold py-1 px-1 rounded-full">
        채팅 시작
      </button>
    </div>
  );
};

export default React.memo(ChatStandby);
