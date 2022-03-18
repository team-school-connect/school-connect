import { AppBar, Box, Typography } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import StudentNav from "./studentnav/StudentNav";

const StudentView = () => {
  return (
    <Box sx={{ display: "flex", height: "100%", width:"100%" }}>
        <StudentNav />
        <Outlet />
    </Box>
  );
};

export default StudentView;
