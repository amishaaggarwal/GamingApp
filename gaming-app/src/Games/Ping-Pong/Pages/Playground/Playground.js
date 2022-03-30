
import React, { useState, useContext, useEffect } from 'react'
import Singleplayer from '../../components/Playscreen/singleplayer/Singleplayer';
import Multiplayer from "../../components/Playscreen/multiplayer/Multiplayer";
import Startscreen from '../../components/Startscreen/Startscreen'
import DrawerLeft from 'components/DrawerLeft/DrawerLeft';
import Notification from 'components/Notification/Notification';
import { uid } from "uid";
import { setSessionStorage } from 'utils/Storage/SessionStorage';
import './Playground.scss'
import { toMultiplayer } from 'App'

function Playground() {
    const [toHere, setToHere] = useState('');
    const { isMulti, setIsmulti } = useContext(toMultiplayer);

    
    useEffect(() => {
      console.log('in playground');
      if(isMulti) setToHere('multiplayer');    
    }, [isMulti])
    


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
      <div className="Playground">
        {switchMode(toHere)}
        <DrawerLeft parentCallback={handleCallback} />
        <Notification parentCallback={handleCallback} />
      </div>
    );
}

export default Playground