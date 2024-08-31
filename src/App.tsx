import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ColorProvider } from "./components/ColorContext";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Auth from "./pages/Auth";

import "./index.css";

const App: React.FC = () => {
  return (
    <ColorProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/auth' element={<Auth />}/>
        </Routes>
      </BrowserRouter>
    </ColorProvider>
  );
};

export default App;