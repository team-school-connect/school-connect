import React from "react";
import { Button } from "@mui/material";
import PresentToAllIcon from "@mui/icons-material//PresentToAll";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";

const ToggleSharingButton = ({ onToggle, sharingScreen }) => {
  return (
    <Button
      onClick={onToggle}
      variant="contained"
      color={sharingScreen ? "error" : "success"}
      endIcon={sharingScreen ? <CancelPresentationIcon /> : <PresentToAllIcon />}
    >
      {sharingScreen ? "Stop Sharing" : "Share Screen"}
    </Button>
  );
};

export default ToggleSharingButton;
