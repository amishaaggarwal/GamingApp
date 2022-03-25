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
import { updateFirebase } from "Games/Ping-Pong/Firebase/updateFirebase";
import { db } from "Games/Ping-Pong/Firebase/firebaseconfig";
import {
  getFromSession,
  setInSession,
} from "Games/Ping-Pong/util/storage/sessionStorage";
import "./UserList.scss";

function UserList() {
  const [activeUsers, setActiveUsers] = useState({});
  const myUser = getFromSession("user");
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
      console.log(data.val());
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
      console.log(requestId);
      if (requestId) {
        updateFirebase("Invites", requestId, "request_status", "expire");
        updateFirebase("Invites", requestId, "to", "");
        closeModal();
      }
    }, 60000);
    return () => {
      clearTimeout(timeout);
    };
  }, [requestId]);

  const sendRequest = (actUserEmail) => {
    const newKey = push(child(ref, "GameSession")).key;
    let key = newKey.substring(1);
    setRequestId(key);
    setInSession("sessionId", key);
    updateFirebase("Invites", key, "request_status", "pending");
    updateFirebase("Invites", key, "from", myUser);
    updateFirebase("Invites", key, "to", actUserEmail);
    updateFirebase("Invites", key, "game", "tic-tac");
    updateFirebase("Invites", key, "requestId", key);

    openModal();
  };

  const cancelRequest = () => {
    console.log(requestId);
    updateFirebase("Invites", requestId, "request_status", "cancel");
    updateFirebase("Invites", requestId, "from", myUser);
    updateFirebase("Invites", requestId, "to", "");
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
            console.log(actUser);
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
