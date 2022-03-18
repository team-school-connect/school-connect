import "./App.css";
import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import { Login } from "./components/login/Login";
import { Signup } from "./components/signup/Signup";
import { StudentSignupForm } from "./components/signup/StudentSignupForm";
import { AdministrationSignupForm } from "./components/signup/AdministrationSignupForm";
import { Navbar } from "./components/navbar/Navbar";
import { Home } from "./components/home/Home";
import StudyRoom from "./components/video/StudyRoom/StudyRoom";
import StudyRoomListing from "./components/studentview/studyRoomListing/StudyRoomListing";
import StudentView from "./components/studentview/StudentView";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <Navbar />
                <Home />
              </div>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup/student" element={<StudentSignupForm />} />
          <Route path="/signup/administration" element={<AdministrationSignupForm />} />
          <Route path="/studyRooms/:id/" element={<StudyRoom />} />
          <Route path="/student" element={<StudentView/>}>
            <Route path="studyRooms" element={<StudyRoomListing/>}/>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
