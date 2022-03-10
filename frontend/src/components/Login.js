/** 
 * This component is responsible for the login page.
 * It will have 3 buttons:
 *  1. Student Login
 *  2. Teacher Login
 *  3. Administration Login
 * 
 * Depending on which user login is chosen, the appropriate login page will be shown.
 * */ 
  
import { Button } from '@material-ui/core';
import { StudentLogin } from './StudentLogin';
import { TeacherLogin } from './TeacherLogin';
import { AdminLogin } from './AdminLogin';
import { useState } from 'react';

export function Login(){
  const [userType, setUserType] = useState({student: false, teacher: false, admin: false,});

  const showStudentLogin = () => {
    setUserType({
      student: true,
      teacher: false,
      admin: false,
    });
  }

  const showTeacherLogin = () => {
    setUserType({
      student: false,
      teacher: true,
      admin: false,
    });
  }

  const showAdminLogin = () => {
    setUserType({
      student: false,
      teacher: false,
      admin: true,
    });
  }

  const onClickLogin = () => {
    if(userType.student){
      console.log("Student Login");
    }
    else if(userType.teacher){
      console.log("Teacher Login");
    }
    else if(userType.admin){
      console.log("Administration Login");
    }
    
  }

  if (userType.student) {
    return (
      <StudentLogin 
        onClickLogin={onClickLogin}
      />
    );
  }
  else if (userType.teacher) {
    return (
      <TeacherLogin
        onClickLogin={onClickLogin}
      />
    );
  }
  else if (userType.admin) {
    return (
      <AdminLogin
        onClickLogin={onClickLogin}
      />
    );
  }
  else {
    return (
      <div>
        <Button color="primary" variant="contained" onClick={showStudentLogin}>  Student </Button>
        <Button color="primary" variant="contained" onClick={showTeacherLogin}>  Teacher </Button>
        <Button color="primary" variant="contained" onClick={showAdminLogin}>  Administration </Button>
      </div>
    );
  }
}


