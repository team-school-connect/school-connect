import React, { useState } from "react";
import { Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material//Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const ToggleVideoButton = ({ onToggle }) => {
  const [icon, setIcon] = useState(<VisibilityOffIcon />);
  const [videoMess, setVideoMess] = useState("Hide Video");
  const [color, setColor] = useState("primary");

  const toggle = () => {
    onToggle();

    if (videoMess === "Hide Video") {
      setIcon(<VisibilityIcon />);
      setVideoMess("Show Video");
      setColor("error");
    } else {
      setIcon(<VisibilityOffIcon />);
      setVideoMess("Hide Video");
      setColor("primary");
    }
  };

  return (
    <Button variant="contained" endIcon={icon} onClick={toggle} color={color}>
      {videoMess}
    </Button>
  );
};

export default ToggleVideoButton;
