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
import { Grid, Paper, TextField, Button } from "@mui/material";
import { SIGNUP_MUTATION } from "../../graphql/Mutations";
import { useMutation, useLazyQuery } from "@apollo/client";
import { GET_USERS_SCHOOL_QUERY } from "../../graphql/Querys";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";

export function TeacherSignupForm() {
  const [signup, { error }] = useMutation(SIGNUP_MUTATION);
  const [getUsersSchool, { loading, data }] = useLazyQuery(GET_USERS_SCHOOL_QUERY);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const alert = useAlert();

  const onClickSignup = async () => {
    try {
      setIsButtonDisabled(true);

      const {
        data: {
          getUsersSchool: { schoolId },
        },
      } = await getUsersSchool();

      await signup({
        variables: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          schoolId: schoolId,
          type: "TEACHER",
        },
      });
      alert.success("Verification email sent to teacher!");
      setIsButtonDisabled(false);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setIsButtonDisabled(false);
      alert.error("Signup Information is invalid");
    }
  };

  //Parts of the Signup Form have been adopted from https://github.com/vikas62081/YT/blob/loginPage/src/components/login.js
  return (
    <Grid container sx={{ display: "flex", justifyContent: "center" }}>
      <Paper sx={{ width: "30em" }}>
        <TextField
          sx={{ marginBottom: "1em" }}
          label="First Name"
          placeholder="Enter First Name"
          onChange={(e) => {
            setFirstName(e.target.value);
          }}
          value={firstName}
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
          value={lastName}
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
          value={email}
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
          value={password}
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
