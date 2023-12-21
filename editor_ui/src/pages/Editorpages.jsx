import React, { useEffect, useRef } from "react";
import Client from "../Components/Client";
import Editor from "../Components/Editor";
import { initSocket } from "../socket";
import ACTIONS from "../Actions";

const Editorpages = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      //console.log(socketRef.current)
      //socketRef.current.emit(ACTIONS.JOIN)
    };
    init();
  });

  const clients = [
    { username: "Harsh Goyal", socketId: 1 },
    { username: "Sahil Goyal", socketId: 2 },
    { username: "Himanshu Gupta", socketId: 3 },
  ];
  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <h3>Connected</h3>
          <div className="clientsList">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <button className="btn copyBtn">Copy ROOM ID</button>
        <button className="btn leaveBtn">Leave</button>
      </div>
      <div className="editorWrap">
        <Editor />
      </div>
    </div>
  );
};

export default Editorpages;
