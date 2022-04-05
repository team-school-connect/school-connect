import React from "react";
import { Box } from "@mui/material";
import AssignmentIcon from '@mui/icons-material/Assignment';
import CustomAppBar from "../../appbar/CustomAppBar";
import NewAssignmentForm from "./NewAssignmentForm";
import { useParams } from "react-router-dom";

const NewAssignmentPage = () => {
  const { id } = useParams();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
      }}
    >
      <CustomAppBar title="New Assignment" icon={<AssignmentIcon />}></CustomAppBar>
      <NewAssignmentForm id={id} />
    </Box>
  );
};

export default NewAssignmentPage;