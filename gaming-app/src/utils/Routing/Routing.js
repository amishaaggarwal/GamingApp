import App from "Games/Tic-Tac-Toe/src/App";
import DashBoard from "pages/DashBoard/DashBoard";
import Login from "pages/Login/Login";
import React from "react";
import { Route, Routes } from "react-router-dom";

function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<DashBoard />} />
      <Route path="/tic-tac-toe" element={<App/>}/>
    </Routes>
  );
}

export default Routing;
