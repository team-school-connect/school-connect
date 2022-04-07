import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Box, Button } from "@mui/material";
import CustomAppBar from "../../appbar/CustomAppBar";
import { Link, useParams } from "react-router-dom";
import AssignmentIcon from '@mui/icons-material/Assignment';
import { DataGrid } from "@mui/x-data-grid";
import { GET_ASSIGNMENTS } from "../../../graphql/Querys";
import { useAlert } from "react-alert";
import AddIcon from "@mui/icons-material/Add";

const ViewAssignment = () => {
  const { id } = useParams();
  const { data, loading, error, fetchMore } = useQuery(GET_ASSIGNMENTS, {
    variables: {
      classId: id,
      page: 0,
    },
  });

  const [pageNum, setPageNum] = useState(0);
  const [pageData, setPageData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);

  const alert = useAlert();

  useEffect(() => {
    fetchMore({ variables: { page: pageNum, classId: id } }).then((data) => {
      // console.log(data);
      setPageData(
        data.data.getAssignments.assignments.map(({ id, name, date, dueDate }) => {
          const dateString = new Date(parseInt(date));
          const dueDateString = new Date(parseInt(dueDate));
          return {
            id,
            "Assignment Title": name,
            "Date Created": `${dateString.toDateString()} ${dateString.toLocaleTimeString()}`,
            "Due Date": `${dueDateString.toDateString()} ${dueDateString.toLocaleTimeString()}`
          };
        })
      );

      setTotalRows(data.data.getAssignments.total);
    });
  }, [pageNum]);

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
        title="Assignments"
        icon={<AssignmentIcon />}
      >
        <Link to={`/teacher/classrooms/${id}/newAssignment`} style={{ textDecoration: 'none' }}>
          <Button variant="contained" endIcon={<AddIcon />} sx={{margin: "1em"}}>
            New Assignment
          </Button>
        </Link>
      </CustomAppBar>
      <DataGrid
        page={pageNum}
        onPageChange={(nextPageNum) => setPageNum(nextPageNum)}
        pageSize={10}
        pagination
        columns={[
          { field: "Assignment Title", flex: 1, headerAlign: "center", align: "center" },
          { field: "Date Created", flex: 1, headerAlign: "center", align: "center" },
          { field: "Due Date", flex: 1, headerAlign: "center", align: "center" },
          {
            field: "View",
            flex: 1,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => {
              return (
                <Link to={`/teacher/classrooms/${id}/assignments/${params.row.id}`}>
                  <Button variant="outlined" color="success">
                    View
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
        rowsPerPageOptions={[10]}
      />
    </Box>
  );
};

export default ViewAssignment;
