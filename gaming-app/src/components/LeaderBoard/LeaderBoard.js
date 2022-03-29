import { Box, Stack } from "@mui/material";
import StarRateIcon from "@mui/icons-material/StarRate";
import "./LeaderBoard.scss";
import React, { useCallback, useEffect, useState } from "react";
import { readFireBase } from "utils/firebaseSetup/firebaseFunctions";
import pingPong from "../../constants/game-logos/ping-pong.jpeg";
import ticTac from "../../constants/game-logos/tic-tac.ico";
import LeaderBoardSkeleton from "./LeaderBoardSkeleton";
import { Tooltip } from "@mui/material";

function LeaderBoard() {
  const [leaderBoard, setLeaderBoard] = useState([]);
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
      readFireBase("UserList", ``).then((obj) => {
        Object.keys(obj).forEach((row, key) => {
          let games = {};

          readFireBase(`GameID/`);
          obj[row]["totalScore"] &&
            Object.values(obj[row]["gameID"]).forEach((u) => {
              u &&
                Object.values(u).forEach((o) => {
                  let data = {};
                  games[o.game] = {};
                  data["total"] = games[o.game].total
                    ? games[o.game].total + 1
                    : 1;
                  data["gname"] = o.game;
                  data["logo"] = logos[o.game];
                  games[o.game] = data;
                });
            });
          res.push([row, obj[row]["totalScore"], games]);
        });
      });
    } else if (loc === "dashboard") {
      let gameName = window.location.href.split("/").slice(-2)[1];
      readFireBase(`GameID`, `/${gameName}/users`).then((obj) => {
        console.log(obj);
        Object.keys(obj).forEach((row) => {
          let gameScore = obj[row].total_games_played_by,
            total = obj[row].total_wins * 50,
            u_data = {};
          readFireBase("UserList", `${row}`).then((data) => {
            u_data = data;
            console.log(u_data, gameScore, total);
            res.push([u_data, gameScore, total]);
          });
        });
      });
      res.sort((a, b)=> {
        return b[1] - a[1];
      });
      
      console.log(res);
    }

    console.log(loc !== "dashboard", res, res.length, typeof res);
    loc !== "dashboard"
      ? res.forEach((key) => {
          // obj[key[0]].totalScore = key[1];
          // obj[key[0]].total_games = key[2];
          order.push(key[0]);
        })
      : res.map(
          (d) => console.log(d)
          // key[0].games_played = Object.values(key[2]);
          // order.push(key[0]);
        );
    console.log(order);
    return order;
  }, [logos]);

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
