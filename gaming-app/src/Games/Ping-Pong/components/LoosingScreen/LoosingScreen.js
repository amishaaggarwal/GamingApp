import Button from "@mui/material/Button";
import { updateFirebase } from "Games/Ping-Pong/Firebase/updateFirebase";
import React, { useEffect } from "react";
import { getSessionStorage } from "utils/Storage/SessionStorage";
import "./LoosingScreen.scss";

function LoosingScreen(props) {
  const user = JSON.parse(getSessionStorage("user"));
  const uId = getSessionStorage("singleplayGameId");

  useEffect(() => {
    updateFirebase("UserList", user.email, "total_games", 1);
    updateFirebase("GameID", user.email, "gameSessionList", {
      obj: { status: "lost", score: 0 },
      gameid: uId,
    });
    updateFirebase("GameID", user.email, "total_wins", 1);
    updateFirebase("GameID", user.email, "total_games_played_by", "");
    updateFirebase("GameID", "ping-pong", "total_games", 1);
  }, [props.mode, uId, user.email]);

  return (
    <>
      <div className="winning-background">
        <div className="winner-name-div">
          <p className="winner-name">you lost the game</p>
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

export default LoosingScreen;
