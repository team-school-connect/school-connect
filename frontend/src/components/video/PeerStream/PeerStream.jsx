import React, { useEffect, useRef } from "react";
import Stream from "../Stream/Stream";

const PeerStream = ({ peer, name }) => {
  const streamRef = useRef();

  useEffect(() => {
    peer.on("stream", (stream) => {
      console.log("recieved stream");
      streamRef.current.srcObject = stream;
    });
  }, []);

  return <Stream ref={streamRef} muted={false} name={name} />;
};

export default PeerStream;
