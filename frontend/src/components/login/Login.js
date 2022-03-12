/** 
 * This component is responsible for the login form.
 * It has 2 text fields:
 * 1. Username
 * 2. Password
 * 
 * It has a button to login.
 * */ 
import { makeStyles } from '@material-ui/core/styles';
import { Grid,Paper, Avatar, TextField, Button} from '@material-ui/core'
import { useState } from 'react';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

const useStyles = makeStyles(theme => ({
  loginFormContainer: {
    padding :20,
    height:'300px',
    width:280,
    margin:"100px auto"
  },
  lockIcon: {
    backgroundColor:'#1bbd7e'
  },
  loginButton: {
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

export function Login(){
  const [userType, setUserType] = useState(""); //We may not need userType for login***
  const classes = useStyles();

  const onClickLogin = () => {

    //Send request to server to check if user is valid
    
    //These checks may not be needed***
    if(userType === "Student"){
        console.log("Student Login");
    }
    else if(userType === "Teacher"){
        console.log("Teacher Login");
    }
    else if(userType === "Administration"){
        console.log("Administration Login");
    }
  }

  //Parts of the Login Form have been adopeted from https://github.com/vikas62081/YT/blob/loginPage/src/components/login.js
  return (
    <Grid>
      <Paper elevation={10} className={classes.loginFormContainer}>
          <Grid align='center'>
              <Avatar className={classes.lockIcon}><LockOutlinedIcon/></Avatar>
              <h2>Log In</h2>
          </Grid>
          <TextField label='Username' placeholder='Enter username' fullWidth required/>
          <TextField label='Password' placeholder='Enter password' type='password' fullWidth required/>
          <Button type='submit' color='primary' variant="contained" className={classes.loginButton} onClick={onClickLogin} fullWidth>
            Log in
          </Button>
      </Paper>
    </Grid>
  );
}


