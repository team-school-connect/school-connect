import React from "react";

const Stream = ({ streamRef, muted, name }) => {
  return <video ref={streamRef} playsInline muted={muted} autoPlay />;
};

export default Stream;
