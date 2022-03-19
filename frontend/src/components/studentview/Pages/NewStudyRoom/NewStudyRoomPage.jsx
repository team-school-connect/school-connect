import React from "react";
import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CustomAppBar from "../../../appbar/CustomAppBar";
import NewStudyRoomForm from "./NewStudyRoomForm";

const NewStudyRoomPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
      }}
    >
      <CustomAppBar
        title="New Study Room"
        icon={<AddIcon sx={{ color: "#5effa1" }} />}
      ></CustomAppBar>
      <NewStudyRoomForm />
    </Box>
  );
};

export default NewStudyRoomPage;
