import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { DataGrid } from "@mui/x-data-grid";
import { GET_MY_CLASSROOMS } from "../../../graphql/Querys";
import { Link } from "react-router-dom";
import CustomAppBar from "../../appbar/CustomAppBar";

import { AppBar, Box, Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { CopyToClipboard } from "react-copy-to-clipboard";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useAlert } from "react-alert";

const TeacherVolunteerBoardPage = () => {
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
        data.data.getMyClassrooms.classrooms.map(({ id, name, code }) => {
          return {
            id,
            "Class Name": name,
            "Class Code": code,
          };
        })
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
      <CustomAppBar title="Volunteer Board" icon={<VolunteerActivismIcon sx={{ color: "red" }} />}>
        <Link to="/teacher/classrooms/new">
          <Button variant="contained" endIcon={<AddIcon />}>
            Create New Volunteer Position
          </Button>
        </Link>
      </CustomAppBar>

      <DataGrid
        page={pageNum}
        onPageChange={(nextPageNum) => setPageNum(nextPageNum)}
        pageSize={10}
        pagination
        columns={[
          { field: "Class Name", flex: 1, headerAlign: "center", align: "center" },
          {
            field: "Class Code",
            flex: 1,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => {
              return (
                <div>
                  <span>{params.row["Class Code"]}</span>
                  <CopyToClipboard
                    text={params.row["Class Code"]}
                    onCopy={() => alert.show("Copied to clipboard")}
                  >
                    <IconButton>
                      <ContentCopyIcon />
                    </IconButton>
                  </CopyToClipboard>
                </div>
              );
            },
          },
          {
            field: "View",
            flex: 1,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => {
              return (
                <Link to={`/teacher/volunteerBoard/${params.row.id}`}>
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
      />
    </Box>
  );
};

export default TeacherVolunteerBoardPage;
