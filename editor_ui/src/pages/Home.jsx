import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-hot-toast";
import "../App.css";
const Home = () => {
  const [uuid, setuuid] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const generateId = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setuuid(id);

    toast.success("New Room is created");
  };

  const joinBtn = () => {
    if (!uuid || !userName) {
      toast.error("Both room Id and User Name is required");
      return;
    }
    navigate(`/editor/${uuid}`, {
      state: {
        userName,
      },
    });
  };

  const enterButtonHandle = (e) => {
    if (e.code === "Enter") {
      joinBtn();
    }
  };

  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <h4 className="mainLabel">Paste Invitation ROOM ID</h4>
        <div className="inputGroup">
          <input
            className="inputBox"
            type="text"
            placeholder="Room Id"
            value={uuid}
            onChange={(e) => setuuid(e.target.value)}
          />
          <input
            className="inputBox"
            type="text"
            placeholder="User Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyUp={enterButtonHandle}
          ></input>
          <button className="btn joinBtn" onClick={joinBtn}>
            Join
          </button>
          <span className="createInfo">
            {" "}
            If you don't have an invite then create &nbsp;
            <Link to="" className="createNewBtn" onClick={generateId}>
              New Room
            </Link>
          </span>
        </div>
      </div>
      <footer>
        <h4>
          {" "}
          Built with 😊 by &nbsp;
          <Link className="githubLink" to="https://github.com/harsh9896/">
            Harsh Goyal
          </Link>
        </h4>
      </footer>
    </div>
  );
};

export default Home;
