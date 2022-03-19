import React from "react";

import { AppBar, Typography, Toolbar } from "@mui/material";

const CustomAppBar = ({ title, children, icon }) => {
  return (
    <AppBar
      sx={{
        display: "flex",
        position: "sticky",
        paddingBottom: "1em",
        paddingTop: "2em",
        backgroundColor: "rgb(51, 51, 51)",
        marginBottom: "1em",
        width: "100%",
        alignItems: "center",
      }}
    >
      <Typography
        sx={{
          fontWeight: 600,
          color: "white",
        }}
        variant="h4"
      >
        {title}
      </Typography>
      {icon}
      <Toolbar>{children}</Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
