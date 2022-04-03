import React from "react";
import { Grid, Paper, Avatar } from "@mui/material";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

const VerifyMessage = () => {
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
          <h2>Verification Email Sent</h2>
        </Grid>
        <p>
          We have sent an email to you with a verification link. Your account will be deleted in 24h
          if you do not verify it.
        </p>
        <p>Please check your Junk folder if you cannot find the email.</p>
      </Paper>
    </Grid>
  );
};

export default VerifyMessage;
