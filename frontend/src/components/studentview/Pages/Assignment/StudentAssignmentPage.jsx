import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import CustomAppBar from "../../../appbar/CustomAppBar";
import AssignmentIcon from '@mui/icons-material/Assignment';
import { TablePagination } from "@mui/material";
import AssignmentCard from "./AssignmentCard";
import { useParams } from "react-router-dom";
import { GET_ASSIGNMENTS } from "../../../../graphql/Querys";
import { useAlert } from "react-alert";

const StudentAssignmentPage = () => {
  const alert = useAlert();
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

  useEffect(() => {
    fetchMore({ variables: { classId: id, page: pageNum } }).then((data) => {
      // console.log(data);
      setPageData(
        data.data.getAssignments.assignments
      );

      setTotalRows(data.data.getAssignments.total);
    });
  }, [pageNum]);

  const updateAssignment = () => {
    fetchMore({ variables: { classId: id, page: pageNum } }).then((data) => {
      // console.log(data);
      setPageData(
        data.data.getAssignments.assignments
      );
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: 'center', 
        height: "100%",
        width: "100%",
      }}>
      <CustomAppBar
          title="Assignments"
          icon={<AssignmentIcon />}
        ></CustomAppBar>
      <Box sx={{
        display: 'flex',
        alignItems: 'center', 
        flexDirection: 'column',
        gap: '10px',
        width: '50%'
        }}>
        {pageData.length > 0 &&
          !loading &&
          pageData.map((assign) =>
            <AssignmentCard key={assign.id} 
                assignId={assign.id} 
                title={assign.name} 
                description={assign.description} 
                date={assign.dueDate}
                submitted={assign.submitted}
                updateAssign={updateAssignment}
              />
          )}
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
  )
}

export default StudentAssignmentPage;