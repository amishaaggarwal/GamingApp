import React, { useContext } from 'react'
import "./WinningScreen.scss";
import {PlayerContext} from 'index';
import { CROSS } from 'constants/game-constants';

function WinningScreen(props) {
  const play = useContext(PlayerContext);

  return props.multi ? (
    <div className="zoom-in">
      {props.winnerIs === CROSS ? props.multi.player1.name : props.multi.player2.name} Won!
    </div>
  ) : (
    <div className="zoom-in">
      {props.winnerIs === CROSS ? play.player1 : play.player2} Won!
    </div>
  );
}

export default WinningScreen