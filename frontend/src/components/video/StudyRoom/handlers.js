import Peer from "simple-peer";

/**Creates a peer that is joining a room that you are currently in */
export const createJoiningPeer = (joinSignal, joinId, myStream, socket) => {
  const peer = new Peer({
    initiator: false,
    trickle: false,
    stream: myStream,
  });

  //send back signal
  peer.on("signal", (signal) => {
    socket.emit("signalJoiningUser", { sendingToId: joinId, signal });
  });

  peer.signal(joinSignal);

  return peer;
};

/**Creates a peer that is already in the room you just joined */
export const createAlreadyInRoomPeer = (sendingToId, myStream, socket) => {
  const peer = new Peer({
    initiator: true,
    trickle: false,
    stream: myStream,
  });

  peer.on("signal", (signal) => {
    socket.emit("signalUserInRoom", { sendingToId, signal });
  });

  return peer;
};

export const stopStream = (stream) => {
  if (stream) {
    stream.getVideoTracks().forEach((track) => {
      track.stop();
    });
    stream.getAudioTracks().forEach((track) => {
      track.stop();
    });
  }
};


export const toggleMuteStream = (stream) => {
  const muted = stream.getAudioTracks()[0].enabled;
  stream.getAudioTracks()[0].enabled = !muted;
};

export const hideStream = (stream) => {
  const visibility = stream.getVideoTracks()[0].enabled;
  stream.getVideoTracks()[0].enabled = false;
};

export const showStream = (stream) => {
  const visibility = stream.getVideoTracks()[0].enabled;
  stream.getVideoTracks()[0].enabled = true;
};
