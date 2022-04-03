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
import { Grid, Paper, Avatar, TextField, Button } from "@mui/material";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { SIGNUP_SCHOOL_MUTATION } from "../../graphql/Mutations";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";

export function AdministrationSignupForm() {
  const [signupAdministration, { error }] = useMutation(SIGNUP_SCHOOL_MUTATION);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const navigate = useNavigate();

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const alert = useAlert();

  const onClickSignup = async () => {
    //Send request to server to check if user is valid
    try {
      setIsButtonDisabled(true);
      await signupAdministration({
        variables: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          schoolName: schoolName,
        },
      });
      navigate("/verify");
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
          <h2>New School</h2>
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
        <TextField
          sx={{ marginBottom: "1em" }}
          label="School Name"
          placeholder="Enter School Name"
          onChange={(e) => {
            setSchoolName(e.target.value);
          }}
          fullWidth
          required
        />
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
