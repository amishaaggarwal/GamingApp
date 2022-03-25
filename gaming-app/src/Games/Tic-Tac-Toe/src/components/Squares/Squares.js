import { CROSS } from "constants/game-constants";
import React from "react";
import "./square.scss";

function Squares(props) {
  //-adds styling acc to zero n  cross
  let styles = "square " + props.mystyle;
  styles += props.mystate === CROSS ? " cross" : " zero";

  return (
    <div className={styles} onClick={() => props.task(props.i)}>
      {props.mystate}
    </div>
  );
}

export default Squares;
