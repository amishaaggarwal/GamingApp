import { Button } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { child, onValue, push, ref } from "firebase/database";
import React, { useContext, useEffect, useState } from "react";
import Modal from "react-modal";
import {
  readFireBase,
  updateFireBase,
} from "utils/firebaseSetup/firebaseFunctions";
import { db, gameListRef } from "utils/firebaseSetup/FirebaseSetup";
import {
  getSessionStorage,
  removeFromSession,
  setSessionStorage,
} from "utils/Storage/SessionStorage";
import { toast } from "react-toastify";
import "./UserList.scss";
import { Navigate } from "react-router-dom";
import { toMultiplayer } from "App";

function UserList() {
  const [activeUsers, setActiveUsers] = useState({});
  const myUser = JSON.parse(getSessionStorage("user"));
  const [open, setOpen] = useState(false);
  const [requestId, setRequestId] = useState("");
  const gameName = window.location.href.split("/").slice(-1)[0];
  const requestKey = getSessionStorage("sessionId");
  const { isMulti, setIsmulti } = useContext(toMultiplayer);

  //-Redirects to multiplayer at senders side
  useEffect(() => {
    onValue(ref(db, `Invites/${requestKey}`), (data) => {
      const request = data.val();
      console.log(request, requestKey);
      if (
        request &&
        request.requestAccept &&
        request.request_status === "accept" &&
        request.from.email === myUser.email
      ) {
        setIsmulti(true);
        <Navigate to={`dashboard/${request.game}`} />;
      }
    });
  }, [requestKey, myUser.email, requestId, setIsmulti]);

  //-opens lost modal
  const openModal = () => {
    setOpen(true);
  };

  //-closes lose modal
  const closeModal = () => {
    setOpen(false);
  };

  //-Listens to denied requests
  useEffect(() => {
    onValue(ref(db, `Invites/${requestKey}`), (data) => {
      const invite = data.val();

      if (
        invite &&
        invite.requestId === requestKey &&
        invite.from.email === myUser.email &&
        invite.request_status === "reject"
      ) {
        toast.warn(`${invite.to.email} denied your game request!`, {
          theme: "dark",
        });
        updateFireBase("Invites", requestId, "request_status", "expire");
        closeModal();
      }
    });
  }, [myUser.email, requestKey, requestId]);

  //-Expires sent request
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (requestId) {
        readFireBase("Invites", `${requestId}/to`).then((res) => {
          console.log("noti", res);
          updateFireBase("UserList", res.to.email, "invite_expire", requestId);
        });
        updateFireBase("Invites", requestId, "request_status", "expire");
        // updateFireBase("Invites", requestId, "to", "");
        removeFromSession("sessionId");
      }
    }, 60000);
    return () => {
      clearTimeout(timeout);
    };
  }, [requestId]);

  //-Checks active users and displays
  useEffect(() => {
    let active = [];
    onValue(ref(db, `UserList/`), (data) => {
      let dataArray = Object.keys(data.val()).map((key) => [
        key,
        data.val()[key],
      ]);
      dataArray.forEach((e) => {
        e[1].isOnline === true &&
          e[1].email !== myUser.email &&
          active.push({
            name: e[1].name,
            email: e[1].email,
            dp: e[1].dp,
          });
      });
      setActiveUsers(active);
    });

    return () => {
      setActiveUsers({});
    };
  }, [myUser.email]);

  //-sends request and updates firebase and stores key in session
  const sendRequest = (actUserEmail, actUserName) => {
    let loc = window.location.href.split("/").slice(-1)[0];
    if (loc !== "dashboard") {
      const newKey = push(child(gameListRef, "GameSession")).key;
      let key = newKey.substring(1);
      let p_data = { email: actUserEmail, name: actUserName };

      setRequestId(key);
      setSessionStorage("sessionId", key);
      updateFireBase("Invites", key, "request_status", "pending");
      updateFireBase("Invites", key, "from", myUser);
      updateFireBase("Invites", key, "to", p_data);
      updateFireBase("Invites", key, "game", gameName);
      updateFireBase("Invites", key, "requestAccept", false);

      updateFireBase("Invites", key, "requestId", key);
      updateFireBase("UserList", actUserEmail, "invite_add", key);
      openModal();
    }
  };

  //-Cancels request and updates firebase
  const cancelRequest = () => {
    updateFireBase("Invites", requestId, "request_status", "cancel");
    updateFireBase("Invites", requestId, "from", myUser.email);
    updateFireBase("Invites", requestId, "to", "");

    closeModal();
  };

  return (
    <>
      <Modal
        isOpen={open}
        className="request-cancel"
        overlayClassName="modal-overlay"
      >
        <Button
          className="cancel-btn"
          variant="contained"
          onClick={() => cancelRequest()}
        >
          Cancel Request
        </Button>
      </Modal>
      <List
        dense
        sx={{
          width: "100%",
          bgcolor: "#252d38",
          color: "#B9EFA4",
        }}
        className="userlist"
      >
        <ListItem disablePadding>
          <ListItemButton>
            <h3>Active Users</h3>
          </ListItemButton>
        </ListItem>
        {activeUsers &&
          Object.values(activeUsers).map((actUser, i) => {
            const labelId = `checkbox-list-secondary-label-${actUser}`;
            return (
              <ListItem key={i} disablePadding>
                <ListItemButton
                  onClick={() => sendRequest(actUser.email, actUser.name)}
                >
                  <ListItemAvatar>
                    <Avatar
                      alt={`Avatar n°${actUser.name + 1}`}
                      src={`${actUser.dp}`}
                    />
                  </ListItemAvatar>
                  <ListItemText id={labelId} primary={` ${actUser.name}`} />
                </ListItemButton>
              </ListItem>
            );
          })}
      </List>
    </>
  );
}

export default UserList;
