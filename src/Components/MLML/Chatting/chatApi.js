let socket;

const connect = (userIdx, userNickname, bodyRef, setMsgs) => {
  socket = new WebSocket("ws://127.0.0.1:5000/ws");
  console.log("Attempting Connection...");

  socket.onopen = () => {
    console.log("Successfully Connected");
    sessionStorage.setItem("chatStart", true);
    const message = {
      type: 2,
      idx: userIdx,
      nickname: userNickname,
    };
    socket.send(JSON.stringify(message));
  };

  socket.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    // console.log("Received message: ", data);
    // bodyRef.current.scrollTo(0, bodyRef.current.scrollHeight);

    if (data.type === 1) {
      // console.log(JSON.parse(data.body));
      const msgParsed = JSON.parse(data.body);
      setMsgs((prevMsgs) => [...prevMsgs, msgParsed]);
    } else {
      console.log("etc type: ", data.type);
    }
  };

  socket.onclose = (event) => {
    console.log("Socket Closed Connection: ", event);
  };

  socket.onerror = (error) => {
    console.log("Socket Error: ", error);
  };
};

const disconnect = (userIdx, userNickname) => {
  console.log("Socket Closing");
  const message = {
    type: 3,
    idx: userIdx,
    nickname: userNickname,
  };
  socket.send(JSON.stringify(message));
  socket.close();
  sessionStorage.removeItem("chatStart");
  sessionStorage.removeItem("msgs");
};

const sendMsg = (userIdx, userNickname, msg) => {
  // console.log("sending msg: ", msg);
  const now = new Date();
  const message = {
    type: 1,
    idx: userIdx,
    nickname: userNickname,
    message: msg,
    time: now.getHours() + ":" + (now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes()),
  };
  socket.send(JSON.stringify(message));
};

export { connect, disconnect, sendMsg };
