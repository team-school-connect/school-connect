import { CardContent, Card, Typography, Box, CardHeader } from "@mui/material";
import React from "react";

const Announcement = ({title,name,content, date}) => {
  return (
    <Card sx={{ margin: "1em", padding: "1em", width: "100%" }}>
      <CardHeader title={title} subheader={name} />
      <CardContent>
        <Typography variant="body2" color="textSecondary">
          {content}
        </Typography>
        <Typography sx={{ textAlign: "center" }} variant="caption" color="textSecondary">
          {date}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Announcement;
