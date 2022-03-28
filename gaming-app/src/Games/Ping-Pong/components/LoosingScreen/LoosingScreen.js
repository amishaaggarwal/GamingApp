import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { getFromSession } from "Games/Ping-Pong/util/storage/sessionStorage";
import { updateFirebase } from "Games/Ping-Pong/Firebase/updateFirebase";

import "./LoosingScreen.scss";

function LoosingScreen(props) {
  const { state } = useLocation();
  // let preGameId = state.gameId;
  // let looser = state.losePlayer;
  // let player1 = state.player1;
  // let player2 = state.player2;
  // let player1_score = state.player1_score;
  // let player2_score = state.player2_score;
  // let user = JSON.parse(getFromSession("user"));

  // let user_email_id = preGameId && user.email.replace(/[^a-zA-Z/\d]/g, "");

  // let navigateHere = preGameId ? `/multiplayer/${preGameId}` : "/playsolo";

  // useEffect(() => {
  //   console.log('inlostpage');    
  //   preGameId &&
  //     updateuserList(
  //       user_email_id,
  //       preGameId,
  //       0,
  //       1,
  //       "lost",
  //       player1_score,
  //       player2_score
  //     );
  // })

  const navigate = useNavigate();
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
              // navigate(navigateHere, {
              //   state: {
              //     reset: true,
              //     uid: preGameId,
              //     player1_name: player1,
              //     player2_name: player2,
              //   },
              // })
            }
            className="new-game"
          >
            Play Again
          </Button>
          <Button onClick={() => navigate("/")} className="back">
            Back
          </Button>
        </div>
      </div>
    </>
  );
}

export default LoosingScreen;
