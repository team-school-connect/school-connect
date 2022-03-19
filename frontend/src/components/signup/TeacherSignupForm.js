/** 
 * This component is responsible for the student signup form.
 * It has 2 text fields:
 * 1. Name
 * 2. E-mail
 * 3. Password
 * 4. School
 * 
 * It has a button to login.
 * */ 
 import { makeStyles } from '@material-ui/core/styles';
 import { Grid,Paper, Avatar, TextField, Button } from '@material-ui/core'
 import AccountCircleIcon from '@material-ui/icons/AccountCircle';
 import { SIGNUP_MUTATION } from '../../graphql/Mutations';
 import { useMutation, useQuery } from '@apollo/client';
 import { GET_USERS_SCHOOL_QUERY } from "../../graphql/Querys";
 import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
 
 const useStyles = makeStyles(theme => ({
    signupFormContainer: {
        padding :20,
        height:'450px',
        width:'40%',
        margin:"100px auto"
   },
   accountBoxIcon: {
     backgroundColor:'#1bbd7e'
   },
   signupButton: {
     justifyContent: 'center',
     marginTop: '20px',
     padding: '10px',
     backgroundColor: '#1bbd7e',
     color: 'white',
     '&:hover': {
       backgroundColor: '#1bbd7e',
       color: 'white',
     },
   }
 }));
 
 export function TeacherSignupForm(){
   const classes = useStyles();
   const [signup, { error }] = useMutation(SIGNUP_MUTATION);
   const { data } = useQuery(GET_USERS_SCHOOL_QUERY); 
   const [firstName, setFirstName] = useState("");
   const [lastName, setLastName] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [schoolName, setSchoolName] = useState(data?.getUsersSchool?.schoolId);
   const navigate = useNavigate();
   //  setSchoolName(data?.getUsersSchool?.schoolId);
   const onClickSignup = () => {
     console.log(data);
     setSchoolName(data?.getUsersSchool?.schoolId);
     console.log(schoolName);
     //Send request to server to check if user is valid
     signup({
        variables: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          schoolId: schoolName,
          type: "TEACHER"
        }
      });
      if (error) {
        console.log(error);
      }

      navigate("/administration");

   }
 
   //Parts of the Signup Form have been adopted from https://github.com/vikas62081/YT/blob/loginPage/src/components/login.js
   return (
     <Grid>
       <Paper elevation={10} className={classes.signupFormContainer}>
           <Grid align='center'>
               <Avatar className={classes.accountBoxIcon}><AccountCircleIcon/></Avatar>
               <h2>New Teacher</h2>
           </Grid>
           <TextField label='First Name' placeholder='Enter First Name' onChange={(e)=>{setFirstName(e.target.value);}} fullWidth required/>
           <TextField label='Last Name' placeholder='Enter Last Name' onChange={(e)=>{setLastName(e.target.value);}} fullWidth required/>
           <TextField label='E-mail' placeholder='Enter E-mail (This will be your Username)' onChange={(e)=>{setEmail(e.target.value);}} fullWidth required/>
           <TextField label='Password' placeholder='Enter password' type='password' onChange={(e)=>{setPassword(e.target.value);}} fullWidth required/>
           {/* <TextField label='School Name' inputProps={{readOnly: true}} defaultValue={schoolName} fullWidth required/> */}
           <Button type='submit' color='primary' variant="contained" className={classes.signupButton} onClick={onClickSignup} fullWidth>
               Create Account
            </Button>
       </Paper>
     </Grid>
   );
 }
 
 
 