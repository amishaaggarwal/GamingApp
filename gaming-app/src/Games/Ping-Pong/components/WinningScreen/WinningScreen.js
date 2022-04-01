import Button from "@mui/material/Button";
import { fireConfetti } from "Games/Ping-Pong/components/WinningScreen/confetti";
import { updateFirebase } from "Games/Ping-Pong/Firebase/updateFirebase";
import React, { useEffect } from "react";
import { getSessionStorage } from "utils/Storage/SessionStorage";
import "./WinningScreen.scss";

function WinningScreen(props) {
  const user = JSON.parse(getSessionStorage("user"));

  const uId = getSessionStorage("singleplayGameId");

  useEffect(() => {
    fireConfetti();

    updateFirebase("UserList", user.email, "scoreCredit", 1);
    updateFirebase("UserList", user.email, "total_games", 1);
    updateFirebase("GameID", user.email, "gameSessionList", {
      obj: { status: "won", score: 50 },
      gameid: uId,
    });
    updateFirebase("GameID", user.email, "total_wins", 1);
    updateFirebase("GameID", user.email, "total_games_played_by", "");
    updateFirebase("GameID", "ping-pong", "total_games", 1);
  }, [user.email, uId]);

  return (
    <>
      <div className="winning-background">
        <div className="winner-name-div">
          <p className="winner-name"> You Won</p>
        </div>
        <div className="winning-screen-btn">
          <Button
            onClick={() => props.parentCallback("multiplayer")}
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

export default WinningScreen;
