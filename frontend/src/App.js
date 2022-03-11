import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Login } from './components/login/Login';
import { Navbar } from './components/navbar/Navbar';


function App() {
  return (
    <div className="App">

      
      <Router>
        <Navbar />
        <Routes>
          {/* <Route exact path="/" component={Home} /> */}
          <Route path="/login" element={<Login/>} />
        </Routes>
      </Router>

    </div>
  );
}

export default App;
