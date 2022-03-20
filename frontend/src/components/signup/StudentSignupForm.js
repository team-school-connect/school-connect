/**
 * This component is responsible for the student signup form.
 * It has 5 fields:
 * 1. First Name
 * 2. Last Name
 * 3. E-mail
 * 4. Password
 * 5. School
 *
 * It has a button to login.
 * */
//  import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Paper,
  Avatar,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { SIGNUP_MUTATION } from "../../graphql/Mutations";
import { GET_SCHOOL_LIST_QUERY } from "../../graphql/Querys";
import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";



export function StudentSignupForm() {
  const [signup, { error }] = useMutation(SIGNUP_MUTATION);
  const { data } = useQuery(GET_SCHOOL_LIST_QUERY);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const navigate = useNavigate();

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const alert = useAlert();
  //make it async
  const onClickSignup = async () => {
    //Send request to server to check if user is valid
    try {
      setIsButtonDisabled(true);
      await signup({
        variables: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          schoolId: schoolName,
          type: "STUDENT",
        },
      });

      navigate("/student/classrooms");
    } catch (err) {
      setIsButtonDisabled(false);
      console.log(err);
      alert.error("Signup Information is invalid");
    }
  };

  //Parts of the Signup Form have been adopted from https://github.com/vikas62081/YT/blob/loginPage/src/components/login.js
  return (
    <Grid>
      <Paper
        elevation={10}
        sx={{ padding: 5, borderRadius: 2, width: "30em", margin: "100px auto" }}
      >
        <Grid align="center">
          <Avatar>
            <AccountCircleIcon />
          </Avatar>
          <h2>New Student</h2>
        </Grid>
        <TextField
          sx={{ marginBottom: "1em" }}
          label="First Name"
          placeholder="Enter First Name"
          onChange={(e) => {
            setFirstName(e.target.value);
          }}
          fullWidth
          required
        />
        <TextField
          sx={{ marginBottom: "1em" }}
          label="Last Name"
          placeholder="Enter Last Name"
          onChange={(e) => {
            setLastName(e.target.value);
          }}
          fullWidth
          required
        />
        <TextField
          sx={{ marginBottom: "1em" }}
          label="E-mail"
          placeholder="Enter E-mail (This will be your Username)"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          fullWidth
          required
        />
        <TextField
          sx={{ marginBottom: "1em" }}
          label="Password"
          placeholder="Enter password"
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          fullWidth
          required
        />
        {/* Have a Drop down selection for the school*/}
        <FormControl fullWidth sx={{ marginBottom: "1em" }}>
          <InputLabel id="label">Select School</InputLabel>
          <Select
            labelId="school-select-label"
            label="School"
            placeholder="Select School"
            value={schoolName}
            onChange={(e) => {
              setSchoolName(e.target.value);
            }}
            fullWidth
          >
            {data &&
              data.getSchools &&
              data.getSchools.map((school) => {
                // console.log(school.name);
                return (
                  <MenuItem key={school.name} value={school.name}>
                    {school.name}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>

        <Button
          disabled={isButtonDisabled}
          type="submit"
          color="primary"
          variant="contained"
          onClick={onClickSignup}
          fullWidth
        >
          Create Account
        </Button>
      </Paper>
    </Grid>
  );
}
