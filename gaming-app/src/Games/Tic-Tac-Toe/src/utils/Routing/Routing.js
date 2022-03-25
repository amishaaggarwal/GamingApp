import Multiplayer from "components/Multiplayer/Multiplayer";
import TicTacGridSinglePlayer from "components/TicTacGridSinglePlayer/TicTacGridSinglePlayer";
import DashBoard from "pages/DashBoard/DashBoard";
import ModeSelect from "components/ModeSelect/ModeSelect";
import PlayScreen from "pages/playscreen/PlayScreen";
import StartScreen from "pages/StartScreen/StartScreen";
import React from "react";
import { Routes, Route } from "react-router-dom";

function Routing() {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashBoard />}/>
      <Route path="/" element={<PlayScreen />}>
        <Route path="/" element={<ModeSelect />} />
        <Route
          path="tic-tac-toe-single-player"
          element={<TicTacGridSinglePlayer />}
        />
        <Route path="tic-tac-toe/:newKey" element={<Multiplayer />} />
        <Route path=":newKey" element={<StartScreen />} />
      </Route>
    </Routes>
  );
}

export default Routing;
