import React, {useState} from 'react';
import Routing from "utils/Routing/Routing";
import "./App.css";


export const toMultiplayer = React.createContext({
  isMulti: false,
  setIsMulti: () => {},
});


function App() {
   
  const [isMulti, setIsmulti] = useState(false);
  const value = { isMulti, setIsmulti };

  return (
    <toMultiplayer.Provider value={value}>
      <Routing />
    </toMultiplayer.Provider>
  );
}

export default App;
