import React from "react";
import { Box } from "@mui/material";
import CustomAppBar from "../../appbar/CustomAppBar";
import { TeacherSignupForm } from "../../signup/TeacherSignupForm";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const NewTeacherFormPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
      }}
    >
      <CustomAppBar title="New Teacher" icon={<PersonAddIcon sx={{color:"#c2adff"}}/>}></CustomAppBar>
      <TeacherSignupForm />
    </Box>
  );
};

export default NewTeacherFormPage;
