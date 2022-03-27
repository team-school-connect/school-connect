import React from "react";
import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CustomAppBar from "../../appbar/CustomAppBar";
import NewVolunteerPositionForm from "./NewVolunteerPositionForm";

const NewVolunteerPositionPage = () => {
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
        title="Add a New Volunteer Position"
        icon={<AddIcon sx={{ color: "#5e94ff" }} />}
      ></CustomAppBar>
      <NewVolunteerPositionForm />
    </Box>
  );
};

export default NewVolunteerPositionPage;
