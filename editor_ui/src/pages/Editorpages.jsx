import React, { useEffect, useRef, useState } from "react";
import Client from "../Components/Client";
import Editor from "../Components/Editor";
import { initSocket } from "../socket";
import ACTIONS from "../Actions";
import { Navigate, useLocation, useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import Axios from 'axios';

const Editorpages = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const inputRef = useRef("");
  const outputRef = useRef("");
  const location = useLocation();
  const { roomId } = useParams();
  const reactNavigator = useNavigate();
  const [clients, setClients] = useState([]);
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later.");
        reactNavigator("/");
      }
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} has joined the room`);
          }
          //console.log(clients);
          setClients(clients);
          //console.log(codeRef.current)
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} has left the room`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room Id is copied to clipboard");
    } catch (err) {
      toast.error("Could not copy the room Id");
    }
  }

  function compileCode() {
    console.log(codeRef.current)
    Axios.post("http://localhost:5000/compile", {
      code: codeRef.current,
      language: 'python',
      input: inputRef.current.value
  }).then((output)=>{
    outputRef.current.value=output.data;
    console.log(outputRef.current.value);
  })
    console.log("Compiling code")
  }

  function leaveRoom() {
    reactNavigator("/");
  }

  if (!location.state) {
    return <Navigate to="/" />;
  }
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
        <button className="btn copyBtn" onClick={copyRoomId}>
          Copy ROOM ID
        </button>
        <button className="btn leaveBtn" onClick={leaveRoom}>
          Leave
        </button>
      </div>
      <div className="editorWrap">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
        <button className="btn runBtn" onClick={compileCode}>Run</button>
      </div>
      <div className="inputOutputbox">
        <div>
          <h3 style={{color:"white"}}>&nbsp; INPUT</h3>
          <textarea ref = {inputRef} type="text" className="inputbox"></textarea>
        </div>
        <div>
        <h3 style={{color:"white"}}>&nbsp;OUTPUT</h3>
        <textarea ref = {outputRef} type="text" className="outputbox"></textarea>
        </div>
      </div>
      
    </div>
  );
};

export default Editorpages;
