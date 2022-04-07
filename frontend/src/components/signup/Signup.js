/**
 * This component is responsible for the signup form.
 * It will have 2 buttons:
 *  1. Student Login
 *  2. Administration Login
 *
 * Depending on which user type is chosen, the appropriate signup page will be shown.
 * */
import { Grid, Paper, Button } from "@mui/material";
import { Link } from "react-router-dom";

export function Signup() {
  return (
    <Grid>
      <Paper
        elevation={10}
        sx={{ padding: 5, borderRadius: 2, height: 300, width: 280, margin: "100px auto" }}
      >
        <h2>Are you a ...</h2>
        <Grid align="center">
          <Link to="/signup/student">
            <Button
              variant="contained"
              color="primary"
           
              fullWidth
              sx={{ marginBottom: "1em" }}
            >
              Student
            </Button>
          </Link>
          <Link to="/signup/administration">
            <Button variant="contained" color="primary" fullWidth>
              School
            </Button>
          </Link>
        </Grid>
      </Paper>
    </Grid>
  );
}
