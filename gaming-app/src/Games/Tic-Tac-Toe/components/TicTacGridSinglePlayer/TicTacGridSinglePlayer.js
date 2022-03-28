import { Button, Stack } from "@mui/material";
import { CROSS, ZERO } from "constants/game-constants";
import { CELL_OCCUPIED, NOT_YOUR_TURN } from "constants/notification-constants";
import { onValue, ref } from "firebase/database";
import { DRAW, LOST } from "Games/Tic-Tac-Toe/constants/notification-constants";
import { updateFireBase } from "Games/Tic-Tac-Toe/utils/firebaseSetup/firebaseFunctions";
import React, { useCallback, useEffect, useState } from "react";
import Confetti from "react-confetti";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { db } from "utils/firebaseSetup/FirebaseSetup";
import { getSessionStorage } from "utils/Storage/SessionStorage";
import DrawScreen from "../../components/DrawScreen/DrawScreen";
import Squares from "../../components/Squares/Squares";
import WinningScreen from "../../components/WinningScreen/WinningScreen";
import "./TicTacGrid.scss";

const initialState = ["", "", "", "", "", "", "", "", ""];
const winingState = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [2, 4, 6],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
];
let won = "",
  x = initialState.length,
  play = {
    player1: { name: "player1", email: "NAN" },
    player2: { name: "Computer", email: "NAN" },
  };
Modal.setAppElement("#root");

