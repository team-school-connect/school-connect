import React from "react";
import { Box, Button } from "@mui/material";
import ClassIcon from "@mui/icons-material/Class";
import AddIcon from "@mui/icons-material/Add";
import CustomAppBar from "../../../appbar/CustomAppBar";
import { Link } from "react-router-dom";

const ClassRoomPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
      }}
    >
      <CustomAppBar title="My Classes" icon={<ClassIcon sx={{ color: "#5e94ff" }} />}>
        <Link to="join">
          <Button variant="contained" endIcon={<AddIcon />}>
            Join Classroom
          </Button>
        </Link>
      </CustomAppBar>
      
    </Box>
  );
};

export default ClassRoomPage;
