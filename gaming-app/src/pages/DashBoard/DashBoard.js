import MailIcon from "@mui/icons-material/Mail";
import { Fab, Stack } from "@mui/material";
import DrawerLeft from "components/DrawerLeft/DrawerLeft";
import GameList from "components/GameList/GameList";
import GameSlider from "components/gameSlider/GameSlider";
import Header from "components/Header/Header";
import LeaderBoard from "components/LeaderBoard/LeaderBoard";
<<<<<<< HEAD
import MailIcon from "@mui/icons-material/Mail";
import React, { useContext, useState, useEffect } from "react";
import "./DashBoard.scss";
import UserList from "components/UserList/UserList";
import GameSlider from "components/gameSlider/GameSlider";
import Notification from "components/Notification/Notification";
import DrawerLeft from "components/DrawerLeft/DrawerLeft";
import { toMultiplayer } from "App";

// export const toMultiplayer = React.createContext({
//   isMulti: false,
//   setIsMulti: () => {}
// });
=======
import Notification from "components/Notification/Notification";
import UserList from "components/UserList/UserList";
import React from "react";
import "./DashBoard.scss";
>>>>>>> 7071b046f01d808e237e3964122354902f9c790d

function DashBoard() {
  const [chooseGame, setchooseGame] = useState(false);
  // const value = { isMulti, setIsmulti };
  const { isMulti, setIsmulti } = useContext(toMultiplayer);

  useEffect(() => {
    console.log(isMulti);
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
<<<<<<< HEAD
      {/* <toMultiplayer.Provider value={value} > */}
=======
>>>>>>> 7071b046f01d808e237e3964122354902f9c790d
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
