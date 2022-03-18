import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { DataGrid } from "@mui/x-data-grid";
import { STUDY_ROOM_QUERY } from "../../../graphql/Querys";

import "./StudyRoomListing.css";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import { Link } from "react-router-dom";

const StudyRoomListing = () => {
  const { data, loading, error, fetchMore } = useQuery(STUDY_ROOM_QUERY, {
    variables: {
      page: 0,
    },
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageData, setPageData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);

  useEffect(() => {
    fetchMore({ variables: { page: pageNum } }).then((data) => {
      console.log(data);
      setPageData(
        data.data.getStudyRooms.studyRooms.map(
          ({ _id, roomName, subject, participantCount, createdOn }) => {
            console.log(createdOn);
            return {
              id: _id,
              "Room Name": roomName,
              Subject: subject,
              "Created On": new Date(parseInt(createdOn)).toLocaleDateString(),
              Participants: `${participantCount}/4`,
            };
          }
        )
      );

      setTotalRows(data.data.getStudyRooms.totalRows);
    });
  }, [pageNum]);

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
      <AppBar
        sx={{
          display: "flex",
          position: "sticky",
          paddingBottom: "1em",
          paddingTop: "2em",
          backgroundColor: "rgb(51, 51, 51)",
          marginBottom: "1em",
          width: "100%",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            color: "white",
          }}
          variant="h4"
        >
          Study Rooms
        </Typography>
        <WorkspacesIcon sx={{ color: "#5effa1" }} />
        <Toolbar>
          <Button variant="contained" endIcon={<AddIcon />}>
            Create New Room
          </Button>
        </Toolbar>
      </AppBar>

      <DataGrid
        page={pageNum}
        onPageChange={(nextPageNum) => setPageNum(nextPageNum)}
        pageSize={10}
        pagination
        columns={[
          { field: "Room Name", flex: 1, headerAlign: "center", align: "center" },
          { field: "Subject", flex: 1, headerAlign: "center", align: "center" },
          { field: "Created On", flex: 1, headerAlign: "center", align: "center" },
          { field: "Participants", flex: 1, headerAlign: "center", align: "center" },
          {
            field: "Join Room",
            flex: 1,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => {
              let text = "Join";
              let color = "success";
              let disabled = false;
              if (params.row.Participants === "4/4") {
                text = "Full";
                color = "error";
                disabled = true;
              }
              if (params.row.Participants === "4/4") {
                return (
                  <Button variant="outlined" disabled={true}>
                    Full
                  </Button>
                );
              }
              return (
                <Link to={`/studyRooms/${params.row.id}/`}>
                  <Button variant="outlined" color="success">
                    Join
                  </Button>
                </Link>
              );
            },
            disableColumnMenu: true,
            disableReorder: true,
          },
        ]}
        rows={pageData}
        paginationMode="server"
        rowCount={totalRows}
      />
    </Box>
  );
};

export default StudyRoomListing;
