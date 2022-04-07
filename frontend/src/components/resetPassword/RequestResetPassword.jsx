import { Grid, Paper, Avatar, TextField, Button } from "@mui/material";
import { useState } from "react";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { REQUEST_RESET_PASSWORD_MUTATION } from "../../graphql/Mutations";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";

export function RequestResetPassword() {
  const [email, setEmail] = useState("");
  const [requestResetPassword, { error }] = useMutation(REQUEST_RESET_PASSWORD_MUTATION);
  const navigate = useNavigate();

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const alert = useAlert();

  const onClickReset = async () => {
    try {
      setIsButtonDisabled(true);
      await requestResetPassword({ variables: { email } });
      navigate("/forgotPassword/sent");
    } catch (err) {
      setIsButtonDisabled(false);
      alert.error(err.toString());
    }
  };

  //Request Reset Password Form is based on the login form
  return (
    <Grid>
      <Paper
        elevation={10}
        sx={{ padding: 5, borderRadius: 2, height: 300, width: 280, margin: "100px auto" }}
      >
        <Grid align="center">
          <Avatar>
            <LockOutlinedIcon />
          </Avatar>
          <h2>Request Password Reset</h2>
        </Grid>
        <TextField
          sx={{ paddingBottom: "1em" }}
          label="Email"
          placeholder="Enter email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          type="email"
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
          Send Email
        </Button>
      </Paper>
    </Grid>
  );
}
