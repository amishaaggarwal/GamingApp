import { ref, update } from "firebase/database";
import { db } from "Games/Ping-Pong/Firebase/firebaseconfig.js";
import { child, get } from "firebase/database";

export const getExistingPlayerData = async (endpoint, path) => {
  const snapshot = await get(child(ref(db), `${endpoint}/${path}`));
  return snapshot.val();
};

export const updateFirebase = (endpoint, newId, keys, value) => {
    switch(endpoint) {
     case 'Game':
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
      }
      case "Invites":
        { console.log("here");
          let req_id = newId;
          switch (keys) {
            case "request_status":
              console.log("here");
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

export const updateuserList = (
  userId,
  newId,
  score,
  totalPlayedGames,
  status,
  player1_score,
  player2_score
) => {
  let playerData;

  getExistingPlayerData('UserList', userId).then((val) => {
    playerData = val;
    console.log(playerData);
    console.log(playerData);

    let gameids_data = playerData.gameID ? playerData.gameID : {};

    if (newId in gameids_data) {
      let gi = gameids_data[newId];
      gi.push({
        score: [
          Math.max(player1_score, player2_score),
          Math.min(player1_score, player2_score),
        ],
        status: status,
      });
      gameids_data[newId] = gi;
    } else {
      gameids_data[newId] = [
        {
          score: [
            Math.max(player1_score, player2_score),
            Math.min(player1_score, player2_score),
          ],
          status: status,
          game: "ping-pong",
        },
      ];
    }

    update(ref(db, `UserList/${userId}`), {
      total_games: playerData.total_games ? playerData.total_games + 1 : 1,
      gameID: gameids_data,
      totalScore: playerData.score ? playerData.score + score : score,
    });
  });
};
