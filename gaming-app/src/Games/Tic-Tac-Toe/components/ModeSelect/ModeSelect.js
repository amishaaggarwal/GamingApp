import { Box, Button, Stack } from "@mui/material";
import LeaderBoard from "components/LeaderBoard/LeaderBoard";
import UserList from "components/UserList/UserList";
import { child, push } from "firebase/database";
import React, { useState } from "react";
import Modal from "react-modal";
import { gameListRef } from "utils/firebaseSetup/FirebaseSetup";
import {
  setSessionStorage
} from "utils/Storage/SessionStorage";

//-Selects mode and sends invite
function ModeSelect(props) {
  const [open, setOpen] = useState(false);

  //-selects mode
  const changeMode = (mymode) => {
    switch (mymode) {
      case "single":
        const newKey = push(child(gameListRef, "GameSession")).key;
        let key = newKey.substring(1);
        setSessionStorage("key", key);
        props.parentCallback("single-player");
        break;
      case "multi":
        openModal();
        break;
      default:
        props.parentCallback("/");
    }
  };

  //-opens lost modal
  const openModal = () => {
    setOpen(true);
  };

  //-closes lose modal
  const closeModal = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Stack direction="row" spacing={4}>
        <Stack
          sx={{ backgroundColor: "#C0C0C0", padding: "60px" }}
          spacing={2}
          className="mode-select"
        >
          <h1>Select Mode</h1>
          <Button onClick={() => changeMode("single")} variant="contained">
            Single Player
          </Button>
          <Button onClick={() => changeMode("multi")} variant="contained">
            Multi Player
          </Button>
        </Stack>
        <LeaderBoard />

        <Modal
          isOpen={open}
          onRequestClose={closeModal}
          className="winning-modal"
          overlayClassName="modal-overlay"
        >
          <UserList />
        </Modal>
      </Stack>
    </Box>
  );
}

export default ModeSelect;
