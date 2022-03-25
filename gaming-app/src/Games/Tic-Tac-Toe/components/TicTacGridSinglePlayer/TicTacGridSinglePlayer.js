import { Button, Stack } from "@mui/material";
import DrawScreen from "../../components/DrawScreen/DrawScreen";
import Squares from "../../components/Squares/Squares";
import WinningScreen from "../../components/WinningScreen/WinningScreen";
import { CROSS, ZERO } from "constants/game-constants";
import { CELL_OCCUPIED, NOT_YOUR_TURN } from "constants/notification-constants";
import { PlayerContext } from "index";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import Modal from "react-modal";
import { toast } from "react-toastify";
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
  x = 0;
Modal.setAppElement("#root");

function TicTacGrid(props) {
  const [emptyBlocks, setEmptyBlocks] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const [currentState, setCurrentState] = useState(initialState);
  const [moveNow, setMoveNow] = useState(CROSS);
  const [wins, setWins] = useState("");
  const [count, setCount] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [drawModalIsOpen, setDrawIsOpen] = useState(false);
  const play = useContext(PlayerContext);

  //-selects a random empty block
  const computerPlay = (empty) => {
    let i = Math.ceil(Math.random() * (empty.length - 1));
    // i = minimax(currentState, empty)[1];
    return empty[i];
  };

  // const minimax = (board, empty) => {
  //   let thisScore;
  //   let maxScore = -1;
  //   let bestMove = null;
  //   for (let i = 0; i < empty.length; i++) {
  //     let copy = board;
  //     copy[empty[i]] = ZERO;
  //     let emp = copy
  //       .map((square, index) => (square === "" ? index : null))
  //       .filter((val) => val !== null);
  //     thisScore = minimax(copy, emp)[0];
  //     if (thisScore >= maxScore) {
  //       maxScore = thisScore;
  //       bestMove = empty[i];
  //     }
  //   }
  //   return [maxScore, bestMove];
  // };

  //-checks for winning condition
  const checkWinner = useCallback((mygrid) => {
    for (let i = 0; i < winingState.length; i++) {
      const [a, b, c] = winingState[i];
      if (mygrid[a] && mygrid[a] === mygrid[b] && mygrid[a] === mygrid[c]) {
        won = mygrid[a];
        setWins(won);
        break;
      }
    }
    if (won !== "") {
      setConfetti(true);
      openModal();
    } else if (x === 8) {
      openDrawModal();
    }
  }, []);

  //-determines whos move is it
  const playMove = useCallback(
    (index) => {
      let mygrid = [...currentState];
      mygrid[index] = moveNow;
      checkWinner(mygrid);
      setCurrentState(mygrid);
      setMoveNow(moveNow === CROSS ? ZERO : CROSS);
      x = count;
      ++x;
      setCount(x);
    },
    [moveNow, count, checkWinner, currentState]
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

  //-updates the emptyBlocks array
  useEffect(() => {
    const empty = currentState
      .map((square, index) => (square === "" ? index : null))
      .filter((val) => val !== null);
    setEmptyBlocks(empty);
  }, [currentState]);

  //-computer move
  const ZeroPlay = useCallback(() => {
    if (won === "" && emptyBlocks.length > 0 && moveNow === ZERO) {
      playMove(computerPlay(emptyBlocks));
    }
  }, [emptyBlocks, moveNow, playMove]);

  //-adds a delay for computer's move
  useEffect(() => {
    const timeout = setTimeout(() => {
      ZeroPlay();
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [ZeroPlay, wins]);

  //-resets game
  const resetGame = () => {
    setCurrentState(initialState);
    x = 0;
    setCount(x);
    setMoveNow(CROSS);
    won = "";
    setWins(won);
    setEmptyBlocks([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  };

  //-opens winning modal
  const openModal = () => {
    setIsOpen(true);
  };

  //-closes winning modal
  const closeModal = () => {
    setConfetti(false);
    setIsOpen(false);
  };

  //-opens draw n lose modal
  const openDrawModal = () => {
    setDrawIsOpen(true);
  };

  //-closes draw n lose modal
  const closeDrawModal = () => {
    setDrawIsOpen(false);
  };

  //-resets n closes all modals when play again is clicked
  const playAgain = () => {
    closeModal();
    closeDrawModal();
    resetGame();
  };

  return (
    <div>
      <div>
        <span className="move-text">
          {moveNow === CROSS ? play.player1 : play.player2}, Your Move!
        </span>
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
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="winning-modal"
        overlayClassName="modal-overlay"
      >
        <WinningScreen winnerIs={won} />
        <Stack direction="row" spacing={2} className="button-row">
          <Button
            onClick={closeModal}
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
        <DrawScreen />
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
      {confetti && <Confetti />}
    </div>
  );
}

export default TicTacGrid;
