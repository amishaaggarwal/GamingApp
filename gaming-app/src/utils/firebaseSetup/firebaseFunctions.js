import { child, get, onValue, ref, update } from "firebase/database";
import { db } from "./FirebaseSetup";


//-function for onvalue
export const onValueFirebase = async (endpoint, path) => {
  let data;
  console.log("in func");
  onValue(ref(db, `${endpoint}/${path}`), (res) => {
    data=res.val();
  });
  return await data;
}

//-function for reading firebase data
export const readFireBase = async (endpoint, path) => {
  const snapshot = await get(child(ref(db), `${endpoint}/${path}`));
  return snapshot.val();
};

//-function for updating firebase data
export const updateFireBase = (endpoint, newKey, keys, value) => {
  switch (endpoint) {
    case "GameSession":
      switch (keys) {
        case "gamestate":
          update(ref(db, `${endpoint}/${newKey}`), { gamestate: value });
          break;
        case "current":
          update(ref(db, `${endpoint}/${newKey}`), { current: value });
          break;
        case "players":
          update(ref(db, `${endpoint}/${newKey}`), { players: value });
          break;
        case "moveNow":
          update(ref(db, `${endpoint}/${newKey}`), { moveNow: value });
          break;
        case "lastMove":
          update(ref(db, `${endpoint}/${newKey}`), { lastMove: value });
          break;
        case "winner":
          update(ref(db, `${endpoint}/${newKey}`), { winner: value });
          break;
        case "count":
          update(ref(db, `${endpoint}/${newKey}`), { count: value });
          break;
        case "rst":
          update(ref(db, `${endpoint}/${newKey}`), { count: 9, winner: "" });
          break;
        default:
          break;
      }
      break;
    case "UserList":
      newKey = newKey.replace(/[^a-zA-Z/\d]/g, "");
      switch (keys) {
        case "name":
          update(ref(db, `${endpoint}/${newKey}`), { name: value });
          break;
        case "isOnline":
          update(ref(db, `${endpoint}/${newKey}`), { isOnline: value });
          break;
        case "email":
          update(ref(db, `${endpoint}/${newKey}`), { email: value });
          break;
        case "dp":
          update(ref(db, `${endpoint}/${newKey}`), { dp: value });
          break;
        case "total_games":
          {
            let newval;
            readFireBase("UserList", `${newKey}/total_games`).then((res) => {
              newval = res ? parseInt(res) : 0;
              update(ref(db, `${endpoint}/${newKey}`), {
                total_games: newval + 1,
              });
            });
          }
          break;
        case "scoreCredit":
          {
            let newval = 0;
            readFireBase("UserList", `${newKey}/totalScore`).then((res) => {
              newval = res ? parseInt(res) : 0;
              update(ref(db, `${endpoint}/${newKey}`), {
                totalScore: newval + value,
              });
            });
            updateFireBase("GameID", newKey, "total_wins", 1);
          }
          break;
        case "invite_expire":
          {
            let newval;
            readFireBase("UserList", `${newKey}/invite_id`).then((res) => {
              newval = res ? res : [];
              newval = newval.filter((f)=> {
                return f !== value;
              });

              update(ref(db, `${endpoint}/${newKey}`), {
                invite_id: newval,
              });
            });
          }
          break;
        case "invite_add":
          {
            let newval;
            readFireBase("UserList", `${newKey}/invite_id`).then((res) => {
              newval = res ? res : [];
              newval.push(value);
              update(ref(db, `${endpoint}/${newKey}`), {
                invite_id: newval,
              });
            });
          }
          break;
        default:
          break;
      }
      break;
    case "GameID":
      switch (keys) {
        case "gameSessionList":
          {
            let newval;
            readFireBase("GameID", `tic-tac/users/${newKey}/gameSessions`).then(
              (res) => {
                newval = res ? res : {};
                if (value.gameid in newval) {
                  let val = newval[value.gameid];
                  val.push(value.obj);
                  newval[value.gameid] = val;
                } else {
                  newval[value.gameid] = [value.obj];
                }
                update(ref(db, `${endpoint}/tic-tac/users/${newKey}`), {
                  gameSessions: newval,
                });
              }
            );
          }
          break;
        case "total_wins":
          newKey = newKey.replace(/[^a-zA-Z/\d]/g, "");
          readFireBase("GameID", `tic-tac/users/${newKey}/total_wins`).then(
            (res) => {
              let newval = res ? parseInt(res) : 0;

              update(ref(db, `${endpoint}/tic-tac/users/${newKey}`), {
                total_wins: newval + 1,
              });
            }
          );

          break;
        case "total_games_played_by":
          {
            newKey = newKey.replace(/[^a-zA-Z/\d]/g, "");
            let newval;
            readFireBase(
              "GameID",
              `users/${newKey}/total_games_played_by`
            ).then((res) => {
              newval = res ? parseInt(res) : 0;
              update(ref(db, `${endpoint}/tic-tac/users/${newKey}`), {
                total_games_played_by: newval + 1,
              });
            });
          }
          break;
        case "total_games":
          newKey = newKey.replace(/[^a-zA-Z/\d]/g, "");
          readFireBase("GameID", `tic-tac/total_games`).then((res) => {
            let newval = res ? parseInt(res) : 0;
            update(ref(db, `${endpoint}/${newKey}`), {
              total_games: newval + 1,
            });
          });
          break;
        default:
          break;
      }
      break;
    case "Invites":
      {
        let req_id = newKey;
        switch (keys) {
          case "request_status":
            update(ref(db, `${endpoint}/${req_id}`), { request_status: value });
            break;
          case "from":
            update(ref(db, `${endpoint}/${req_id}`), { from: value });
            break;
          case "to":
            update(ref(db, `${endpoint}/${req_id}`), { to: value });
            break;
          case "game":
            update(ref(db, `${endpoint}/${req_id}`), { game: value });
            break;
          case "requestAccept":
            update(ref(db, `${endpoint}/${req_id}`), { requestAccept: value });
            break;
          case "requestId":
            update(ref(db, `${endpoint}/${req_id}`), { requestId: value });
            break;
          default:
            break;
        }
      }
      break;
    default:
      break;
  }
};
