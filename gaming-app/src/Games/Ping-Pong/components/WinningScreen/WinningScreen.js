import React, { useEffect } from 'react';
import { useLocation, useNavigate} from 'react-router-dom';
import Button from "@mui/material/Button";
import { fireConfetti } from "Games/Ping-Pong/components/WinningScreen/confetti";
import { getFromSession } from "Games/Ping-Pong/util/storage/sessionStorage";
import { updateuserList } from "Games/Ping-Pong/Firebase/updateFirebase"; 
import { toast } from "react-toastify";
import './WinningScreen.scss'


function WinningScreen() {

  const { state } = useLocation();
  let preGameId = state.gameId;
  let winner = state.winPlayer; 
  let player1 = state.player1;
  let player2 = state.player2;
  let player1_score = state.player1_score;
  let player2_score = state.player2_score;
  let navigateHere = preGameId ? `/multiplayer/${preGameId}` : '/playsolo';
  let user = JSON.parse(getFromSession("user"));
  let user_email_id = preGameId && user.email.replace(/[^a-zA-Z/d]/g, "");
  const navigate = useNavigate();

  useEffect(() => {
    fireConfetti();

    preGameId && updateuserList(
      user_email_id,
      preGameId,
      50,
      1,
      "won",
      player1_score,
      player2_score
    );
  }, [player1_score, player2_score, preGameId, user_email_id]);

  return (
    <>
      <div className="winning-background">
        <div className="winner-name-div">
          <p className="winner-name">
            {preGameId ? winner.name : 'You '} Won
          </p>
        </div>
        <div className="winning-screen-btn">
          <Button
            onClick={() =>
              {
                
                player1_score !== 10 && player2_score !== 10 && preGameId? 
                toast.info('Opponent left the game please go back!', {
                  theme: 'dark',
                  position: 'top-center'
                }):
                navigate(navigateHere, {
                  state: {
                    reset: true,
                    uid: preGameId,
                    player1_name: player1,
                    player2_name: player2,
                  },
                })
              }
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

export default WinningScreen