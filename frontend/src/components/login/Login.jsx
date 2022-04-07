/**
 * This component is responsible for the login form.
 * It has 2 text fields:
 * 1. Username
 * 2. Password
 *
 * It has a button to login.
 * */
import { Grid, Paper, Avatar, TextField, Button, Typography } from "@mui/material";
import { useState } from "react";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { SIGNIN_MUTATION } from "../../graphql/Mutations";
import { useMutation, useLazyQuery } from "@apollo/client";
import { GET_ACCOUNT_TYPE_QUERY } from "../../graphql/Querys";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";

export function Login() {
  const [userType, setUserType] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signin, { error }] = useMutation(SIGNIN_MUTATION);
  const [getAccountType, { loading, data }] = useLazyQuery(GET_ACCOUNT_TYPE_QUERY);
  const navigate = useNavigate();

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const alert = useAlert();

  const onClickLogin = async () => {
    try {
      setIsButtonDisabled(true);
      await signin({ variables: { email, password } });
      const {
        data: {
          getAccountType: { type },
        },
      } = await getAccountType();

      switch (type) {
        case "STUDENT":
          navigate("/student/home");
          break;
        case "TEACHER":
          navigate("/teacher/home");
          break;
        case "SCHOOL_ADMIN":
          navigate("/admin/home");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      setIsButtonDisabled(false);
      alert.error(err.toString());
    }
  };

  //Parts of the Login Form have been adopeted from https://github.com/vikas62081/YT/blob/loginPage/src/components/login.js
  return (
    <Grid>
      <Paper
        elevation={10}
        sx={{textAlign:"center", padding: 5, borderRadius: 2, height: 300, width: 280, margin: "100px auto", }}
      >
        <Grid align="center">
          <Avatar>
            <LockOutlinedIcon />
          </Avatar>
          <h2>Log In</h2>
        </Grid>
        <TextField
          sx={{ paddingBottom: "1em" }}
          label="Username"
          placeholder="Enter username"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          type="email"
          fullWidth
          required
        />
        <TextField
          sx={{ paddingBottom: "1em" }}
          label="Password"
          placeholder="Enter password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          type="password"
          fullWidth
          required
        />
        <Button
          type="submit"
          disabled={isButtonDisabled}
          color="primary"
          variant="contained"
          onClick={onClickLogin}
          fullWidth
          sx={{marginBottom: 2}}
        >
          Log in
        </Button>
        <Link to="/forgotPassword">Forgot your password?</Link>
      </Paper>
    </Grid>
  );
}
