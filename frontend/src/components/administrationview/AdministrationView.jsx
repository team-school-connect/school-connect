import { Box } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import AdministrationNav from "./administrationnav/AdministrationNav";

const AdministrationView = () => {
  return (
    <Box sx={{ display: "flex", height: "100%", width:"100%" }}>
        <AdministrationNav />
        <Outlet />
    </Box>
  );
};

export default AdministrationView;
