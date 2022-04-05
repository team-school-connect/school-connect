import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { DataGrid } from "@mui/x-data-grid";
import { GET_CLASSROOM_ANNOUCEMENTS, GET_CLASSROOM } from "../../../graphql/Querys";
import { Link, useParams } from "react-router-dom";
import CustomAppBar from "../../appbar/CustomAppBar";

import { Box, Button, Grid, TablePagination } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AssignmentIcon from '@mui/icons-material/Assignment';
import ClassIcon from "@mui/icons-material/Class";
import { useAlert } from "react-alert";
import Announcement from "../../annoucement/Announcement";

const TeacherClassroomPage = () => {
  const { id } = useParams();

  const { data, loading, error, fetchMore } = useQuery(GET_CLASSROOM_ANNOUCEMENTS, {
    variables: {
      classId: id,
      page: 0,
    },
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageData, setPageData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);

  const alert = useAlert();

  const {
    data: classData,
    loading: classLoading,
    error: classError,
  } = useQuery(GET_CLASSROOM, {
    variables: {
      classId: id,
    },
  });

  useEffect(() => {
    console.log(classData);
  }, [classData]);

  useEffect(() => {
    fetchMore({ variables: { classId: id, page: pageNum } }).then((data) => {
      console.log(data);
      setPageData(
        data.data.getAnnouncements.announcements.map(({ id, title, content, date }) => {
          return {
            id,
            Title: title,
            Content: content,
            date: new Date(parseInt(date)).toLocaleString(),
          };
        })
      );

      setTotalRows(data.data.getAnnouncements.total);
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
      <CustomAppBar
        title={!classLoading && classData.getClassroom.name}
        icon={<ClassIcon sx={{ color: "#5e94ff" }} />}
      >
        <Link to="newAnnouncement" style={{ textDecoration: 'none' }}>
          <Button variant="contained" endIcon={<AddIcon />} sx={{margin: "1em"}}>
            New Announcement
          </Button>
        </Link>
        <Link to="assignments" style={{ textDecoration: 'none' }}>
          <Button variant="contained" endIcon={<AssignmentIcon />} sx={{margin: "1em"}}>
            Assignments
          </Button>
        </Link>
      </CustomAppBar>

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
          {pageData.length > 0 &&
            !loading &&
            !classLoading &&
            classData.getClassroom.teacher &&
            pageData.map((announcement) => {
              const { Title, Content, id, date } = announcement;
              const { teacher } = classData.getClassroom;
              return (
                <Grid key={id} sx={{ width: "100%" }}>
                  <Announcement
                    title={Title}
                    date={date}
                    content={Content}
                    name={`${teacher.firstName} ${teacher.lastName}`}
                  />
                </Grid>
              );
            })}
        </Grid>
        <TablePagination
          sx={{ paddingBottom: "1em" }}
          component="div"
          count={totalRows}
          page={pageNum}
          onPageChange={(event, nextPageNum) => setPageNum(nextPageNum)}
          rowsPerPage={10}
          rowsPerPageOptions={[10]}
        />
      </Box>

    </Box>
  );
};

export default TeacherClassroomPage;
