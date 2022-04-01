import { toMultiplayer } from "App";
import LoosingScreen from "Games/Ping-Pong/components/LoosingScreen/LoosingScreen";
import WinningScreen from "Games/Ping-Pong/components/WinningScreen/WinningScreen";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { uid } from "uid";
import { setSessionStorage } from "utils/Storage/SessionStorage";
import Multiplayer from "../../components/multiplayer/Multiplayer";
import Singleplayer from "../../components/singleplayer/Singleplayer";
import Startscreen from "../../components/Startscreen/Startscreen";
import "./Playground.scss";

function Playground() {
  const [toHere, setToHere] = useState("");
  const { isMulti, setIsmulti } = useContext(toMultiplayer);

  const handleMultiplayer = useCallback(() => {
    handleCallback("multiplayer");
    setIsmulti(false);
  }, [setIsmulti]);

  useEffect(() => {
    isMulti && handleMultiplayer();
  }, [isMulti, handleMultiplayer]);

  const switchMode = (param) => {
    switch (param) {
      case "singleplayer":
        setSessionStorage("singleplayGameId", uid());
        return <Singleplayer parentCallback={handleCallback} />;
      case "multiplayer":
        return <Multiplayer parentCallback={handleCallback} />;
      case "winning":
        return <WinningScreen parentCallback={handleCallback} />;
      case "loosing":
        return <LoosingScreen parentCallback={handleCallback} />;
      default:
        return <Startscreen parentCallback={handleCallback} />;
    }
  };

  const handleCallback = (childData) => {
    setToHere(childData);
  };

  return <div className="Playground">{switchMode(toHere)}</div>;
}

export default Playground;
