const ChatAnnounce = ({ msg }) => {
  const annoStyle = "flex flex-col space-x-2 items-center justify-center";
  return msg.type === 2 ? (
    <div className={annoStyle}>
      <p className="text-xs">{msg.nickname}님이 입장하셨습니다</p>
    </div>
  ) : (
    <div className={annoStyle}>
      <p className="text-xs">{msg.nickname}님이 퇴장하셨습니다</p>
    </div>
  );
};

export default ChatAnnounce;
