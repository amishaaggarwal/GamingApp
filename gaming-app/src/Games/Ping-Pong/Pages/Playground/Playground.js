
import React, { useState, useContext, useEffect, useCallback } from 'react'
import Singleplayer from '../../components/singleplayer/Singleplayer';
import Multiplayer from "../../components/multiplayer/Multiplayer";
import Startscreen from '../../components/Startscreen/Startscreen'
import DrawerLeft from 'components/DrawerLeft/DrawerLeft';
import Notification from 'components/Notification/Notification';
import { uid } from "uid";
import { setSessionStorage } from 'utils/Storage/SessionStorage';
import './Playground.scss'
import { toMultiplayer } from 'App'
import WinningScreen from 'Games/Ping-Pong/components/WinningScreen/WinningScreen';
import LoosingScreen from 'Games/Ping-Pong/components/LoosingScreen/LoosingScreen';

function Playground() {
    const [toHere, setToHere] = useState('');
    const { isMulti, setIsmulti } = useContext(toMultiplayer);

    
    // useEffect(() => {
    //   console.log('in playground');
    //   if(isMulti) setToHere('multiplayer');    
    // }, [isMulti])
    
   const handleMultiplayer = useCallback(() => {
     handleCallback("multiplayer");
     setIsmulti(false);
     // readFireBase("Invites", `${sessionId}`).then((res) => {
     //   let players = {
     //     player1: res.from,
     //     player2: res.to,
     //   };
     //   updateFireBase("GameSession", sessionId, "players", players);
     // });
   }, [setIsmulti]);


  useEffect(() => {
    console.log(isMulti);
    isMulti && handleMultiplayer();
  }, [isMulti, handleMultiplayer]);


    const switchMode = (param) => {
        switch (param) {
          case "singleplayer":
            setSessionStorage("singleplayGameId", uid());
            return <Singleplayer parentCallback={handleCallback} />;
          case "multiplayer":
            return <Multiplayer parentCallback={handleCallback} />;
          case "winning":
            return <WinningScreen parentCallback={handleCallback} />;
          case "loosing":
            return <LoosingScreen parentCallback={handleCallback} />;
          default:
            return <Startscreen parentCallback={handleCallback} />;
        }
    }

    const handleCallback = (childData) => {
      console.log(childData);
        setToHere(childData);
    };

    return (
      <div className="Playground">
        {switchMode(toHere)}
      
      </div>
    );
}

export default Playground