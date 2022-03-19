/** 
 * This component is responsible for the signup form.
 * It will have 3 buttons:
 *  1. Student Login
 *  2. Administration Login
 * 
 * Depending on which user type is chosen, the appropriate signup page will be shown.
 * */ 
 import { makeStyles } from '@material-ui/core/styles';
 import { Grid,Paper, Button} from '@material-ui/core'
//  import { useState } from 'react';
 import { Link } from "react-router-dom";
//  import { useCookies } from 'react-cookie';

 
 
 const useStyles = makeStyles(theme => ({
  signupFormContainer: {
     padding :20,
     height:'300px',
     width:280,
     margin:"100px auto"
   },
   userSelectionButton: {
     justifyContent: 'center',
     marginTop: '10px',
     padding: '10px',
     backgroundColor: '#1bbd7e',
     color: 'white',
     '&:hover': {
       backgroundColor: '#1bbd7e',
       color: 'white',
     },
   }
 }));
 
 export function Signup(){
  //  const [userType, setUserType] = useState("");
   const classes = useStyles();


    const onClickStudent = () => {
      console.log("Student Signup");
      // setUserType("Student");
      // setCookie('accountType', userType, { path: '/' });
    }

    // const onClickTeacher = () => {
    //   console.log("Teacher Signup");
    //   setUserType("Teacher");
    //   // setCookie('accountType', userType, { path: '/' });
    // }

    const onClickAdministration = () => {
      console.log("Administration Signup");
      // setUserType("Administration");
      // setCookie('accountType', userType, { path: '/' });
    }
 
   return (
    <Grid>
      <Paper elevation={10} className={classes.signupFormContainer}>
        <h2>Are you a ...</h2>
        <Grid align='center'>
          <Link to="/signup/student">
            <Button variant="contained" color="primary" className={classes.userSelectionButton} onClick={onClickStudent} fullWidth>
                Student
            </Button>
          </Link>
          {/* <Link to="/signup/teacher">
            <Button variant="contained" color="primary" className={classes.userSelectionButton} onClick={onClickTeacher} fullWidth>
                Teacher
            </Button>
          </Link> */}
          <Link to="/signup/administration">
            <Button variant="contained" color="primary" className={classes.userSelectionButton} onClick={onClickAdministration} fullWidth>
                Administration
            </Button>
          </Link>
        </Grid>
      </Paper>
    </Grid>
   );
 }
 
 
 