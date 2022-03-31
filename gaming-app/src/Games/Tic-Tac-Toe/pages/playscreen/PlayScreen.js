import { toMultiplayer } from "App";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  readFireBase,
  updateFireBase,
} from "utils/firebaseSetup/firebaseFunctions";
import { getSessionStorage } from "utils/Storage/SessionStorage";
import Footer from "../../components/Footer/Footer";
import ModeSelect from "../../components/ModeSelect/ModeSelect";
import Multiplayer from "../../components/Multiplayer/Multiplayer";
import TicTacGridSinglePlayer from "../../components/TicTacGridSinglePlayer/TicTacGridSinglePlayer";

import "./Playscreen.scss";

function PlayScreen() {
  const [childData, setChildData] = useState("");
  const sessionId = getSessionStorage("sessionId");
  const { isMulti, setIsmulti } = useContext(toMultiplayer);

  //-Parent Callback to conditionally render pages
  const switchScreen = (switchTo) => {
    switch (switchTo) {
      case "single-player":
        return <TicTacGridSinglePlayer parentCallback={handleCallback} />;
      case "multiplayer":
        return <Multiplayer parentCallback={handleCallback} />;
      default:
        return <ModeSelect parentCallback={handleCallback} />;
    }
  };

  const handleMultiplayer = useCallback(() => {
    handleCallback("multiplayer");
    setIsmulti(false);
    // readFireBase("Invites", `${sessionId}`).then((res) => {
    //   let players = {
    //     player1: res.from,
    //     player2: res.to,
    //   };
    //   updateFireBase("GameSession", sessionId, "players", players);
    // });
  }, [setIsmulti]);

  useEffect(() => {
    console.log(isMulti);
    isMulti && handleMultiplayer();
  }, [isMulti, handleMultiplayer]);

  const handleCallback = (childData) => {
    setChildData(childData);
  };

  return (
    <div className="playscreen">
      <h1 className="heading">Tic Tac Toe</h1>
      {switchScreen(childData)}
      <Footer />
    </div>
  );
}

export default PlayScreen;
