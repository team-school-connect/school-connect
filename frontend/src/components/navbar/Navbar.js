/**
 * 
 * Parts of this code have been adopted from: 
 * https://javascript.works-hub.com/learn/how-to-create-a-responsive-navbar-using-material-ui-and-react-router-f9a01 
 */
import React from "react";
import {
  AppBar,
  Toolbar,
  CssBaseline,
  Typography,
  makeStyles,
  Button,
} from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  navlinks: {
    marginLeft: theme.spacing(10),
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  logo: {
    flexGrow: "1",
    cursor: "pointer",
  },
  navButton: {
    justifyContent: 'center',
    marginTop: '30px',
    backgroundColor: '#add8e6',
    color: 'black',
    '&:hover': {
      backgroundColor: '#1bbd7e',
    },
  },
  
}));

export function Navbar() {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <CssBaseline />
      <Toolbar>
        <Typography variant="h4" className={classes.logo}>
          School Connect
        </Typography>
          <div className={classes.navlinks}>
          <Link to="/login">
              <Button className={classes.navButton}>
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className={classes.navButton}>
                Sign Up
              </Button>
            </Link>
            
          </div>
      </Toolbar>
    </AppBar>
  );
}
