import React, { useState } from "react";
import { Button } from "@material-ui/core";
import VolumeOffIcon from "@material-ui/icons/VolumeUp";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";

const ToggleMuteButton = ({ onToggle }) => {
  const [icon, setIcon] = useState(<VolumeOffIcon />);
  const [muteMess, setMuteMess] = useState("Mute");
  const [color, setColor] = useState("primary");

  const toggle = () => {
    onToggle();
    if (muteMess === "Mute") {
      setIcon(<VolumeUpIcon />);
      setMuteMess("Unmute");
      setColor("error");
    } else {
      setIcon(<VolumeOffIcon />);
      setMuteMess("Mute");
      setColor("primary");
    }
  };

  return (
    <Button
      variant="contained"
      endIcon={icon}
      onClick={toggle}
      color={color}
      style={{ width: "8em" }}
    >
      {muteMess}
    </Button>
  );
};

export default ToggleMuteButton;
