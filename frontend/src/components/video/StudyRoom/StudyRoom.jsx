import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Stream from "../Stream/Stream";
import PeerStream from "../PeerStream/PeerStream";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import {
  createAlreadyInRoomPeer,
  createJoiningPeer,
  handleLeaveRoom,
  removePeer,
  toggleHideStream,
  toggleMuteStream,
} from "./handlers";

import "./StudyRoom.css";
import ToggleMuteButton from "../ToggleMuteButton/ToggleMuteButton";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { Button } from "@material-ui/core";
import ToggleVideoButton from "../ToggleVideoButton/ToggleVideoButton";
import ToggleSharingButton from "../ToggleSharingButton/ToggleSharingButton";

/**Learned simple-peer from https://www.youtube.com/watch?v=R1sfHPwEH7A and https://www.youtube.com/watch?v=oxFr7we3LC8 */

const StudyRoom = () => {
  const { id } = useParams();
  const socket = useRef();
  const myStreamRef = useRef();
  const [stream, setStream] = useState(null);
  const [screen, setScreen] = useState(null);
  const [roomFull, setRoomFull] = useState(false);
  const [peers, setPeers] = useState([]);
  const peersRef = useRef([]);
  const [isSharingScreen, setIsSharingScreen] = useState(false);

  useEffect(() => {
    //setup the socket
    socket.current = io("http://localhost:5000");

    const setup = async () => {
      try {
        const myStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
          video: { width: 640, height: 360 },
        });
        myStreamRef.current.srcObject = myStream;

        setStream(myStream);

        socket.current.emit("joinStudyRoom", id);
      } catch (err) {
        console.log(err);
      }
    };

    setup();

    //handle when you get back your peers id when joining
    socket.current.on("roomPeers", (roomPeersId) => {
      let roomPeers = [];

      roomPeersId.forEach((sendingToId) => {
        //connect to an already in room peer
        const peer = createAlreadyInRoomPeer(
          sendingToId,
          myStreamRef.current.srcObject,
          socket.current
        );
        const peerObj = { id: sendingToId, peer };

        peersRef.current.push(peerObj);
        roomPeers.push(peerObj);
      });

      setPeers(roomPeers);
    });

    //handle when someone joins the room
    socket.current.on("someoneJoined", ({ joinSignal, joinId }) => {
      console.log(`${joinId} joined the room`);

      const joinPeer = createJoiningPeer(
        joinSignal,
        joinId,
        myStreamRef.current.srcObject,
        socket.current
      );

      //Update state and ref
      peersRef.current.push({ id: joinId, peer: joinPeer });
      setPeers((peers) => [...peers, { id: joinId, peer: joinPeer }]);
    });

    //handle room full
    socket.current.on("roomFull", () => {
      setRoomFull(true);
    });

    //handle when someone sends you back their signal when you join
    socket.current.on("userInRoomSignaledBack", ({ fromId, signal }) => {
      peersRef.current
        .find((peerObj) => {
          return peerObj.id === fromId;
        })
        .peer.signal(signal);
    });

    socket.current.on("userLeftRoom", (leftRoomId) => {
      const destroyingPeer = peersRef.current.find((p) => {
        return p.id === leftRoomId;
      });

      destroyingPeer.peer.destroy();

      peersRef.current = removePeer(peersRef.current, leftRoomId);

      setPeers((peers) => removePeer(peers, leftRoomId));
    });

    //clean up function when leaving
    return () => {
      handleLeaveRoom(peersRef.current, socket.current, stream);
    };
  }, []);

  const toggleShareScreen = async () => {
    try {
      if (!isSharingScreen) {
        let myScreen = await navigator.mediaDevices.getDisplayMedia();
        setScreen(myScreen);
        socket.current.emit("shareScreen");

        peersRef.current.forEach((p) => {
          p.peer.replaceTrack(
            p.peer.streams[0].getVideoTracks()[0],
            myScreen.getVideoTracks()[0],
            p.peer.streams[0]
          );
        });

        myStreamRef.current.srcObject = myScreen;

        setIsSharingScreen(true);

        return true;
      } else {
        peersRef.current.forEach((p) => {
          p.peer.replaceTrack(
            p.peer.streams[0].getVideoTracks()[0],
            stream.getVideoTracks()[0],
            p.peer.streams[0]
          );
        });

        myStreamRef.current.srcObject = stream;
        screen.getTracks().forEach((track) => {
          return track.stop();
        });
        setIsSharingScreen(false);
      }
    } catch (err) {
      console.log(err);
      setIsSharingScreen(false);
      myStreamRef.current.srcObject = stream;
      return false;
    }
  };

  return (
    <div className="container">
      {roomFull && <div>Sorry the room is full</div>}
      {myStreamRef && !roomFull && (
        <div className="headerBar">
          <Link to="/">
            <Button
              variant="contained"
              color="error"
              endIcon={<ExitToAppIcon />}
              onClick={() => {
                handleLeaveRoom(peersRef.current, socket.current);
              }}
            >
              Leave
            </Button>
          </Link>
          <ToggleSharingButton onToggle={() => toggleShareScreen()} />
          <ToggleVideoButton onToggle={() => toggleHideStream(myStreamRef.current.srcObject)} />
          <ToggleMuteButton onToggle={() => toggleMuteStream(myStreamRef.current.srcObject)} />
        </div>
      )}
      {!roomFull && (
        <Grid container spacing={1} className="streamContainer">
          <Stream streamRef={myStreamRef} muted={true} name={"You"} />
          {peers.map((peerObj) => {
            return <PeerStream key={peerObj.id} peer={peerObj.peer} />;
          })}
        </Grid>
      )}
    </div>
  );
};

export default StudyRoom;
