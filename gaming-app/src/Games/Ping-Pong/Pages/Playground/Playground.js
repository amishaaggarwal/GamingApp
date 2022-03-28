
import React, {useState} from 'react'
import Singleplayer from '../../components/Playscreen/singleplayer/Singleplayer';
import Multiplayer from "../../components/Playscreen/multiplayer/Multiplayer";
import Startscreen from '../../components/Startscreen/Startscreen'
import DrawerLeft from 'components/DrawerLeft/DrawerLeft';


function Playground() {
    const [toHere, setToHere] = useState('');

    const switchMode = (param) => {
        switch (param) {
          case "singleplayer":
            return <Singleplayer parentCallback={handleCallback} />;
          case "multiplayer":
            return <Multiplayer gameSessionId={'123456789'} parentCallback={handleCallback} />;
          default:
            return <Startscreen parentCallback={handleCallback} />;
        }
    }

    const handleCallback = (childData) => {
        setToHere(childData);
    };

    return (
      <>
        {switchMode(toHere)}
        <DrawerLeft />
      </>
    );
}

export default Playground