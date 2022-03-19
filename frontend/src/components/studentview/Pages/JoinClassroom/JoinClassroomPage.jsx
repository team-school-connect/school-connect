import React from "react";
import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CustomAppBar from "../../../appbar/CustomAppBar";
import JoinClassroomForm from "./JoinClassroomForm";

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
        title="Join a Classroom"
        icon={<AddIcon sx={{ color: "#5e94ff" }} />}
      ></CustomAppBar>
      <JoinClassroomForm />
    </Box>
  );
};

export default NewStudyRoomPage;
