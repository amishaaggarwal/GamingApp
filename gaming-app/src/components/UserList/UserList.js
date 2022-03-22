import { Button } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { child, onValue, push, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { updateFireBase } from "utils/firebaseSetup/firebaseFunctions";
import { db, gameListRef } from "utils/firebaseSetup/FirebaseSetup";
import {
  getSessionStorage,
  setSessionStorage
} from "utils/Storage/SessionStorage";
import "./UserList.scss";

function UserList() {
  const [activeUsers, setActiveUsers] = useState({});
  const myUser = getSessionStorage("user");
  const [open, setOpen] = useState(false);
  const [requestId, setRequestId] = useState("");

  //-opens lost modal
  const openModal = () => {
    setOpen(true);
  };

  //-closes lose modal
  const closeModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    let active = [];
    onValue(ref(db, `UserList/`), (data) => {
      let dataArray = Object.keys(data.val()).map((key) => [
        key,
        data.val()[key],
      ]);
      dataArray.forEach((e) => {
        e[1].isOnline === true &&
          e[1].email !== myUser &&
          active.push({
            name: e[1].name,
            email: e[1].email,
          });
      });
      setActiveUsers(active);
    });
  }, [myUser]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (requestId) {
        updateFireBase("Invites", requestId, "request_status", "expire");
        updateFireBase("Invites", requestId, "to", "");
        closeModal();
      }
    }, 60000);
    return () => {
      clearTimeout(timeout);
    };
  }, [requestId]);

  const sendRequest = (actUserEmail) => {
    const newKey = push(child(gameListRef, "GameSession")).key;
    let key = newKey.substring(1);
    setRequestId(key);
    setSessionStorage("sessionId", key);
    updateFireBase("Invites", key, "request_status", "pending");
    updateFireBase("Invites", key, "from", myUser);
    updateFireBase("Invites", key, "to", actUserEmail);
    updateFireBase("Invites", key, "game", "tic-tac");
    updateFireBase("Invites", key, "requestId", key);

    openModal();
  };

  const cancelRequest = () => {
    updateFireBase("Invites", requestId, "request_status", "cancel");
    updateFireBase("Invites", requestId, "from", myUser);
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
                <ListItemButton onClick={() => sendRequest(actUser.email)}>
                  <ListItemAvatar>
                    <Avatar
                      alt={`Avatar n°${actUser.name + 1}`}
                      src={`/static/images/avatar/${actUser.name + 1}.jpg`}
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
