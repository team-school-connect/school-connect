import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useParams } from "react-router-dom";
import CustomAppBar from "../../appbar/CustomAppBar";
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Box, Button, Typography } from "@mui/material";
import { GET_SUBMISSIONS, GET_ASSIGNMENT } from "../../../graphql/Querys";

const AssignmentPage = () => {
  const uri = process.env.REACT_APP_API_URI ? process.env.REACT_APP_API_URI : "http://localhost:3000/";
  const {id, assignId } = useParams();
  const { data, loading, error, fetchMore } = useQuery(GET_SUBMISSIONS, {
    variables: {
      classId: id,
      assignmentId: assignId,
      page: 0,
    },
  });

  const [pageNum, setPageNum] = useState(0);
  const [pageData, setPageData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);

  const {
    data: assignData,
    loading: assignLoading,
    error: assignError,
  } = useQuery(GET_ASSIGNMENT, {
    variables: {
      assignmentId: assignId,
    },
  });

  useEffect(() => {
    console.log(assignData);
  }, [assignData]);

  useEffect(() => {
    fetchMore({ variables: { page: pageNum, classId: id, assignmentId: assignId } }).then((data) => {
      console.log(data);
      setPageData(
        data.data.getStudentSubmissions.submissions.map(({ id, userId, date }) => {
          const dateString = new Date(parseInt(date));
          return {
            id,
            "User": userId,
            "Date Submitted": `${dateString.toDateString()} ${dateString.toLocaleTimeString()}`,
          };
        })
      );

      setTotalRows(data.data.getStudentSubmissions.total);
    });
  }, [pageNum]);

  return (
    !assignLoading &&
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
      }}
    >
      <CustomAppBar
        title={assignData.getAssignment.name}
        icon={<AssignmentIcon />}
      >
        <Box>
          <Typography>
            {assignData.getAssignment.description}
          </Typography>
          <Typography>
            Due Date: {`${new Date(parseInt(assignData.getAssignment.dueDate)).toDateString()} 
            ${new Date(parseInt(assignData.getAssignment.dueDate)).toLocaleTimeString()}`}
          </Typography>
        </Box>
      </CustomAppBar>
      <DataGrid
        page={pageNum}
        onPageChange={(nextPageNum) => setPageNum(nextPageNum)}
        pageSize={10}
        pagination
        columns={[
          { field: "User", flex: 1, headerAlign: "center", align: "center" },
          { field: "Date Submitted", flex: 1, headerAlign: "center", align: "center" },
          {
            field: "View",
            flex: 1,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => {
              return (
                <Button variant="contained" color="success" href={`${uri}/submission/${params.row.id}`}>
                  Download
                </Button>
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

export default AssignmentPage;