import { CROSS } from 'constants/game-constants';
import React from 'react';
import "./WinningScreen.scss";

function WinningScreen(props) {

  return (
    <div className="zoom-in">
      {props.winnerIs === CROSS ? props.multi.player1.name : props.multi.player2.name} Won!
    </div>
  )
}

export default WinningScreen;