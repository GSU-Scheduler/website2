import React from 'react';
import './App.css';
import Navbar from './components/navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/home';
import About from './pages/about';
import Footer from './components/Footer/Footer';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/about' element={<About />}/>
        </Routes>
        <Footer/> 
      
      </BrowserRouter>
    </div>
  );
}

export default App;