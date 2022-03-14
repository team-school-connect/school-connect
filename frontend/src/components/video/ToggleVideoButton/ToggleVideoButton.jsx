import React, { useState } from "react";
import { Button } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

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
