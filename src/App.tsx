import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import About from './pages/About';
import Auth from './pages/Auth';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/about' element={<About />}/>
          <Route path='/auth' element={<Auth />}/>
        </Routes>
      
      </BrowserRouter>
    </div>
  );
}

export default App;