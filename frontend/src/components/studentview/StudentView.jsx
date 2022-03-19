import { AppBar, Box, Typography } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import StudentSideNav from "./StudentSideNav/StudentSideNav";

const StudentView = () => {
  return (
    <Box sx={{ display: "flex", height: "100%", width:"100%" }}>
        <StudentSideNav />
        <Outlet />
    </Box>
  );
};

export default StudentView;
