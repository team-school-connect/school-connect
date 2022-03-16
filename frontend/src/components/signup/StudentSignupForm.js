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
 import { Grid,Paper, Avatar, TextField, Button, Select, MenuItem, InputLabel, FormControl } from '@material-ui/core'
 import AccountCircleIcon from '@material-ui/icons/AccountCircle';
 import { SIGNUP_MUTATION } from '../../graphql/Mutations';
 import { useMutation } from '@apollo/client';
 import { useState } from 'react';
 import { useCookies } from "react-cookie";

 const useStyles = makeStyles(theme => ({
    signupFormContainer: {
     padding :20,
     height:'40%',
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
 
 export function StudentSignupForm(){
   const classes = useStyles();
   const [signup, { error }] = useMutation(SIGNUP_MUTATION);
   const [firstName, setFirstName] = useState("");
   const [lastName, setLastName] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [schoolName, setSchoolName] = useState("");
   const [accountType, setAccountType] = useState("");

   const [cookies, setCookie] = useCookies();

   const onClickSignup = () => {
     //Get accountType from cookie and send request to server to check if user is valid


     //Send request to server to check if user is valid
     signup({
        variables: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          schoolName: schoolName,
          accountType: "STUDENT",
        }
      });
      if (error) {
        console.log(error);
      }
     
   }
 
   //Parts of the Signup Form have been adopted from https://github.com/vikas62081/YT/blob/loginPage/src/components/login.js
   return (
     <Grid>
       <Paper elevation={10} className={classes.signupFormContainer}>
           <Grid align='center'>
               <Avatar className={classes.accountBoxIcon}><AccountCircleIcon/></Avatar>
               <h2>New Student</h2>
           </Grid>
           <TextField label='First Name' placeholder='Enter First Name' onChange={(e) => {setFirstName(e.target.value);}} fullWidth required/>
           <TextField label='Last Name' placeholder='Enter Last Name' onChange={(e) => {setLastName(e.target.value);}} fullWidth required/>
           <TextField label='E-mail' placeholder='Enter E-mail (This will be your Username)' onChange={(e) => {setEmail(e.target.value);}} fullWidth required/>
           <TextField label='Password' placeholder='Enter password' type='password' onChange={(e) => {setPassword(e.target.value);}} fullWidth required/>
           {/* Have a Drop down selection for the school*/}
            <FormControl fullWidth>
                <InputLabel id="label">Select School</InputLabel>
                <Select
                    labelId="school-select-label"
                    label="School"
                    placeholder='Select School'
                    value=""
                    onChange={(e) => {setSchoolName(e.target.value);}}
                    fullWidth
                >
                    <MenuItem value=""/>
                    <MenuItem value={'School 1'}>School 1</MenuItem>
                    <MenuItem value={'School 2'}>School 2</MenuItem>
                    <MenuItem value={'School 3'}>School 3</MenuItem>
                </Select>
            </FormControl>
           
           <Button type='submit' color='primary' variant="contained" className={classes.signupButton} onClick={onClickSignup} fullWidth>
               Create Account
            </Button>
       </Paper>
     </Grid>
   );
 }
 
 
 