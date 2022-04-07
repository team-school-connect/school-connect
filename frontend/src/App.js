import "./App.css";
import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

import { Login } from "./components/login/Login";
import { Signup } from "./components/signup/Signup";
import { StudentSignupForm } from "./components/signup/StudentSignupForm";
import { AdministrationSignupForm } from "./components/signup/AdministrationSignupForm";
import { Home } from "./components/home/Home";
import Credits from "./components/credits/Credits";
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
import NewTeacherFormPage from "./components/administrationview/NewTeacherFormPage/NewTeacherFormPage";
import StudentVolunteerPositionPage from "./components/studentview/Pages/VolunteerBoard/StudentVolunteerPositionPage";
import StudentVolunteerBoardPage from "./components/studentview/Pages/VolunteerBoard/StudentVolunteerBoardPage";
import NewVolunteerPositionPage from "./components/teacherview/NewVolunteerPosition/NewVolunteerPositionPage";
import TeacherVolunteerBoardPage from "./components/teacherview/TeacherVolunteerBoard/TeacherVolunteerBoardPage";
import TeacherVolunteerPositionPage from "./components/teacherview/TeacherVolunteerBoard/TeacherVolunteerPositionPage";
import NewAssignmentPage from "./components/teacherview/NewAssignment/NewAssignmentPage";
import ViewAssignment from "./components/teacherview/Assignment/ViewAssignment";
import AssignmentPage from "./components/teacherview/Assignment/AssignmentPage";
import VerifyMessage from "./components/verify/VerifyMessage";
import Verify from "./components/verify/Verify";
import StudentAssignmentPage from "./components/studentview/Pages/Assignment/StudentAssignmentPage";
import { RequestResetPassword } from "./components/resetPassword/RequestResetPassword";
import ResetPasswordMessage from "./components/resetPassword/ResetPasswordMessage";
import { ResetPassword } from "./components/resetPassword/ResetPassword";

function App() {
  return (
    <div className="App">
      <AlertProvider template={AlertTemplate} timeout={4000}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify" element={<VerifyMessage />} />
            <Route path="/verify/:code" element={<Verify />} />
            <Route path="/forgotPassword" element={<RequestResetPassword />} />
            <Route path="/forgotPassword/sent" element={<ResetPasswordMessage />} />
            <Route path="/resetPassword/:tempPassword" element={<ResetPassword />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signup/student" element={<StudentSignupForm />} />
            <Route path="/signup/administration" element={<AdministrationSignupForm />} />
            <Route path="/studyRooms/:id/" element={<StudyRoom />} />
            <Route path="/student" element={<StudentView />}>
              <Route path="home" element={<ClassroomListingPage />} />
              <Route path="studyRooms" element={<StudyRoomListingPage />} />
              <Route path="studyRooms/new" element={<NewStudyRoomPage />} />
              <Route path="classrooms" element={<ClassroomListingPage />} />
              <Route path="classrooms/join" element={<JoinClassroomPage />} />
              <Route path="classrooms/:id" element={<ClassroomPage />} />
              <Route path="classrooms/:id/assignments" element={<StudentAssignmentPage />} />
              <Route path="volunteerBoard/" element={<StudentVolunteerBoardPage />} />
              <Route path="volunteerBoard/:id" element={<StudentVolunteerPositionPage />} />
            </Route>
            <Route path="/teacher" element={<TeacherView />}>
              <Route path="home" element={<TeacherClassroomListingPage />} />
              <Route path="classrooms" element={<TeacherClassroomListingPage />} />
              <Route path="classrooms/:id" element={<TeacherClassroomPage />} />
              <Route path="classrooms/:id/assignments" element={<ViewAssignment />} />
              <Route path="classrooms/:id/assignments/:assignId" element={<AssignmentPage />} />
              <Route path="classrooms/:id/newAnnouncement" element={<NewAnnouncementPage />} />
              <Route path="classrooms/:id/newAssignment" element={<NewAssignmentPage />} />
              <Route path="classrooms/new" element={<NewClassroomPage />} />
              <Route path="volunteerBoard/" element={<TeacherVolunteerBoardPage />} />
              <Route path="volunteerBoard/new" element={<NewVolunteerPositionPage />} />
              <Route path="volunteerBoard/:id" element={<TeacherVolunteerPositionPage />} />
            </Route>
            <Route path="/admin" element={<AdministrationView />}>
              <Route path="home" element={<NewTeacherFormPage />} />
              <Route path="addTeacher" element={<NewTeacherFormPage />} />
            </Route>
          </Routes>
        </Router>
      </AlertProvider>
    </div>
  );
}

export default App;
