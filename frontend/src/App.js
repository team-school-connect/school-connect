import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Login } from './components/login/Login';
import { Signup } from './components/signup/Signup';
import { StudentSignupForm } from './components/signup/StudentSignupForm';
import { Navbar } from './components/navbar/Navbar';
import { Home } from './components/home/Home';


function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/signup/student" element={<StudentSignupForm/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
