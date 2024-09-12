import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ColorProvider } from "./components/ColorContext";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Auth from "./pages/Auth";
import "./index.css";
import Container from "./container";
import Footer from "./components/footer";

const App: React.FC = () => {
  return (
    <ColorProvider>
      <BrowserRouter>
        <Container>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
          <Footer />
        </Container>
      </BrowserRouter>
    </ColorProvider>
  );
};

export default App;
