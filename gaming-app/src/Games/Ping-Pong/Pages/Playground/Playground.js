
import React, {useState} from 'react'
import Singleplayer from '../../components/Playscreen/singleplayer/Singleplayer';
import Multiplayer from "../../components/Playscreen/multiplayer/Multiplayer";
import Startscreen from '../../components/Startscreen/Startscreen'
import WinningScreen from '../../components/WinningScreen/WinningScreen';
import LoosingScreen from '../../components/LoosingScreen/LoosingScreen';

function Playground() {
    const [toHere, setToHere] = useState('');

    const switchMode = (param) => {
        switch (param) {
          case "singleplayer":
            return <Singleplayer parentCallback={handleCallback} />;
          case "multiplayer":
            return <Multiplayer gameSessionId={'123456789'} parentCallback={handleCallback} />;
          case "winning":
            return <WinningScreen />;
          case "loosing":
            return <LoosingScreen />;
          default:
            return <Startscreen parentCallback={handleCallback} />;
        }
    }

    const handleCallback = (childData) => {
        console.log(childData);
        setToHere(childData);
    };

    return (
        <>
          {switchMode(toHere)}
        </>
    );
}

export default Playground