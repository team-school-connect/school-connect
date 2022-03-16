import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { DataGrid } from "@mui/x-data-grid";
import { STUDY_ROOM_QUERY } from "../../graphql/Querys";

import "./StudyRoomListing.css";

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
      setPageData(
        data.data.getStudyRooms.studyRooms.map(({ _id, roomName, subject, participantCount }) => {
          return {
            id: _id,
            "Room Name": roomName,
            Subject: subject,
            Participants: `${participantCount}/4`,
          };
        })
      );

      setTotalRows(data.data.getStudyRooms.totalRows);
    });
  }, [pageNum]);

  return (
    <div style={{ display: "flex", height: "100%", width: "90%" }}>
      <DataGrid
        page={pageNum}
        onPageChange={(nextPageNum) => setPageNum(nextPageNum)}
        pageSize={10}
        pagination
        columns={[
          { field: "Room Name", flex: 1},
          { field: "Subject", flex: 1},
          { field: "Participants", flex: 1 },
        ]}
        rows={pageData}
        paginationMode="server"
        rowCount={totalRows}
      />
    </div>
  );
};

export default StudyRoomListing;
