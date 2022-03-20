import React from "react";
import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CustomAppBar from "../../appbar/CustomAppBar";
import NewClassroomForm from "./NewClassroomForm";

const NewClassroomRoomPage = () => {
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
      <NewClassroomForm />
    </Box>
  );
};

export default NewClassroomRoomPage;
