import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { DataGrid } from "@mui/x-data-grid";
import { GET_SINGLE_VOLUNTEER_POSITION } from "../../../graphql/Querys";
import { Link, useParams } from "react-router-dom";
import CustomAppBar from "../../appbar/CustomAppBar";

import { Box, Button, Grid, TablePagination } from "@mui/material";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import { useAlert } from "react-alert";

const TeacherVolunteerPositionPage = (props) => {
  const { id } = useParams();

  const { data, loading, error, fetchMore } = useQuery(GET_SINGLE_VOLUNTEER_POSITION, {
    variables: {
      _id: id,
    },
  });

  const [pageNum, setPageNum] = useState(0);
  const [pageData, setPageData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);

  const alert = useAlert();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        width: "100%",
      }}
    >
      <CustomAppBar
        title={"Volunteer Position"}
        icon={<VolunteerActivismIcon sx={{ color: "red" }} />}
      ></CustomAppBar>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "flex-start",
        }}
      >
        <Grid container sx={{ paddingLeft: "5em", paddingRight: "5em" }}>
          {/* Show the volunteer position data */}
          {!loading && data && data.getSingleVolunteerPosition && (
            <Grid item xs={12}>
              <Box sx={{ padding: "1em" }}>
                <h2>{data.getSingleVolunteerPosition.organizationName}</h2>
                <h2>{data.getSingleVolunteerPosition.positionName}</h2>
                <p>{data.getSingleVolunteerPosition.positionDescription}</p>
                <p>{data.getSingleVolunteerPosition.location}</p>
                <p>{data.getSingleVolunteerPosition.startDate}</p>
                <p>{data.getSingleVolunteerPosition.endDate}</p>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default TeacherVolunteerPositionPage;
