import MailIcon from "@mui/icons-material/Mail";
import { Fab, Stack } from "@mui/material";
import { toMultiplayer } from "App";
import DrawerLeft from "components/DrawerLeft/DrawerLeft";
import GameList from "components/GameList/GameList";
import GameSlider from "components/gameSlider/GameSlider";
import Header from "components/Header/Header";
import LeaderBoard from "components/LeaderBoard/LeaderBoard";
import Notification from "components/Notification/Notification";
import UserList from "components/UserList/UserList";
import React, { useContext, useEffect, useState } from "react";
import "./DashBoard.scss";


function DashBoard() {
  const [chooseGame, setchooseGame] = useState(false);
  // const value = { isMulti, setIsmulti };
  const { isMulti, setIsmulti } = useContext(toMultiplayer);

  useEffect(() => {
    if(isMulti) setchooseGame(isMulti);
  }, [chooseGame, isMulti])
  

  const fabStyle = {
    position: "fixed",
    bottom: 16,
    right: 16,
    backgroundColor: "#B9EFA4",
  };
  return (
    <>
      {/* <toMultiplayer.Provider value={value} > */}
      <DrawerLeft />
      <Notification />
      <Stack spacing={1} className="dashboard">
        <Header />
        <div direction="row" spacing={1} className="center-body">
          <GameSlider />
          <LeaderBoard />
        </div>
        <div direction="row" spacing={1} className="center-body">
          <UserList />
          <GameList thisOne={chooseGame} />
        </div>
        <Fab aria-label="mail" sx={fabStyle}>
          <MailIcon />
        </Fab>
      </Stack>
      {/* </toMultiplayer.Provider> */}
    </>
  );
}

export default DashBoard;
