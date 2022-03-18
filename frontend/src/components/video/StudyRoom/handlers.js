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

//Destroy all connections when leaving a room
export const handleLeaveRoom = (peers, socket) => {
  console.log("cleaning up");

  peers.forEach((peerObj) => {
    peerObj.peer.destroy(true);
  });

  socket.disconnect();
};

export const stopStream = (stream) => {
  if (stream) {
    console.log("stopping stream");
    stream.getVideoTracks().forEach((track) => {
      track.stop();
    });
    stream.getAudioTracks().forEach((track) => {
      track.stop();
    });
  }
};

export const removePeer = (peers, peerId) => {
  return peers.filter((peer) => {
    return peer.id !== peerId;
  });
};

export const toggleMuteStream = (stream) => {
  const muted = stream.getAudioTracks()[0].enabled;
  stream.getAudioTracks()[0].enabled = !muted;
};

export const toggleHideStream = (stream) => {
  const visibility = stream.getVideoTracks()[0].enabled;
  stream.getVideoTracks()[0].enabled = !visibility;
};
