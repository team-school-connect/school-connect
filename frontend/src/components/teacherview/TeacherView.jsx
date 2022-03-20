import { AppBar, Box, Typography } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import TeacherSideNav from "./TeacherSideNav/TeacherSideNav";

const TeacherView = () => {
  return (
    <Box sx={{ display: "flex", height: "100%", width:"100%" }}>
        <TeacherSideNav />
        <Outlet />
    </Box>
  );
};

export default TeacherView;