function TicTacGridSinglePlayer(props) {
  const [currentState, setCurrentState] = useState(initialState);
  const [moveNow, setMoveNow] = useState(CROSS);
  const [wins, setWins] = useState("");
  const [count, setCount] = useState(x);
  const [confetti, setConfetti] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [drawModalIsOpen, setDrawIsOpen] = useState(false);
  const key = getSessionStorage("key");
  const [lostModalIsOpen, setLostModalIsOpen] = useState(false);
  const myUser = JSON.parse(getSessionStorage("user"));
  const [users, setUsers] = useState(play);

  //- set initialvalues on firebase
  useEffect(() => {
    play.player1.name = myUser.name;
    play.player1.email = myUser.email;
    updateFireBase("GameSession", key, "players", play);
    updateFireBase("GameSession", key, "gamestate", initialState);
    updateFireBase("GameSession", key, "current", CROSS);
    updateFireBase("GameSession", key, "winner", "");
    updateFireBase("GameSession", key, "lastMove", {
      position: -1,
      id: "",
    });
  }, [key, myUser.email, myUser.name]);

  //-opens winner modal
  const openWinModal = useCallback(() => {
    if (wins !== "") {
      setConfetti(true);
      setIsOpen(true);
    }
  }, [wins]);

  //-closes winner modal
  const closeWinModal = () => {
    setConfetti(false);
    setIsOpen(false);
  };

  //-opens draw modal
  const openDrawModal = useCallback(() => {
    wins === "" && count === 0 && setDrawIsOpen(true);
  }, [wins, count]);

  //-closes draw modal
  const closeDrawModal = () => {
    setDrawIsOpen(false);
  };

  //-opens lost modal
  const openLoseModal = useCallback(() => {
    wins !== "" && setLostModalIsOpen(true);
  }, [wins]);

  //-closes lose modal
  const closeLoseModal = () => {
    setLostModalIsOpen(false);
  };

  //-opens appropriate modal if we have winner,loser or draw
  const showWinner = useCallback(
    (wins) => {
      if (wins !== "") {
        if (
          myUser.email !== (wins === CROSS ? users.player1.email : "Computer")
        ) {
          openLoseModal();
          updateFireBase("UserList", users.player1.email, "scoreCredit", 0);
          updateFireBase("GameID", users.player1.email, "gameSessionList", {
            obj: { status: "lost", score: 0 },
            gameid: key,
          });
        } else {
          openWinModal();
          updateFireBase("UserList", users.player1.email, "scoreCredit", 50);
          updateFireBase("GameID", users.player1.email, "gameSessionList", {
            obj: { status: "won", score: 1 },
            gameid: key,
          });
          
        }
      } else if (count === 0) {
        updateFireBase("GameSession", key, "draw", true);
        openDrawModal();
        updateFireBase("UserList", users.player1.email, "scoreCredit", 0);
        updateFireBase("GameID", users.player1.email, "gameSessionList", {
          obj: { status: "draw", score: 0 },
          gameid: key,
        });
      }
    },
    [
      count,
      myUser,
      users.player1.email,
      key,
      openDrawModal,
      openWinModal,
      openLoseModal,
    ]
  );

  //-opens winner ,loser and draw modals
  useEffect(() => {
    showWinner(wins);
  }, [showWinner, wins]);

  //-updates all states on value change in firebase
  useEffect(() => {
    onValue(ref(db, `GameSession/${key}`), (snapshot) => {
      const data = snapshot.val();
      setWins(data.winner);
      setCurrentState(data.gamestate);
      setMoveNow(data.current);
      setUsers(data.players);
      setCount(data.count);
    });

    //cleanup function
    return () => {
      setCurrentState(initialState);
      setMoveNow(CROSS);
      setWins("");
      setUsers("");
      setCount(9);
    };
  }, [key, count]);

  //-selects a random empty block
  const computerPlay = (empty) => {
    let i = Math.ceil(Math.random() * (empty.length - 1));
    return empty[i];
  };

  //-checks if we have a winner by searching for winning conditions in the current grid
  const checkWinner = useCallback(
    (mygrid) => {
      for (let i = 0; i < winingState.length; i++) {
        const [a, b, c] = winingState[i];
        if (mygrid[a] && mygrid[a] === mygrid[b] && mygrid[a] === mygrid[c]) {
          won = mygrid[a];
          updateFireBase("GameSession", key, "winner", won);
          updateFireBase("UserList", users.player1.email, "total_games", 1);
          break;
        }
      }
    },
    [key, users.player1.email]
  );

  //-checks if the grid cell is empty
  const checkEmpty = (x) => {
    return x === "";
  };

  //-determines whos move is it
  const playMove = useCallback(
    (index) => {
      let mygrid = [...currentState];
      mygrid[index] = moveNow;
      let lastMove = {
        id: moveNow === CROSS ? users.player1.email : "computer",
        position: index,
      };
      let turn = moveNow === CROSS ? ZERO : CROSS;
      checkWinner(mygrid);
      updateFireBase("GameSession", key, "gamestate", mygrid);
      updateFireBase(
        "GameSession",
        key,
        "count",
        mygrid.filter(checkEmpty).length
      );

      updateFireBase("GameSession", key, "current", turn);
      updateFireBase("GameSession", key, "lastMove", lastMove);
    },
    [moveNow, currentState, key, checkWinner, users.player1.email]
  );

  //-updates currentState when square is clicked
  const squareClick = (index) => {
    if (currentState[index] !== "") {
      toast.error(CELL_OCCUPIED, {
        position: toast.POSITION.BOTTOM_LEFT,
        className: "dark-toast",
      });
    } else if (moveNow !== CROSS) {
      toast.error(NOT_YOUR_TURN, {
        position: toast.POSITION.BOTTOM_LEFT,
        className: "dark-toast",
      });
    } else if (wins === "") {
      playMove(index);
    }
  };

  //-computer move
  const ZeroPlay = useCallback(() => {
    let emptyBlocks = [];
    for (let i = 0; i < currentState.length; i++) {
      if (checkEmpty(currentState[i])) {
        emptyBlocks.push(i);
      }
    }
    if (wins === "" && emptyBlocks.length > 0 && moveNow === ZERO) {
      playMove(computerPlay(emptyBlocks));
    }
  }, [moveNow, playMove, currentState, wins]);

  //-adds a delay for computer's move
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (moveNow === ZERO && wins === "") {
        ZeroPlay();
      }
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [ZeroPlay, moveNow, wins]);

  //-loads page on reset game
  const loadOnWin = useCallback(() => {
    updateFireBase("GameSession", key, "rst", 0);
  }, [key]);

  //-loads page on reset game
  useEffect(() => {
    loadOnWin();
  }, [count, wins, loadOnWin]);

  //-resets game
  const resetGame = () => {
    loadOnWin();
    updateFireBase("GameSession", key, "current", CROSS);
    updateFireBase("GameSession", key, "gamestate", initialState);
  };

  //-resets n closes all modals when play again is clicked
  const playAgain = () => {
    resetGame();
    closeWinModal();
    closeDrawModal();
    closeLoseModal();
  };

  return (
    <div>
      <div>
        <span className="move-text">{moveNow === CROSS ?"Your Move!":"Computer's Move!"}</span>
      </div>
      <div className="tic-tac-grid">
        <div className="tic-tac-row ">
          <Squares
            mystyle="b-bottom b-right"
            mystate={currentState[0]}
            i={0}
            task={squareClick}
          />
          <Squares
            mystyle="b-bottom b-right"
            mystate={currentState[1]}
            i={1}
            task={squareClick}
          />
          <Squares
            mystyle="b-bottom"
            mystate={currentState[2]}
            i={2}
            task={squareClick}
          />
        </div>
        <div className="tic-tac-row">
          <Squares
            mystyle="b-bottom b-right"
            mystate={currentState[3]}
            i={3}
            task={squareClick}
          />
          <Squares
            mystyle="b-bottom b-right"
            mystate={currentState[4]}
            i={4}
            task={squareClick}
          />
          <Squares
            mystyle="b-bottom"
            mystate={currentState[5]}
            i={5}
            task={squareClick}
          />
        </div>
        <div className="tic-tac-row">
          <Squares
            mystyle="b-right"
            mystate={currentState[6]}
            i={6}
            task={squareClick}
          />
          <Squares
            mystyle="b-right"
            mystate={currentState[7]}
            i={7}
            task={squareClick}
          />
          <Squares mystate={currentState[8]} i={8} task={squareClick} />
        </div>

        <button onClick={resetGame} className="rst-button">
          Reset Game
        </button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeWinModal}
        className="winning-modal"
        overlayClassName="modal-overlay"
      >
        <WinningScreen winnerIs={won} multi={users} />
        <Stack direction="row" spacing={2} className="button-row">
          <Button
            onClick={closeWinModal}
            className="rst-button"
            sx={{ color: "black" }}
          >
            Close
          </Button>
          <Button
            onClick={playAgain}
            className="rst-button"
            sx={{ color: "black" }}
          >
            Play Again
          </Button>
        </Stack>
      </Modal>
      <Modal
        isOpen={drawModalIsOpen}
        onRequestClose={closeDrawModal}
        className="winning-modal"
        overlayClassName="modal-overlay"
      >
        <DrawScreen msg={DRAW} />
        <Stack direction="row" spacing={2} className="button-row">
          <Button
            onClick={closeDrawModal}
            className="rst-button"
            sx={{ color: "black" }}
          >
            Close
          </Button>
          <Button
            onClick={playAgain}
            className="rst-button"
            sx={{ color: "black" }}
          >
            Play Again!
          </Button>
        </Stack>
      </Modal>

      <Modal
        isOpen={lostModalIsOpen}
        onRequestClose={closeLoseModal}
        className="winning-modal"
        overlayClassName="modal-overlay"
      >
        <DrawScreen msg={LOST} />
        <Stack direction="row" spacing={2} className="button-row">
          <Button
            onClick={closeLoseModal}
            className="rst-button"
            sx={{ color: "black" }}
          >
            Close
          </Button>
          <Button
            onClick={playAgain}
            className="rst-button"
            sx={{ color: "black" }}
          >
            Play Again!
          </Button>
        </Stack>
      </Modal>
      {confetti && <Confetti />}
    </div>
  );
}

export default TicTacGridSinglePlayer;
