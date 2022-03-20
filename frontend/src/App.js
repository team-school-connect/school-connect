import "./App.css";
import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

import { Login } from "./components/login/Login";
import { Signup } from "./components/signup/Signup";
import { StudentSignupForm } from "./components/signup/StudentSignupForm";
import { TeacherSignupForm } from "./components/signup/TeacherSignupForm";
import { AdministrationSignupForm } from "./components/signup/AdministrationSignupForm";
import { Navbar } from "./components/navbar/Navbar";
import { Home } from "./components/home/Home";
import StudyRoom from "./components/video/StudyRoom/StudyRoom";
import StudentView from "./components/studentview/StudentView";
import AdministrationView from "./components/administrationview/AdministrationView";
import NewStudyRoomPage from "./components/studentview/Pages/NewStudyRoom/NewStudyRoomPage";
import StudyRoomListingPage from "./components/studentview/Pages/StudyRoomListing/StudyRoomListingPage";
import ClassroomListingPage from "./components/studentview/Pages/ClassroomListing/ClassroomListingPage";
import JoinClassroomPage from "./components/studentview/Pages/JoinClassroom/JoinClassroomPage";
import ClassroomPage from "./components/studentview/Pages/Classroom/ClassroomPage";
import TeacherView from "./components/teacherview/TeacherView";
import TeacherClassroomListingPage from "./components/teacherview/TeacherClassroomListing/TeacherClassroomListing";
import NewClassroomPage from "./components/teacherview/NewClassroom/NewClassroomPage";
import TeacherClassroomPage from "./components/teacherview/Classroom/TeacherClassroomPage";
import NewAnnouncementPage from "./components/teacherview/NewAnnouncement/NewAnnouncementPage";

function App() {
  return (
    <div className="App">
      <AlertProvider template={AlertTemplate} timeout={4000}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signup/student" element={<StudentSignupForm />} />
            <Route path="/signup/administration" element={<AdministrationSignupForm />} />
            <Route path="/studyRooms/:id/" element={<StudyRoom />} />
            <Route path="/student" element={<StudentView />}>
              <Route path="studyRooms" element={<StudyRoomListingPage />} />
              <Route path="studyRooms/new" element={<NewStudyRoomPage />} />
              <Route path="classrooms" element={<ClassroomListingPage />} />
              <Route path="classrooms/join" element={<JoinClassroomPage />} />
              <Route path="classrooms/:id" element={<ClassroomPage />} />
            </Route>
            <Route path="/teacher" element={<TeacherView />}>
              <Route path="classrooms" element={<TeacherClassroomListingPage />} />
              <Route path="classrooms/:id" element={<TeacherClassroomPage />} />
              <Route path="classrooms/:id/newAnnouncement" element={<NewAnnouncementPage />} />
              <Route path="classrooms/new" element={<NewClassroomPage />} />
            </Route>
            <Route path="/administration" element={<AdministrationView />}>
              <Route path="signup/teacher" element={<TeacherSignupForm />} />
            </Route>
          </Routes>
        </Router>
      </AlertProvider>
    </div>
  );
}

export default App;
