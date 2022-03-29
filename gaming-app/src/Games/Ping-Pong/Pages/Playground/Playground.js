
import React, {useState} from 'react'
import Singleplayer from '../../components/Playscreen/singleplayer/Singleplayer';
import Multiplayer from "../../components/Playscreen/multiplayer/Multiplayer";
import Startscreen from '../../components/Startscreen/Startscreen'
import DrawerLeft from 'components/DrawerLeft/DrawerLeft';
import { uid } from "uid";
import { setSessionStorage } from 'utils/Storage/SessionStorage';
import './Playground.scss'


function Playground() {
    const [toHere, setToHere] = useState('');

    const switchMode = (param) => {
        switch (param) {
          case "singleplayer":
            setSessionStorage('singleplayGameId', uid());
            return <Singleplayer parentCallback={handleCallback} />;
          case "multiplayer":
            return <Multiplayer  parentCallback={handleCallback} />;
          default:
            return <Startscreen parentCallback={handleCallback} />;
        }
    }

    const handleCallback = (childData) => {
        setToHere(childData);
    };

    return (
      <div className='Playground'>
        {switchMode(toHere)}
        <DrawerLeft />
      </div>
    );
}

export default Playground