import StarRateIcon from "@mui/icons-material/StarRate";
import { Box, Stack, Tooltip } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { readFireBase } from "utils/firebaseSetup/firebaseFunctions";
import pingPong from "../../constants/game-logos/ping-pong.jpeg";
import ticTac from "../../constants/game-logos/tic-tac.ico";
import "./LeaderBoard.scss";
import LeaderBoardSkeleton from "./LeaderBoardSkeleton";

function LeaderBoard() {
  const [leaderBoard, setLeaderBoard] = useState([]);
  const [userlist, setUserlist] = useState([]);
  const [gameid, setGameid] = useState([]);
  const [rankNo, setRankNo] = useState(null);
  const [logos, setLogos] = useState({
    "ping-pong": pingPong,
    "tic-tac": ticTac,
  });

  const identifyLevel = useCallback(() => {
    const order = [];
    let res = [];

    let loc = window.location.href.split("/").slice(-2)[0];

    //-Dashboard level
    if (loc !== "dashboard") {
      Object.keys(userlist).forEach((row, key) => {
        let games = {};
        Object.keys(gameid).forEach((Game) => {
          if (gameid[Game]["users"][`${row}`]) {
            let data = {};
            games[Game] = {};
            data["total"] =
              gameid[Game]["users"][`${row}`].total_games_played_by;
            data["gname"] = Game;
            data["logo"] = logos[Game];
            games[Game] = data;
          }
        });

        Object.keys(games).length > 0 &&
          res.push([userlist[row], userlist[row]["totalScore"], games]);
      });
    } else if (loc === "dashboard") {
      //-game level
      let gameName = window.location.href.split("/").slice(-2)[1];

      Object.keys(userlist).forEach((row) => {
        if (
          gameid[gameName] &&
          gameid[gameName].users &&
          gameid[gameName].users[row]
        ) {
          let gameScore = gameid[gameName].users[row].total_wins * 50,
            total = gameid[gameName].users[row].total_games_played_by,
            u_data = userlist[row];
          res.push([u_data, gameScore, total]);
        }
      });
    }

    res.sort((a, b) => {
      return b[1] - a[1];
    });
    if (loc !== "dashboard") {
      res.forEach((d) => {
        d[0].games_played = Object.values(d[2]);
        order.push(d[0]);
      });
    } else {
      res.forEach((d) => {
        d[0].totalScore = d[1];
        d[0].total_games = d[2];
        order.push(d[0]);
      });
    }
    return order;
  }, [logos, userlist, gameid]);

  useEffect(() => {
    readFireBase("UserList", "").then((res) => {
      setUserlist(res);
    });
    readFireBase("GameID", "").then((res) => {
      setGameid(res);
    });
  }, []);

  useEffect(() => {
    setLeaderBoard(identifyLevel());
  }, [identifyLevel]);

  return (
    <Box className="leaderboard">
      <div className="lb-header">Leaderboard</div>
      {leaderBoard.length > 0 ? (
        <Stack spacing={2} sx={{ padding: "6px" }}>
          {leaderBoard.map((lb, i) => (
            <Stack spacing={1} direction="row" key={i}>
              <div
                key={i}
                className="tb-row"
                onMouseOver={() => setRankNo(i)}
                onMouseOut={() => setRankNo(null)}
              >
                <div className="tb-row-1">
                  <Box className="tb-cell">
                    <div className="squares">{i + 1}.</div>
                  </Box>
                  <Box className="tb-cell">
                    <div>
                      <img src={lb.dp} alt="display" width={30} />
                    </div>
                  </Box>
                  <Box sx={{ color: "#f0bf00" }} className="tb-cell">
                    {lb.name}
                  </Box>
                  <Box
                    sx={{
                      color: "#f0bf00",
                    }}
                    className="tb-cell"
                  >
                    {lb.totalScore}
                  </Box>
                  <Box className="tb-cell">
                    <StarRateIcon sx={{ color: "#f0bf00" }} />
                  </Box>
                </div>
                <div className={i === rankNo ? "tb-row-2" : "hide"}>
                  {lb.games_played && (
                    <div className="games-played">
                      <div className="text-tpg">Games played:</div>
                      <div className="games-desc">
                        {lb.games_played.map((row, i) => (
                          <Tooltip placement="top" key={i} title={row.gname}>
                            <Stack direction="row">
                              <img
                                src={row.logo}
                                width={13}
                                height={13}
                                className="game-logo"
                                alt={row.gname}
                              />
                              <span className="value-tpg"> :{row.total}</span>
                            </Stack>
                          </Tooltip>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="total-played-games">
                    <p className="text-tpg">Total games played: </p>
                    <p className="value-tpg">{lb.total_games}</p>
                  </div>
                </div>
              </div>
            </Stack>
          ))}
        </Stack>
      ) : (
        <LeaderBoardSkeleton />
      )}
    </Box>
  );
}

export default LeaderBoard;
