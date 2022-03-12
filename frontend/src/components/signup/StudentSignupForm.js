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
 
   const onClickSignup = () => {
     //Send request to server to check if user is valid
     
   }
 
   //Parts of the Signup Form have been adopted from https://github.com/vikas62081/YT/blob/loginPage/src/components/login.js
   return (
     <Grid>
       <Paper elevation={10} className={classes.signupFormContainer}>
           <Grid align='center'>
               <Avatar className={classes.accountBoxIcon}><AccountCircleIcon/></Avatar>
               <h2>New Student</h2>
           </Grid>
           <TextField label='First Name' placeholder='Enter First Name' fullWidth required/>
           <TextField label='Last Name' placeholder='Enter Last Name' fullWidth required/>
           <TextField label='E-mail' placeholder='Enter E-mail (This will be your Username)' fullWidth required/>
           <TextField label='Password' placeholder='Enter password' type='password' fullWidth required/>
           {/* Have a Drop down selection for the school*/}
            <FormControl fullWidth>
                <InputLabel id="label">Select School</InputLabel>
                <Select
                    labelId="school-select-label"
                    label="School"
                    placeholder='Select School'
                    value=""
                    // onChange={(event) => {} }
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
 
 
 