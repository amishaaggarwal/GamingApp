import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import "./Startscreen.scss";
import { uid } from "uid";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "react-modal";
import { auth } from "Games/Ping-Pong/Firebase/firebaseconfig.js";
import { db } from "Games/Ping-Pong/Firebase/firebaseconfig.js";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { ref, onValue, update, set } from "firebase/database";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { setInSession } from "Games/Ping-Pong/util/storage/sessionStorage";
import LeaderBoard from "Games/Ping-Pong/components/leaderboard/LeaderBoard";
import { toast } from "react-toastify";
import Notification from "Games/Ping-Pong/components/Notification/Notification";
import UserList from "Games/Ping-Pong/components/UserList/UserList";

function Startscreen(props) {
  const [data, setData] = useState(null);
  const [ishared, setIshared] = useState(false);
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [uID, setUID] = useState();
  const navigate = useNavigate();

  let wWidth = window.innerWidth;
  let wHeight = window.innerHeight;

  const { gameid } = useParams();

  useEffect(() => {
    onValue(ref(db, `Game/${uID}`), (snapshot) => {
      setData(snapshot.val());
    });
    return () => {
      setData(null);
    };
  }, [uID]);

  useEffect(() => {
    if (gameid) {
      setIshared(true);
      setUID(gameid);
    } else if (!uID) {
      setUID(uid());
    }
  }, [gameid, uID]);

  const gameSessionUrl = window.location.href;

  const [modalIsOpen, setIsOpen] = useState(false);

  const provider = new GoogleAuthProvider();

  const signInWithGoggle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setIsLoggedin(true);

        setInSession(
          "user",
          JSON.stringify({
            name: result.user.displayName,
            email: result.user.email,
          })
        );

        set(ref(db, `Game/${uID}`), {
          players: {
            player1: {
              name: !ishared
                ? result.user.displayName
                : data.players.player1.name,
              email: !ishared ? result.user.email : data.players.player1.email,
            },
            player2: {
              name: ishared ? result.user.displayName : "",
              email: ishared ? result.user.email : "",
            },
          },

          gamestate: {
            ball: {
              x: wWidth / 2,
              y: wHeight / 2.15,
            },
            player1_paddle: {
              y: wHeight / 2.5,
            },
            player2_paddle: {
              y: wHeight / 2.5,
            },
            score: {
              player1_score: 0,
              player2_score: 0,
            },
            ballspeed: {
              x: 0,
              y: 0,
            },
          },
          start: false,
          winner: {},
        });

        let newUserID = result.user.email.replace(/[^a-zA-Z/\d]/g, "");

        update(ref(db, `UserList/${newUserID}`), {
          name: result.user.displayName,
          email: result.user.email,
          dp: result.user.photoURL,
        });
      })
      .catch((error) => {

        toast.error(error.message, {
          theme:'dark',
          position:'top-center'
        })
      });
  };
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      width: "50%",
      height: "35%",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#007272",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, .5)",
    },
  };

  function closeModal() {
    setIsOpen(false);
  }

  Modal.setAppElement("#root");

  return (
    <>
      {/* <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => closeModal()}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="modal-content">
          {isLoggedin ? (
            <div>
              {!ishared && (
                <CopyToClipboard text={`${gameSessionUrl}${uID}`}>
                  <Button className="copy-link-btn" variant="outlined">
                    Click to Copy link and share with your firend!
                  </Button>
                </CopyToClipboard>
              )}
              <Button
                variant="contained"
                className="enter-game-btn"
                onClick={() =>
                  navigate(`/multiplayer/${uID}`, {
                    state: {
                      reset: false,
                      uid: uID,
                    },
                  })
                }
              >
                Enter Game
              </Button>
            </div>
          ) : (
            <div className="signin-with-google">
              <Button className="g-signin" onClick={() => signInWithGoggle()}>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxJzbnX4yyb7ekXoUeb4PXTamKvQ78mefFCw&usqp=CAU"
                  alt="google"
                  height="20%"
                  width="20%"
                />
                Sign in with Google
              </Button>
            </div>
          )}
          <div className="modal-bottom">
            <Button className="close-btn" onClick={() => closeModal()}>
              close
            </Button>
          </div>
        </div>
      </Modal> */}
      <div className="starting-page">
        <div className="login-page">
          <p className="game-name">PING PONG</p>
          <div className="mid-content">
            <LeaderBoard />
            <div className="all-btn">
              {!ishared && (
                <Button
                  className="startscreen-btn"
                  onClick={() => props.parentCallback("singleplayer")}
                >
                  singleplayer
                </Button>
              )}
              <Button
                className="startscreen-btn"
                onClick={() => props.parentCallback("multiplayer")}
              >
                multiplayer
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Notification />
    
    </>
  );
}

export default Startscreen;
