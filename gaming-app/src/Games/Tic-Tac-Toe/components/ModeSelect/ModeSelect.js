import { Box, Button, Stack } from "@mui/material";
import LeaderBoard from "../../components/LeaderBoard/LeaderBoard";
import UserList from "../../components/UserList/UserList";
import { onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { db } from "utils/firebaseSetup/FirebaseSetup";
import { getSessionStorage } from "utils/Storage/SessionStorage";
import "./ModeSelect.scss";

function ModeSelect(props) {
  const [open, setOpen] = useState(false);
  const [acceptRequest, setAcceptRequest] = useState(false);
  const myUser = getSessionStorage("user");
  const [requestId, setRequestId] = useState("");
  const [isRequestRejected, setRequestRejected] = useState(false);

  useEffect(() => {
    onValue(ref(db, `Invites`), (data) => {
      const request = data.val();

      request &&
        Object.values(request).map((invite, i) => {
          if (invite.request_status === "reject") {
            setRequestRejected(true);
          }
          if (
            invite.request_status === "accept" &&
            (invite.to === myUser || invite.from === myUser)
          ) {
            setAcceptRequest(true);
            setRequestId(invite.requestId);
          }
        });
    });

    return () => {
      setRequestId("");
      setAcceptRequest(false);
    };
  }, [myUser, requestId]);

  useEffect(() => {
    if (acceptRequest) props.parentCallback("ok");
    else if (isRequestRejected) {
      toast.error("Your invite rejected !", {
        theme: "dark",
        position: "top-right",
      });
    }
    return () => {
      setAcceptRequest(false);
      setRequestRejected(false);
    };
  }, [acceptRequest, isRequestRejected, props, requestId]);

  //-selects mode
  const changeMode = (mymode) => {
    switch (mymode) {
      case "single":
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
