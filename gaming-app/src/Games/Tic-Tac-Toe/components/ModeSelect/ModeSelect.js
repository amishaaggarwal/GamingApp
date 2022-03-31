import { Box, Button, Stack } from "@mui/material";
import LeaderBoard from "components/LeaderBoard/LeaderBoard";
import UserList from "components/UserList/UserList";
import { child, push } from "firebase/database";
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { gameListRef } from "utils/firebaseSetup/FirebaseSetup";
import {
  getSessionStorage,
  setSessionStorage
} from "utils/Storage/SessionStorage";
import { onValue, ref } from "firebase/database";
import { db } from "utils/firebaseSetup/FirebaseSetup";

//-Selects mode and sends invite
function ModeSelect(props) {

  const requestKey = getSessionStorage('sessionId');
  const myUser = JSON.parse(getSessionStorage('user'));

  const [open, setOpen] = useState(false);
//  useEffect(() => {
//    onValue(ref(db, `Invites/${requestKey}`), (data) => {
//      const request = data.val();
//      console.log(request.requestAccept);
//      if (request.requestAccept && (request.from.email === myUser.email || request.to.email === myUser.email)) {
//        console.log('here');
//         props.parentCallback("multiplayer");
//      }
//    });
//    return () => {};
//  }, [props, myUser.email, requestKey]);
  
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
