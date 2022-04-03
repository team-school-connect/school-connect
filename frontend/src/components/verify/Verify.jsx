import React, { useEffect } from "react";
import { Grid, Paper, Avatar, TextField, Button } from "@mui/material";
import { useState } from "react";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import { VERIFY_ACCOUNT_MUTATION } from "../../graphql/Mutations";
import { useMutation } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "react-alert";

const Verify = () => {
  const [verifyAccount, { error }] = useMutation(VERIFY_ACCOUNT_MUTATION);
  const { code } = useParams();
  const alert = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    verifyAccount({
      variables: {
        code,
      },
    })
      .then(() => {
        alert.success("Your account has been verified!");
        navigate("/login");
      })
      .catch((err) => {
        alert.error(err.toString());
        navigate("/login");
      });
  }, []);

  return <div></div>;
};

export default Verify;
