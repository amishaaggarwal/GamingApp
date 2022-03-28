import { onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { updateFirebase } from "Games/Ping-Pong/Firebase/updateFirebase";
import { db } from "Games/Ping-Pong/Firebase/firebaseconfig";
import { getFromSession } from "Games/Ping-Pong/util/storage/sessionStorage";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";

function Notification() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const myUser = getFromSession("user");
  const [requestId, setRequestId] = useState("");
  const [sender, setSender] = useState("");
  const [game, setGame] = useState("");

  useEffect(() => {
    onValue(ref(db, `Invites`), (data) => {
      const request = data.val();

      request &&
        Object.values(request).map((invite, i) => {
          
          if (invite.to === myUser && invite.request_status === "pending") {
            setOpen(true);
            setGame(invite.game);
            setSender(invite.from);
            setRequestId(invite.requestId);
          }
        });
    });
  }, [myUser, requestId]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setOpen(false);
      if (requestId) {
        updateFirebase("Invites", requestId, "request_status", "expire");
        updateFirebase("Invites", requestId, "to", "");
      }
    }, 60000);
    return () => {
      clearTimeout(timeout);
    };
  }, [open, requestId]);

  const acceptRequest = () => {
    updateFirebase("Invites", requestId, "request_status", "accept");
    navigate("/ok");
    setOpen(false);
  };

  const rejectRequest = () => {
    updateFirebase("Invites", requestId, "request_status", "reject");
    updateFirebase("Invites", requestId, "to", "");
    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <Button variant="contained" onClick={() => rejectRequest()}>
        Reject
      </Button>
      <Button variant="contained" onClick={() => acceptRequest()}>
        Accept
      </Button>
      <IconButton size="small" aria-label="close" color="inherit"></IconButton>
    </React.Fragment>
  );

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        message={`${sender} invites you for ${game}`}
        action={action}
      />
    </>
  );
}

export default Notification;
