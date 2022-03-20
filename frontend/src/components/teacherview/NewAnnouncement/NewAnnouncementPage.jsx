import React from "react";
import { Box } from "@mui/material";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import CustomAppBar from "../../appbar/CustomAppBar";
import NewAnnouncementForm from "./NewAnnouncementForm";
import { useParams } from "react-router-dom";

const NewAnnouncementPage = () => {
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
      <CustomAppBar title="New Announcement" icon={<AnnouncementIcon />}></CustomAppBar>
      <NewAnnouncementForm id={id} />
    </Box>
  );
};

export default NewAnnouncementPage;
