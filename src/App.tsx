import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ColorProvider } from "./components/ColorContext";
import Home from "./pages/Home";
import "./index.css";

const App: React.FC = () => {
  return (
    <ColorProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </ColorProvider>
  );
};

export default App;
