/**
 * This component is responsible for the student login page.
 * It contains a form with 2 fields:
 *  1. Username (E-mail)
 *  2. Password
 */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
    loginFormContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

export function StudentLogin(props) {
  const { onClickLogin } = props;
  const classes = useStyles();

  return (
    <form className={classes.loginFormContainer} noValidate autoComplete="off">
      <TextField
        id="username"
        label="E-mail"
        className={classes.textField}
        margin="normal"
      />
      <TextField
        id="password"
        label="Password"
        className={classes.textField}
        type="password"
        margin="normal"
      />
      <Button variant="contained" color="primary" className={classes.button} onClick={onClickLogin}>
        Login
      </Button>
    </form>
  );
}