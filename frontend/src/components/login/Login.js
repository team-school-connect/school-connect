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
import { SIGNIN_MUTATION } from '../../graphql/Mutations';
import { useMutation, useLazyQuery } from '@apollo/client';
import { GET_ACCOUNT_TYPE_QUERY } from "../../graphql/Querys";
import { useNavigate } from "react-router-dom";


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
  const [userType, setUserType] = useState("");
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signin, { error }] = useMutation(SIGNIN_MUTATION);
  const [getAccountType, {loading, data}] = useLazyQuery(GET_ACCOUNT_TYPE_QUERY);
  const navigate = useNavigate();

  function trySignin(){
    signin({
      variables: {
        email: username,
        password: password,
      }
    });
    
   
    if (error) {
      console.log(error);
      return;
    }
  }

  function getUserType(){
    getAccountType();
    if(loading){
      console.log("Loading...");
    }
    // console.log(data?.getAccountType?.type);

    setUserType(data?.getAccountType?.type);
  }

  const onClickLogin = () => {

    //Send request to server to check if user is valid
    
    //These checks may not be needed***

    // console.log(username);
    // console.log(password);
    
    console.log("Login Clicked");
    // signin({
    //   variables: {
    //     email: username,
    //     password: password,
    //   }
    // });
    
   
    // if (error) {
    //   console.log(error);
    //   return;
    // }
    //Create new promise with trySignin()
    const promise = new Promise((resolve, reject) => {
      trySignin();
      resolve();
    });
    promise.then(() => {
      getUserType();
    });

    // getAccountType();
    // if(loading){
    //   console.log("Loading...");
    // }
    // // console.log(data?.getAccountType?.type);
    // setUserType(data["getAccountType"]["type"]);

    if(userType === "STUDENT"){
      console.log("Student");
      navigate("/student");
      return;
    }
    if(userType === "TEACHER"){
      console.log("TEACHER");
      navigate("/teacher");
      return;
    }
    if(userType === "SCHOOL_ADMIN"){
      console.log("SCHOOL_ADMIN");
      navigate("/administration");

      return;
    }
    
    console.log("Invalid User");
    return;
    
    // if the user type is admin, redirect to admin page
  }

  //Parts of the Login Form have been adopeted from https://github.com/vikas62081/YT/blob/loginPage/src/components/login.js
  return (
    <Grid>
      <Paper elevation={10} className={classes.loginFormContainer}>
          <Grid align='center'>
              <Avatar className={classes.lockIcon}><LockOutlinedIcon/></Avatar>
              <h2>Log In</h2>
          </Grid>
          <TextField label='Username' placeholder='Enter username' onChange={(e) => {setUsername(e.target.value);}} fullWidth required/>
          <TextField label='Password' placeholder='Enter password' onChange={(e) => {setPassword(e.target.value);}} type='password' fullWidth required/>
          <Button type='submit' color='primary' variant="contained" className={classes.loginButton} onClick={onClickLogin} fullWidth>
            Log in
          </Button>
      </Paper>
    </Grid>
  );
}


