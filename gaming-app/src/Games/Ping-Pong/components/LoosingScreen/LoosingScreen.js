import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { getSessionStorage } from "utils/Storage/SessionStorage";
import { updateFirebase } from "Games/Ping-Pong/Firebase/updateFirebase";
import "./LoosingScreen.scss";

function LoosingScreen(props) {
  const user = JSON.parse(getSessionStorage("user"));
  console.log(user);
  const [mode, setmode] = useState("");
  const [winner, setWinner] = useState("");
  const [player1_score, setPlayer1_score] = useState("");
  const [player2_score, setPlayer2_score] = useState("");
  const uId = getSessionStorage("singleplayGameId"); 

  // let preGameId = state.gameId;
  // let looser = state.losePlayer;
  // let player1 = state.player1;
  // let player2 = state.player2;
  // let player1_score = state.player1_score;
  // let player2_score = state.player2_score;
  // let user = JSON.parse(getFromSession("user"));

  // let user_email_id = preGameId && user.email.replace(/[^a-zA-Z/\d]/g, "");

  // let navigateHere = preGameId ? `/multiplayer/${preGameId}` : "/playsolo";

  //- for single player
  useEffect(() => {
    setmode(props.mode);
    setWinner(props.winner);
    setPlayer1_score(props.player1_score);
    setPlayer2_score(props.player2_score);

    return () => {};
  }, [props.mode, props.winner, props.player1_score, props.player2_score]);

  useEffect(() => {
  
    if (props.mode === "singleplayer") {
      console.log('in lose');
      updateFirebase("UserList", user.email, "total_games", 1);
      updateFirebase("GameID", user.email, "gameSessionList", {
        obj: { status: "lost", score: 0 },
        gameid: uId,
      });
      updateFirebase("GameID", user.email, "total_wins", 1);
      updateFirebase("GameID", user.email, "total_games_played_by", "");
      updateFirebase("GameID", "ping-pong", "total_games", 1);
    } else {
      console.log("sin");
    }
  }, [
    mode,
    user.email,
    /*player1_score, player2_score, preGameId, user_email_id*/
  ]);

  return (
    <>
      <div className="winning-background">
        <div className="winner-name-div">
          <p className="winner-name">you lost the game</p>
        </div>
        <div className="winning-screen-btn">
          <Button
            onClick={
              () => props.parentCallback("")
            }
            className="new-game"
          >
            Play Again
          </Button>
          <Button className="back" onClick={() => props.parentCallback("back")}>
            Back
          </Button>
        </div>
      </div>
    </>
  );
}

export default LoosingScreen;
