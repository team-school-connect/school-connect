import React, { useState, forwardRef } from "react";
import { CardMedia, Typography, Box, IconButton, Tooltip } from "@mui/material";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";

const Stream = forwardRef(({ muted, name }, ref) => {
  const [fullSize, setFullSize] = useState(false);

  const toggleSize = () => {
    setFullSize((size) => !size);
  };

  return (
    <Box sx={{ position: "relative", width: fullSize ? "70%" : "40%" }}>
      <Typography
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          paddingLeft: 2,
          paddingRight: 2,
          color: "white",
          background: "black",
        }}
      >
        {name}
      </Typography>
      <Tooltip title="Expand">
        <IconButton
          onClick={toggleSize}
          sx={{
            position: "absolute",
            top: 0,
            right: 0,

            color: "white",
            background: "black",
            zIndex: 1,
          }}
        >
          <AspectRatioIcon />
        </IconButton>
      </Tooltip>
      <CardMedia component="video" ref={ref} playsInline muted={muted} autoPlay />
    </Box>
  );
});

export default Stream;
