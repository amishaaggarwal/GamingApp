import React, { useEffect, useState, useContext } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import { onValue, ref } from "firebase/database";
import { updateFireBase } from "utils/firebaseSetup/firebaseFunctions";
import { db } from "utils/firebaseSetup/FirebaseSetup";
import { getSessionStorage } from "utils/Storage/SessionStorage";
import { toMultiplayer } from 'App';


function Notification(props) {
 
  const [open, setOpen] = useState(false);
  const myUser = JSON.parse(getSessionStorage("user"));
  const [requestId, setRequestId] = useState("");
  const [sender, setSender] = useState("");
  const [game, setGame] = useState("");
  const requestKey = getSessionStorage("sessionId");
  const {isMulti, setIsmulti} = useContext(toMultiplayer);

  useEffect(() => {
    onValue(ref(db, `Invites`), (data) => {
      const request = data.val();

      request &&
        Object.values(request).forEach((invite, i) => {
      
          if (
            (invite.requestId === requestKey && (invite.to === myUser.email ||
              invite.from === myUser.email)) &&
            invite.request_status === "accept"
          ) {
            console.log('asfc');
            props.parentCallback("multiplayer");
            setIsmulti(true);
          }

          else if (

            invite.to === myUser.email &&
            invite.request_status === "pending"
          ) {
            setOpen(true);
            setGame(invite.game);
            setSender(invite.from);
            setRequestId(invite.requestId);
          }
        });
    });
  }, [myUser, requestId, isMulti, setIsmulti, requestKey, props]);

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
