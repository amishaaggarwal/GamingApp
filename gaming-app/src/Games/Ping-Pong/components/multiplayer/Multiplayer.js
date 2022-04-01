import React, { useEffect, useState } from "react";
import Sketch from "react-p5";
import { onValue, ref, update } from "firebase/database";
import { db } from "Games/Ping-Pong/Firebase/firebaseconfig.js";
import { updateFirebase } from "Games/Ping-Pong/Firebase/updateFirebase.js";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getFromSession } from "Games/Ping-Pong/util/storage/sessionStorage";
import { ballHit } from "Games/Ping-Pong/util/ballHitPaddle";
import "./Multiplayer.scss";

function Multiplayer(props) {
  let wWidth = window.innerWidth;
  let wHeight = window.innerHeight;

  const user = JSON.parse(getFromSession("user"));

  const { state } = useLocation();

  const [startGame, setStartGame] = useState(false);
  const [player1_email, setPlayer1_Email] = useState("");
  const [player2_email, setPlayer2_Email] = useState("");
  const [player1_name, setPlayer1_Name] = useState("");
  const [player2_name, setPlayer2_Name] = useState("");
  const [ballX, setBallX] = useState(wWidth / 2);
  const [ballY, setBallY] = useState(wHeight / 2.15);
  const [PaddleY, setPaddleY] = useState(wHeight / 2.5);
  const [PaddleY2, setPaddleY2] = useState(wHeight / 2.5);
  const [player1_score, setPlayer1_Score] = useState(0);
  const [player2_score, setPlayer2_Score] = useState(0);
  const [isWinner, setWinner] = useState(null);
  const [speedx, setSpeedX] = useState(0);
  const [speedy, setSpeedY] = useState(0);
  const [p5Btn, setP5Btn] = useState({});
  const [themeType, setThemeType] = useState("light theme");
  const [startNexit, setStartNexit] = useState("start");
  const gameSessionId = getFromSession("sessionId");

  const navigate = useNavigate();

  let PaddleX;
  let PaddleX2;
  let dir = [1, -1];

  useEffect(() => {
    update(ref(db, `GameSession/${gameSessionId}`), {
      gamestate: {
        ball: {
          x: wWidth / 2,
          y: wHeight / 2.15,
        },
        player1_paddle: {
          y: wHeight / 2.5,
        },
        player2_paddle: {
          y: wHeight / 2.5,
        },
        score: {
          player1_score: 0,
          player2_score: 0,
        },
        ballspeed: {
          x: 0,
          y: 0,
        },
      },

      start: false,
      winner: "",
    });
    return () => {};
  }, [gameSessionId, wWidth, wHeight]);

  useEffect(() => {
    onValue(ref(db, `GameSession/${gameSessionId}`), (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      setPlayer1_Email(data.players.player1.email);
      setPlayer2_Email(data.players.player2.email);
      setPlayer1_Name(data.players.player1.name);
      setPlayer2_Name(data.players.player2.name);
      setStartGame(data.start);
      setWinner(data.winner);
      setBallX(data.gamestate.ball.x);
      setBallY(data.gamestate.ball.y);
      setPaddleY(data.gamestate.player1_paddle.y);
      setPaddleY2(data.gamestate.player2_paddle.y);
      setPlayer1_Score(data.gamestate.score.player1_score);
      setPlayer2_Score(data.gamestate.score.player2_score);
      setSpeedX(data.gamestate.ballspeed.x);
      setSpeedY(data.gamestate.ballspeed.y);
    });
  }, [gameSessionId]);

  const setup = (p) => {
    p.canvas = p.createCanvas(wWidth, wHeight);

    setP5Btn({
      ...p5Btn,
      startBtn: p.createButton(startNexit),
      themeBtn: p.createButton(themeType),
    });
  };

  const draw = (p) => {
    p.background("RGB(23, 76, 113)");

    PaddleX = wWidth / 20;
    PaddleX2 = wWidth / 1.067;

    ////////// borders
    p.strokeWeight(4);
    p.line(wWidth / 2, wHeight / 7.5, wWidth / 2, wHeight / 1.21); // middle line
    p.line(wWidth / 20, wHeight / 7.5, wWidth / 20, wHeight / 1.21); // left line
    p.line(wWidth / 1.05, wHeight / 7.5, wWidth / 1.05, wHeight / 1.21); //right line
    p.line(wWidth / 20, wHeight / 7.5, wWidth / 1.05, wHeight / 7.5); //upper line
    p.line(wWidth / 20, wHeight / 1.21, wWidth / 1.05, wHeight / 1.21); // bottom line
    p.strokeWeight(2);

    //////// updating ball position
    updateFirebase("GameSession", gameSessionId, "ballX", ballX + speedx);
    updateFirebase("GameSession", gameSessionId, "ballY", ballY + speedy);

    /////// themes
    if (themeType === "dark") {
      p.stroke(255);
    } else {
      p.stroke(0);
    }

    ////////////// texts on canvas
    let midc = p.color("RGB(23, 76, 113)");
    p.fill(midc);
    p.circle(wWidth / 2, wHeight / 2.15, wWidth / 10);

    p.textSize(wWidth / 25);
    p.fill(255, 255, 255);
    p.text("Ping Pong", wWidth / 2.4, wHeight / 12);

    p.textSize(wWidth / 45);
    p.fill(255, 255, 180);
    p.text(player1_name, wWidth / 15, wHeight / 19);

    p.textSize(wWidth / 45);
    p.fill(255, 255, 180);
    p.text(player2_name, wWidth / 1.4, wHeight / 19);

    p.textSize(wWidth / 45);
    p.fill(255, 255, 180);
    p.text(`score: ${player1_score}`, wWidth / 4.5, wHeight / 19);

    p.textSize(wWidth / 45);
    p.fill(255, 255, 180);
    p.text(`score: ${player2_score}`, wWidth / 1.15, wHeight / 19);

    //////////// ball
    let c = p.color(255, 204, 0);
    p.fill(c);
    p.ellipse(ballX, ballY, 20, 20);

    /////////////// ractangle paddle
    c = p.color(65);
    p.fill(c);
    p.rect(PaddleX, PaddleY, wWidth / 67, wHeight / 7.5);

    c = p.color(65);
    p.fill(c);
    p.rect(PaddleX2, PaddleY2, wWidth / 67, wHeight / 7.5);

    ///////////////// set winner
    if (player1_score === 10) {
      updateFirebase("GameSession", gameSessionId, "winner", {
        name: player1_name,
        email: player1_email,
      });
    } else if (player2_score === 10) {
      updateFirebase("GameSession", gameSessionId, "winner", {
        name: player2_name,
        email: player2_email,
      });
    }

    ////////////// boundary checks
    if (ballX >= wWidth / 1.05) {
      updateFirebase("GameSession", gameSessionId, "speedy", 0);
      updateFirebase("GameSession", gameSessionId, "ballX", wWidth / 2);
      updateFirebase("GameSession", gameSessionId, "ballY", wHeight / 2.15);
      updateFirebase(
        "GameSession",
        gameSessionId,
        "player1_score",
        player1_score + 1
      );
    }
    if (ballX <= wWidth / 20) {
      updateFirebase("GameSession", "speedy", 0);
      updateFirebase("GameSession", "ballX", wWidth / 2);
      updateFirebase("GameSession", gameSessionId, "ballY", wHeight / 2.15);
      updateFirebase(
        "GameSession",
        gameSessionId,
        "player2_score",
        player2_score + 1
      );
    }

    if (ballY > wHeight / 1.25) {
      updateFirebase("GameSession", gameSessionId, "ballY", ballY - 15);
      updateFirebase("GameSession", gameSessionId, "speedy", speedy * -1);
    }
    if (ballY < wHeight / 7) {
      updateFirebase("GameSession", gameSessionId, "ballY", ballY + 15);
      updateFirebase("GameSession", gameSessionId, "speedy", speedy * -1);
    }

    /////////// Controller:
    if (user.email === player1_email) {
      if (p.mouseIsPressed === true) {
        updateFirebase(
          "GameSession",
          gameSessionId,
          "PaddleY",
          Math.min(wHeight / 1.47, Math.max(wHeight / 6.9, p.mouseY))
        );
      } else {
        if (PaddleY - 15 >= wHeight / 7.1 && p.keyIsDown(p.UP_ARROW)) {
          updateFirebase("GameSession", gameSessionId, "PaddleY", PaddleY - 15);
        } else if (
          PaddleY + 15 <= wHeight / 1.47 &&
          p.keyIsDown(p.DOWN_ARROW)
        ) {
          updateFirebase("GameSession", gameSessionId, "PaddleY", PaddleY + 15);
        }
      }
    } else {
      if (p.mouseIsPressed === true) {
        updateFirebase(
          "GameSession",
          gameSessionId,
          "PaddleY2",
          Math.min(wHeight / 1.47, Math.max(wHeight / 6.9, p.mouseY))
        );
      } else {
        if (PaddleY2 - 15 >= wHeight / 7.1 && p.keyIsDown(p.UP_ARROW)) {
          updateFirebase(
            "GameSession",
            gameSessionId,
            "PaddleY2",
            PaddleY2 - 15
          );
        } else if (
          PaddleY2 + 15 <= wHeight / 1.47 &&
          p.keyIsDown(p.DOWN_ARROW)
        ) {
          updateFirebase(
            "GameSession",
            gameSessionId,
            "PaddleY2",
            PaddleY2 + 15
          );
        }
      }
    }

    ////////////////// ball hit on paddle case
    let hitright;
    let hitleft;

    hitright = ballHit(
      p,
      ballX,
      ballY,
      10,
      PaddleX2,
      PaddleY2,
      wWidth / 67,
      wHeight / 7.5
    );

    hitleft = ballHit(
      p,
      ballX,
      ballY,
      10,
      PaddleX,
      PaddleY,
      wWidth / 67,
      wHeight / 7.5
    );

    if (hitleft || hitright) {
      if (hitleft)
        updateFirebase("GameSession", gameSessionId, "ballX", ballX + 20);
      else updateFirebase("GameSession", gameSessionId, "ballX", ballX - 20);

      updateFirebase("GameSession", gameSessionId, "speedx", (speedx + 1) * -1);
      updateFirebase(
        "GameSession",
        gameSessionId,
        "speedy",
        dir[Math.round(Math.random())] * Math.random() * 10
      );
    }

    ////////// buttons styles

    p5Btn.startBtn.position(wWidth / 2.15, wHeight / 1.12);
    p5Btn.startBtn.addClass("multimode-btn");
    p5Btn.startBtn.mousePressed(start);

    p5Btn.themeBtn.position(wWidth / 1.22, wHeight / 1.12);
    p5Btn.themeBtn.addClass("multimode-btn");
    p5Btn.themeBtn.mousePressed(changeTheme);

    if (startGame) {
      setStartNexit("exit");
      p5Btn.startBtn.html("exit");
    }

    /////////////// check winner:
    checkWinner();
  };

  ////////// start btn event
  const start = () => {
    if (startNexit === "start") {
      if (player1_name && player2_name) {
        updateFirebase("GameSession", gameSessionId, "speedx", 11);
        updateFirebase("GameSession", gameSessionId, "speedy", 0);
        updateFirebase("GameSession", gameSessionId, "start", true);
        setStartNexit("exit");
        p5Btn.startBtn.html("exit");
      } else {
        toast.info("...waiting for opponent ", {
          position: "bottom-center",
          theme: "dark",
        });
      }
    } else {
      if (user.email === player1_email) {
        updateFirebase("GameSession", gameSessionId, "winner", {
          name: player2_name,
          email: player2_email,
        });
      } else {
        updateFirebase("GameSession", gameSessionId, "winner", {
          name: player1_name,
          email: player1_email,
        });
      }
      exitFromGameSession();
    }
  };

  /////// change theme event
  const changeTheme = () => {
    if (themeType === "dark") {
      setThemeType("light");
      p5Btn.themeBtn.html("light theme");
    } else {
      setThemeType("dark");
      p5Btn.themeBtn.html("dark theme");
    }
  };

  /////// exit game
  const exitFromGameSession = () => {
    navigate("/");
  };

  const checkWinner = () => {
    if (isWinner && isWinner.email === user.email) {
      console.log(isWinner);
      props.parentCallback("winning");
    } else if (isWinner) {
      console.log(isWinner);

      props.parentCallback("loosing");
    }
  };

  return (
    <div className="playing-page">
      <Sketch setup={setup} draw={draw}></Sketch>
    </div>
  );
}

export default Multiplayer;
