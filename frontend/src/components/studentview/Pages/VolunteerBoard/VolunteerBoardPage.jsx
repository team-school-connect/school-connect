import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { GET_VOLUNTEER_POSITIONS } from "../../../../graphql/Querys";
import CustomAppBar from "../../../appbar/CustomAppBar";

import { Box } from "@mui/material";
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { useAlert } from "react-alert";

const VolunteerBoardPage = () => {
  const { data, loading, error, fetchMore } = useQuery(GET_VOLUNTEER_POSITIONS, {
    variables: {
      page: 0,
    },
  });
  const [pageNum, setPageNum] = useState(0);
  const [pageData, setPageData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);

  const alert = useAlert();

  const [detailPanelExpandedRowIds, setDetailPanelExpandedRowIds] = React.useState(
    [],
  );

  const handleDetailPanelExpandedRowIdsChange = React.useCallback((newIds) => {
    setDetailPanelExpandedRowIds(newIds);
  }, []);

  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    fetchMore({ variables: { page: pageNum } }).then((data) => {
      setPageData(
        data.data.getVolunteerPositions.VolunteerPositions.map(({ id, organizationName, positionName, positionDescription, location, startDate, endDate }) => {
          return {
            id,
            "Organization": organizationName,
            "Position": positionName,
            "Description": positionDescription,
            "Location": location,
            "Start Date": startDate,
            "End Date": endDate
          };
        })
      );

      setTotalRows(data.data.getVolunteerPositions.total);
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
      <CustomAppBar title="Volunteer Board" icon={<VolunteerActivismIcon sx={{ color: "red" }} />}/>

      <DataGridPro
        page={pageNum}
        onPageChange={(nextPageNum) => setPageNum(nextPageNum)}
        pageSize={10}
        pagination
        columns={[
          //Make the fields expandable
          { field: "Organization", flex: 1, headerAlign: "center", align: "center", expandable: true },
          { field: "Position", flex: 1, headerAlign: "center", align: "center"},
          { field: "Location", flex: 1, headerAlign: "center", align: "center"},
          { field: "Start Date", flex: 1, headerAlign: "center", align: "center"},
          { field: "End Date", flex: 1, headerAlign: "center", align: "center"},
        ]}
        //make each row expandable and show the description
        expandableRows={true}
        rows={pageData}
        paginationMode="server"
        rowCount={totalRows}
        getDetailPanelContent={({ row }) => (
          <Box sx={{ p: 2 }}>{`Description: ${row.Description}`}</Box>
        )}
        getDetailPanelHeight={() => 50}
        detailPanelExpandedRowIds={detailPanelExpandedRowIds}
        onDetailPanelExpandedRowIdsChange={handleDetailPanelExpandedRowIdsChange}
      />

      {/* <TableContainer>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell>Organization</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pageData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.Organization}</TableCell>
                <TableCell>{row.Position}</TableCell>
                <TableCell>{row.Location}</TableCell>
                <TableCell>{row["Start Date"]}</TableCell>
                <TableCell>{row["End Date"]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}

      
      
    </Box>
  );
};

export default VolunteerBoardPage;
