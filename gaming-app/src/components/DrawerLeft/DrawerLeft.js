import Notification from "components/Notification/Notification";
import { onDisconnect, ref } from "firebase/database";
import React, { useEffect } from "react";
import { updateFireBase } from "utils/firebaseSetup/firebaseFunctions";
import { db } from "utils/firebaseSetup/FirebaseSetup";
import { getSessionStorage } from "utils/Storage/SessionStorage";

function DrawerLeft() {
  let myUser = JSON.parse(getSessionStorage("user"));
  myUser = myUser.email.replace(/[^a-zA-Z/\d]/g, "");

  //-Keeps a tab of users availability on dashboard
  useEffect(() => {
    updateFireBase("UserList", myUser, "isOnline", true);
    onDisconnect(ref(db, `UserList/${myUser}/isOnline`)).set(false);
  }, [myUser]);

  return (
    <div>
      <Notification />
    </div>
  );
}

export default DrawerLeft;
