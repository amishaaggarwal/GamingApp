import { ref, update } from "firebase/database";
import { db } from "Games/Ping-Pong/Firebase/firebaseconfig.js";
import { child, get } from "firebase/database";

export const readFirebase = async (endpoint, path) => {
  const snapshot = await get(child(ref(db), `${endpoint}/${path}`));
  return snapshot.val();
};

export const updateFirebase = (endpoint, newId, keys, value) => {
  switch (endpoint) {
    case "Game":
      switch (keys) {
        case "ballX":
          update(ref(db, `${endpoint}/${newId}/gamestate/ball`), {
            x: value,
          });
          break;
        case "ballY":
          update(ref(db, `${endpoint}/${newId}/gamestate/ball`), {
            y: value,
          });
          break;
        case "player1_score":
          update(ref(db, `${endpoint}/${newId}/gamestate/score`), {
            player1_score: value,
          });
          break;
        case "player2_score":
          update(ref(db, `${endpoint}/${newId}/gamestate/score`), {
            player2_score: value,
          });
          break;
        case "PaddleY":
          update(ref(db, `${endpoint}/${newId}/gamestate/player1_paddle`), {
            y: value,
          });
          break;
        case "PaddleY2":
          update(ref(db, `${endpoint}/${newId}/gamestate/player2_paddle`), {
            y: value,
          });
          break;
        case "start":
          update(ref(db, `${endpoint}/${newId}`), {
            start: value,
          });
          break;
        case "winner":
          update(ref(db, `${endpoint}/${newId}`), {
            winner: value,
          });
          break;
        case "speedx":
          update(ref(db, `${endpoint}/${newId}/gamestate/ballspeed`), {
            x: value,
          });
          break;
        case "speedy":
          update(ref(db, `${endpoint}/${newId}/gamestate/ballspeed`), {
            y: value,
          });
          break;
        default: break;
      }
      break;

    case "Invites":
      {
        console.log("here");
        let req_id = newId;
        switch (keys) {
          case "request_status":
            console.log("here");
            update(ref(db, `${endpoint}/${req_id}`), {
              request_status: value,
            });
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
    case "GameID":
      console.log(newId);
      switch (keys) {
        case "gameSessionList":
          {
            let newval;
            newId = newId.replace(/[^a-zA-Z/\d]/g, "");
            readFirebase(
              "GameID",
              `ping-pong/users/${newId}/gameSessions`
            ).then((res) => {
              newval = res ? res : {};
              if (value.gameid in newval) {
                let val = newval[value.gameid];
                val.push(value.obj);
                newval[value.gameid] = val;
              } else {
                newval[value.gameid] = [value.obj];
              }
              update(ref(db, `${endpoint}/ping-pong/users/${newId}`), {
                gameSessions: newval,
              });
            });
          }
          break;
        case "total_wins":
          newId = newId.replace(/[^a-zA-Z/\d]/g, "");
          readFirebase("GameID", `ping-pong/users/${newId}/total_wins`).then(
            (res) => {
              let newval = res ? parseInt(res) : 0;

              update(ref(db, `${endpoint}/ping-pong/users/${newId}`), {
                total_wins: newval + 1,
              });
            }
          );

          break;
        case "total_games_played_by":
          {
            let newval;
            newId = newId.replace(/[^a-zA-Z/\d]/g, "");
            readFirebase("GameID", `users/${newId}/total_games_played_by`).then(
              (res) => {
                newval = res ? parseInt(res) : 0;
                update(ref(db, `${endpoint}/ping-pong/users/${newId}`), {
                  total_games_played_by: newval + 1,
                });
              }
            );
          }
          break;
        case "total_games":
          readFirebase("GameID", `ping-pong/total_games`).then((res) => {
            let newval = res ? parseInt(res) : 0;
            update(ref(db, `${endpoint}/${newId}`), {
              total_games: newval + 1,
            });
          });

          break;
        default:
          break;
      }
      break;
    case "UserList":
      console.log(newId);
      newId = newId.replace(/[^a-zA-Z/\d]/g, "");
      switch (keys) {
        case "name":
          update(ref(db, `${endpoint}/${newId}`), { name: value });
          break;
        case "isOnline":
          update(ref(db, `${endpoint}/${newId}`), { isOnline: value });
          break;
        case "email":
          update(ref(db, `${endpoint}/${newId}`), { email: value });
          break;
        case "dp":
          update(ref(db, `${endpoint}/${newId}`), { dp: value });
          break;
        case "total_games":
          {
            let newval;
            readFirebase("UserList", `${newId}/total_games`).then((res) => {
              newval = res ? parseInt(res) : 0;
              update(ref(db, `${endpoint}/${newId}`), {
                total_games: newval + 1,
              });
            });
          }
          break;
        case "scoreCredit":
          {
            let newval = 0;
            readFirebase("UserList", `${newId}/totalScore`).then((res) => {
              newval = res ? parseInt(res) : 0;
              update(ref(db, `${endpoint}/${newId}`), {
                totalScore: newval + 50,
              });
            });
          }
          break;
        default:
          break;
      }
  }
};

// export const updateuserList = (
//   userId,
//   newId,
//   score,
//   totalPlayedGames,
//   status,
//   player1_score,
//   player2_score
// ) => {
//   let playerData;

// readFirebase("UserList", userId).then((val) => {
//   playerData = val;

// })
//     let gameids_data = playerData.gameID ? playerData.gameID : {};

//     if (newId in gameids_data) {
//       let gi = gameids_data[newId];
//       gi.push({
//         score: [
//           Math.max(player1_score, player2_score),
//           Math.min(player1_score, player2_score),
//         ],
//         status: status,
//       });
//       gameids_data[newId] = gi;
//     } else {
//       gameids_data[newId] = [
//         {
//           score: [
//             Math.max(player1_score, player2_score),
//             Math.min(player1_score, player2_score),
//           ],
//           status: status,
//           game: "ping-pong",
//         },
//       ];
//     }

//     update(ref(db, `UserList/${userId}`), {
//       total_games: playerData.total_games ? playerData.total_games + 1 : 1,
//       gameID: gameids_data,
//       totalScore: playerData.score ? playerData.score + score : score,
//     });
//   });
// };
