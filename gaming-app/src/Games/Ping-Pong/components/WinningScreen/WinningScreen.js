import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { fireConfetti } from "Games/Ping-Pong/components/WinningScreen/confetti";
import { getFromSession } from "Games/Ping-Pong/util/storage/sessionStorage";
import { updateFirebase } from "Games/Ping-Pong/Firebase/updateFirebase";
import { getSessionStorage } from "utils/Storage/SessionStorage";
import { toast } from "react-toastify";
import { uid } from "uid";
import "./WinningScreen.scss";

function WinningScreen(props) {
  const user = JSON.parse(getSessionStorage("user"));
  console.log(user);
  const [mode, setmode] = useState("");
  const [winner, setWinner] = useState("");
  const [player1_score, setPlayer1_score] = useState("");
  const [player2_score, setPlayer2_score] = useState("");
  const [uId, setUid] = useState("");
  // const { state } = useLocation();
  // let preGameId = state.gameId;
  // let winner = state.winPlayer;
  // let player1 = state.player1;
  // let player2 = state.player2;
  // let player1_score = state.player1_score;
  // let player2_score = state.player2_score;
  // let navigateHere = preGameId ? `/multiplayer/${preGameId}` : '/playsolo';
  // let user = JSON.parse(getFromSession("user"));
  // let user_email_id = preGameId && user.email.replace(/[^a-zA-Z/d]/g, "");
  // const navigate = useNavigate();

  //- for single player
  useEffect(() => {
    setmode(props.mode);
    setWinner(props.winner);
    setPlayer1_score(props.player1_score);
    setPlayer2_score(props.player2_score);
    setUid(uid());
    return () => {};
  }, [props.mode, props.winner, props.player1_score, props.player2_score]);

  useEffect(() => {
    fireConfetti();
    if (mode === "singleplayer") {
      updateFirebase("UserList", user.email, "scoreCredit", 1);
      updateFirebase("UserList", user.email, "total_games", 1);
      updateFirebase("GameId", uId, "gameSessionList", "");
      updateFirebase("GameId", uId, "total_wins", 1);
      updateFirebase("GameId", uId, "total_games_played_by", "");
      updateFirebase("GameId", uId, "total_games", 1);
    
    } else {
    }
  }, [
    mode,
    user.email,
    uId,
    /*player1_score, player2_score, preGameId, user_email_id*/
  ]);

  return (
    <>
      <div className="winning-background">
        <div className="winner-name-div">
          <p className="winner-name">{`${winner}  Won`}</p>
        </div>
        <div className="winning-screen-btn">
          <Button
            onClick={() => props.parentCallback("")}
            //   {

            //     player1_score !== 10 && player2_score !== 10 && preGameId?
            //     toast.info('Opponent left the game please go back!', {
            //       theme: 'dark',
            //       position: 'top-center'
            //     }):
            //     navigate(navigateHere, {
            //       state: {
            //         reset: true,
            //         uid: preGameId,
            //         player1_name: player1,
            //         player2_name: player2,
            //       },
            //     })
            //   }
            // }
            className="new-game"
          >
            Play Again
          </Button>
          <Button className="back">Back</Button>
        </div>
      </div>
    </>
  );
}

export default WinningScreen;
