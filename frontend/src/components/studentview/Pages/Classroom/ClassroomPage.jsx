import React, { useEffect } from "react";
import { Box, Button } from "@mui/material";
import ClassIcon from "@mui/icons-material/Class";
import AddIcon from "@mui/icons-material/Add";
import CustomAppBar from "../../../appbar/CustomAppBar";
import { Link, useParams } from "react-router-dom";
import { GET_CLASSROOM } from "../../../../graphql/Querys";
import { useQuery } from "@apollo/client";

const ClassRoomPage = () => {
  const { id } = useParams();

  const { data, loading, error } = useQuery(GET_CLASSROOM, {
    variables: {
      classId: id,
    },
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

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
        title={!loading && data.getClassroom.name}
        icon={<ClassIcon sx={{ color: "#5e94ff" }} />}
      ></CustomAppBar>
      {/* <Announcements classId={id} /> */}
    </Box>
  );
};

export default ClassRoomPage;
