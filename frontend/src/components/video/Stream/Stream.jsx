import React, { useState, forwardRef } from "react";
import { CardMedia } from "@mui/material";

const Stream = forwardRef(({ muted, name }, ref) => {
  const [fullSize, setFullSize] = useState(false);

  const toggleSize = () => {
    setFullSize((size) => !size);
  };

  return (
    <CardMedia
      onClick={toggleSize}
      sx={{ width: fullSize ? "70%" : "40%" }}
      component="video"
      ref={ref}
      playsInline
      muted={muted}
      autoPlay
    />
  );
});

export default Stream;
