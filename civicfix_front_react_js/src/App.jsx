import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import MainMap from "./MainMap.jsx";
import { Outlet, Link } from "@tanstack/react-router";

function App() {
  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
