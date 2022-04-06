import React from "react";
import { Grid, Paper, Avatar } from "@mui/material";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

const ResetPasswordMessage = () => {
  return (
    <Grid>
      <Paper
        elevation={10}
        sx={{
          padding: 5,
          borderRadius: 2,
          height: 300,
          width: 280,
          margin: "100px auto",
          textAlign: "center",
        }}
      >
        <Grid align="center">
          <Avatar>
            <MarkEmailReadIcon />
          </Avatar>
          <h2>Password Reset Email Sent</h2>
        </Grid>
        <p>
          We have sent an email to you with a link to reset your password if the account exists. The
          link will expire in 1h. Allow 1 minute to recieve the email.
        </p>
        <p>Please check your Junk folder if you cannot find the email.</p>
      </Paper>
    </Grid>
  );
};

export default ResetPasswordMessage;
