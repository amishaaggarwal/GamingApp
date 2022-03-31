import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import { toMultiplayer } from "App";
import { onValue, ref } from "firebase/database";
import React, { useContext, useEffect, useState } from "react";
import { updateFireBase } from "utils/firebaseSetup/firebaseFunctions";
import { db } from "utils/firebaseSetup/FirebaseSetup";
import { getSessionStorage, setSessionStorage } from "utils/Storage/SessionStorage";

function Notification(props) {
  const [open, setOpen] = useState(false);
  const [reqData, setReqData] = useState({});
  const myUser = JSON.parse(getSessionStorage("user"));
  const [requestId, setRequestId] = useState("");
  const [sender, setSender] = useState("");
  const [game, setGame] = useState("");
  const requestKey = getSessionStorage("sessionId");
  const { isMulti, setIsmulti } = useContext(toMultiplayer);

  useEffect(() => {
    onValue(ref(db, `Invites`), (data) => {
      const request = data.val();
      setReqData(request);
    });
    return () => {
      setReqData([]);
    };
  }, []);

  useEffect(() => {
    reqData &&
      Object.values(reqData).forEach((invite, i) => {
    
        console.log(invite.to.email === myUser.email);
        if (
          invite.requestId === requestKey &&
          (invite.to.email === myUser.email ||
            invite.from.email === myUser.email) &&
          invite.request_status === "accept"
        ) {
          setSessionStorage('sessionId', invite.requestId);
          // updateFireBase('Invites', requestKey, 'requestAccept', true);
          console.log("asfc");
          // props.parentCallback("multiplayer");
          updateFireBase("GameSession", requestKey, "players", {
            player1: invite.from,
            player2: invite.to,
          });
          setIsmulti(true);
        } else if (
          invite.to.email === myUser.email &&
          invite.request_status === "pending"
        ) {
          setOpen(true);
          setGame(invite.game);
          setSender(invite.from);
          setRequestId(invite.requestId);
        }
      });
   
  }, [reqData, requestKey, myUser.email, props, setIsmulti]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setOpen(false);
      if (requestId) {
        updateFireBase("Invites", requestId, "request_status", "expire");
        updateFireBase("Invites", requestId, "to", "");
      }
    }, 60000);
    return () => {
      clearTimeout(timeout);
    };
  }, [open, requestId]);

  const acceptRequest = () => {
    updateFireBase("Invites", requestId, "request_status", "accept");
    setOpen(false);
  };

  const rejectRequest = () => {
    updateFireBase("Invites", requestId, "request_status", "reject");
    updateFireBase("Invites", requestId, "to", "");
    setOpen(false);
  };

  const handleClose = () =>{
    setOpen(false);
  }

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
        onClose={() => setOpen(false)}
        message={`${sender.email} invites you for ${game}`}
        action={action}
      />
    </>
  );
}

export default Notification;
