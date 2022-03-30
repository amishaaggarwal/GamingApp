import VolumeMuteIcon from "@mui/icons-material/VolumeMute";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import Tooltip from "@mui/material/Tooltip";
import React, { useState } from "react";
import useSound from "use-sound";
import Wanted from "../../assets/Wanted.mp3";
import "./Footer.scss";

function Footer() {
  const [sound, setSound] = useState(false);
  const [play, { stop }] = useSound(Wanted);

  //-stop n start bg music
  const toggleSound = () => {
    if (sound === false) {
      setSound(true);
      play();
    } else {
      setSound(false);
      stop();
    }
  };

  return (
    <div className="footer">
      {sound === true ? (
        <div>
          <Tooltip title="Play Background Music">
            <VolumeUpIcon onClick={toggleSound} className="sound-icon" />
          </Tooltip>
        </div>
      ) : (
        <div>
          <Tooltip title="Stop Music">
            <VolumeMuteIcon onClick={toggleSound} className="sound-icon" />
          </Tooltip>
        </div>
      )}
    </div>
  );
}

export default Footer;
