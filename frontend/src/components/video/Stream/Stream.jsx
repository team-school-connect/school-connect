import React, {useState} from "react";
import { CardMedia } from "@mui/material";

const Stream = ({ streamRef, muted, name }) => {
  const [fullSize, setFullSize] = useState(false);

  const toggleSize = () => {
    setFullSize((size) => !size);
  }

  return (
    <CardMedia
      onClick={toggleSize}
      sx={{ width: fullSize ? "70%" : "40%" }}
      component="video"
      ref={streamRef}
      playsInline
      muted={muted}
      autoPlay
    />
  );
};

export default Stream;
