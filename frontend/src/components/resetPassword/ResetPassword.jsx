import { Grid, Paper, Avatar, TextField, Button } from "@mui/material";
import { useState } from "react";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { RESET_PASSWORD_MUTATION } from "../../graphql/Mutations";
import { useMutation } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "react-alert";


export function ResetPassword() {
  const { tempPassword } = useParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [resetPassword, { error }] = useMutation(RESET_PASSWORD_MUTATION);
  const navigate = useNavigate();

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const alert = useAlert();

  const onClickReset = async () => {
    if (password !== confirmPassword) {
      alert.error("Passwords don't match");
      return;
    }
    try {
      setIsButtonDisabled(true);
      await resetPassword({ variables: { email, tempPassword, newPassword: password } });
      alert.success("Successfully reset password!");
      navigate("/login");
    } catch (err) {
      setIsButtonDisabled(false);
      console.log(err);
      alert.error(err.toString());
    }
  };

  //ResetPassword form is based on login form
  return (
    <Grid>
      <Paper
        elevation={10}
        sx={{ padding: 5, borderRadius: 2, width: 280, margin: "100px auto" }}
      >
        <Grid align="center">
          <Avatar>
            <LockOutlinedIcon />
          </Avatar>
          <h2>Reset your Password</h2>
        </Grid>
        <TextField
          sx={{ paddingBottom: "1em" }}
          label="Confirm Email"
          placeholder="Confirm email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          type="email"
          fullWidth
          required
        />

        <TextField
          sx={{ paddingBottom: "1em" }}
          label="New Password"
          placeholder="Enter password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          type="password"
          fullWidth
          required
        />

        <TextField
          sx={{ paddingBottom: "1em" }}
          label="Confirm New Password"
          placeholder="Confirm password"
          onChange={(e) => {
            setConfirmPassword(e.target.value);
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
          onClick={onClickReset}
          fullWidth
        >
          Reset Password
        </Button>
      </Paper>
    </Grid>
  );
}
