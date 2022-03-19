import React, { useState } from "react";
import { Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material//Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const ToggleVideoButton = ({ onToggle, showingVideo }) => {


  return (
    <Button
      variant="contained"
      endIcon={showingVideo ? <VisibilityOffIcon /> : <VisibilityIcon />}
      onClick={onToggle}
      color={showingVideo ? "error" : "primary"}
    >
      {showingVideo ? "Hide Video" : "Show Video"}
    </Button>
  );
};

export default ToggleVideoButton;
