import PingPong from "Games/Ping-Pong/App.js";
import TicTac from "Games/Tic-Tac-Toe/App.js";
import DashBoard from "pages/DashBoard/DashBoard";
import Login from "pages/Login/Login";
import React from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashBoard />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/tic-tac"
        element={
          <PrivateRoute>
            <TicTac />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/ping-pong"
        element={
          <PrivateRoute>
            <PingPong />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default Routing;
