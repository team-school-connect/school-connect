import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { DataGrid } from "@mui/x-data-grid";
import { GET_MY_CLASSROOMS } from "../../../../graphql/Querys";
import { Link } from "react-router-dom";
import CustomAppBar from "../../../appbar/CustomAppBar";

import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { useAlert } from "react-alert";

const VolunteerBoardPage = () => {
  const { data, loading, error, fetchMore } = useQuery(GET_MY_CLASSROOMS, {
    variables: {
      page: 0,
    },
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageData, setPageData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);

  const alert = useAlert();

  useEffect(() => {
    fetchMore({ variables: { page: pageNum } }).then((data) => {
      console.log(data);
      setPageData(
        data.data.getMyClassrooms.classrooms.map(
          ({ id, name, teacher: { firstName, lastName, email } }) => {
            return {
              id,
              "Class Name": name,
              Teacher: `${firstName} ${lastName}`,
              "Teacher Email": email,
            };
          }
        )
      );

      setTotalRows(data.data.getMyClassrooms.total);
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
      <CustomAppBar title="Volunteer Board" icon={<VolunteerActivismIcon sx={{ color: "#5e94ff" }} />} />

      <DataGrid
        page={pageNum}
        onPageChange={(nextPageNum) => setPageNum(nextPageNum)}
        pageSize={10}
        pagination
        columns={[
          { field: "Position Name", flex: 1, headerAlign: "center", align: "center" },
          { field: "Location", flex: 1, headerAlign: "center", align: "center" },
          { field: "Poster Email", flex: 1, headerAlign: "center", align: "center" },
          {
            field: "View",
            flex: 1,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => {
              return (
                <Link to={`/student/volunteerBoard/${params.row.id}`}>
                  <Button variant="outlined" color="success">
                    View More Details
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

export default VolunteerBoardPage;
