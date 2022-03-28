import { onDisconnect, ref } from "firebase/database";
import React, { useEffect } from "react";
import { updateFireBase } from "utils/firebaseSetup/firebaseFunctions";
import { db } from "utils/firebaseSetup/FirebaseSetup";
import { getSessionStorage } from "utils/Storage/SessionStorage";
import "./DrawerLeft.scss";

function DrawerLeft() {
  let myUser = JSON.parse(getSessionStorage("user"));
  myUser = myUser.email.replace(/[^a-zA-Z/\d]/g, "");
  useEffect(() => {
    updateFireBase("UserList", myUser, "isOnline", true);
    onDisconnect(ref(db, `UserList/${myUser}/isOnline`)).set(false);
  }, [myUser]);

  return <div></div>;
}

export default DrawerLeft;
