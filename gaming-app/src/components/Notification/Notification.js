import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import { toMultiplayer } from "App";
import { onValue, ref } from "firebase/database";
import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { updateFireBase } from "utils/firebaseSetup/firebaseFunctions";
import { db } from "utils/firebaseSetup/FirebaseSetup";
import {
  getSessionStorage,
  setSessionStorage,
} from "utils/Storage/SessionStorage";

function Notification(props) {
  const [open, setOpen] = useState(false);
  const [reqData, setReqData] = useState({});
  const myUser = JSON.parse(getSessionStorage("user"));
  const [requestId, setRequestId] = useState("");
  const [sender, setSender] = useState("");
  const [game, setGame] = useState("");
  const requestKey = getSessionStorage("sessionId");
  const { isMulti, setIsmulti } = useContext(toMultiplayer);

  //-UseEffect to listen to any invites added to particular user
  useEffect(() => {
    let newKey = myUser.email;
    newKey = newKey.replace(/[^a-zA-Z/\d]/g, "");
    onValue(ref(db, `UserList/${newKey}/invite_id`), (snapshot) => {
      const data = snapshot.val();
      setRequestId(data);
    });
  }, [myUser.email]);

  //-Fetches entire invites data from firebase
  useEffect(() => {
    onValue(ref(db, `Invites/${requestId}`), (data) => {
      const request = data.val();
      setReqData(request);
    });
    return () => {
      setReqData([]);
    };
  }, [requestId]);

  useEffect(() => {
    if (requestId && reqData) {
      let invite = reqData[requestId];
      // console.log(invite.to.email === myUser.email);
      if (
        invite &&
        invite.to.email === myUser.email &&
        invite.request_status === "accept"
      ) {
        setSessionStorage("sessionId", invite.requestId);
        updateFireBase("Invites", requestKey, "requestAccept", true);
        updateFireBase("GameSession", requestKey, "players", {
          player1: invite.from,
          player2: invite.to,
        });
        setIsmulti(true);
      } else if (
        invite &&
        invite.to.email === myUser.email &&
        invite.request_status === "pending"
      ) {
        setOpen(true);
        setGame(invite.game);
        setSender(invite.from);
        setRequestId(invite.requestId);
      }
    }
  }, [reqData, requestKey, myUser.email, props, setIsmulti, requestId]);

  // useEffect(() => {
  //   reqData &&
  //     Object.values(reqData).forEach((invite, i) => {
  //       console.log(invite.to.email === myUser.email);
  //       if (
  //         ((invite.requestId === requestKey &&
  //           invite.from.email === myUser.email) ||
  //           invite.to.email === myUser.email) &&
  //         invite.request_status === "accept"
  //       ) {
  //         setSessionStorage("sessionId", invite.requestId);
  //         updateFireBase('Invites', requestKey, 'requestAccept', true);
  //         updateFireBase("GameSession", requestKey, "players", {
  //           player1: invite.from,
  //           player2: invite.to,
  //         });
  //         setIsmulti(true);
  //       } else if (
  //         invite.to.email === myUser.email &&
  //         invite.request_status === "pending"
  //       ) {
  //         setOpen(true);
  //         setGame(invite.game);
  //         setSender(invite.from);
  //         setRequestId(invite.requestId);

  //       }
  //     });
  // }, [reqData, requestKey, myUser.email, props, setIsmulti]);

  //-Expires the request after 1 min
  useEffect(() => {
    const timeout = setTimeout(() => {
      setOpen(false);
      if (requestId) {
        updateFireBase("Invites", requestId, "request_status", "expire");
      }
    }, 60000);
    return () => {
      clearTimeout(timeout);
    };
  }, [open, requestId]);

  const acceptRequest = () => {
    updateFireBase("Invites", requestId, "request_status", "accept");
    updateFireBase("Invites", requestId, "requestAccept", true);
    setSessionStorage("sessionId", requestId);
    setIsmulti(true);
    setOpen(false);
    <Navigate to={reqData.game} />;
  };

  //-Rejects requests
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
        autoHideDuration={60000}
        onClose={() => setOpen(false)}
        message={`${sender.email} invites you for ${game}`}
        action={action}
      />
    </>
  );
}

export default Notification;
