import React, { useState, useEffect } from "react";
import "./Timer.scss";

function Timer() {
  const [timer, setTimer] = useState(3);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (timer) clearInterval(intervalId);
      setTimer(t => t - 1);
    }, 1000);
  }, [timer])
  
  
  return (
    <div className="timer-block">
        <h1>sd</h1>
      <p className="timer">{timer > 0 ? timer : "start"}</p>
    </div>
  );
}

export default Timer;
