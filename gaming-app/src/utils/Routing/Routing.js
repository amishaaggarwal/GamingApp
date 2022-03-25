import TicTac from "Games/Tic-Tac-Toe/App.js";
import DashBoard from "pages/DashBoard/DashBoard";
import Login from "pages/Login/Login";
import React from "react";
import { Route, Routes } from "react-router-dom";

function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<DashBoard />} />
      <Route path="/dashboard/tic-tac-toe" element={<TicTac />} />
    </Routes>
  );
}

export default Routing;
