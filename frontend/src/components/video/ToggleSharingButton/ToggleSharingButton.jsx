import React, { useState } from "react";
import { Button } from "@mui/material";
import PresentToAllIcon from "@mui/icons-material//PresentToAll";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";

const ToggleSharingButton = ({ onToggle }) => {
  const [icon, setIcon] = useState(<PresentToAllIcon />);
  const [shareMess, setShareMess] = useState("Share Screen");
  const [color, setColor] = useState("success");

  const toggle = async () => {
    const share = await onToggle();
    if (shareMess === "Share Screen" && share) {
      setIcon(<CancelPresentationIcon />);
      setShareMess("Stop Sharing");
      setColor("error");
    } else if ((shareMess === "Stop Sharing") || !share) {
      setIcon(<PresentToAllIcon />);
      setShareMess("Share Screen");
      setColor("success");
    }
  };

  return (
    <Button onClick={toggle} variant="contained" color={color} endIcon={icon}>
      {shareMess}
    </Button>
  );
};

export default ToggleSharingButton;
