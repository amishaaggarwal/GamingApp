import Button from "@mui/material/Button";
import LeaderBoard from "components/LeaderBoard/LeaderBoard";
import UserList from "components/UserList/UserList";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useParams } from "react-router-dom";
import { uid } from "uid";
import "./Startscreen.scss";

function Startscreen(props) {
  const [open, setOpen] = useState(false);
  const [ishared, setIshared] = useState(false);
  const [uID, setUID] = useState();

  const { gameid } = useParams();


  useEffect(() => {
    if (gameid) {
      setIshared(true);
      setUID(gameid);
    } else if (!uID) {
      setUID(uid());
    }
  }, [gameid, uID]);

  //-selects mode
  const changeMode = (mode) => {
    switch (mode) {
      case "singleplayer":
        props.parentCallback("singleplayer");
        break;
      case "multiplayer":
        openModal();
        break;
      default:
        props.parentCallback("");
    }
  };

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };
  Modal.setAppElement("#root");

  return (
    <>
      <div className="starting-page">
        <div className="login-page">
          <p className="game-name">PING PONG</p>
          <div className="mid-content">
            <LeaderBoard />
            <div className="all-btn">
              {!ishared && (
                <Button
                  className="startscreen-btn"
                  onClick={() => changeMode("singleplayer")}
                >
                  singleplayer
                </Button>
              )}
              <Button
                className="startscreen-btn"
                onClick={() => {
                  changeMode("multiplayer");
                }}
              >
                multiplayer
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={open}
        onRequestClose={closeModal}
        className="winning-modal"
        overlayClassName="modal-overlay"
      >
        <UserList />
      </Modal>
   
    </>
  );
}

export default Startscreen;
