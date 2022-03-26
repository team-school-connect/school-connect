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
  hideStream,
  removePeer,
  showStream,
  stopStream,
  toggleMuteStream,
} from "./handlers";

import "./StudyRoom.css";
import ToggleMuteButton from "../ToggleMuteButton/ToggleMuteButton";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Button, Toolbar, Typography, Box } from "@mui/material";
import ToggleVideoButton from "../ToggleVideoButton/ToggleVideoButton";
import ToggleSharingButton from "../ToggleSharingButton/ToggleSharingButton";
import Whiteboard from "../Whiteboard/Whiteboard";

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
  const [inRoom, setInRoom] = useState(false);

  //controls
  const [isMuted, setIsMuted] = useState(false);
  const [isShowingVideo, setIsShowingVideo] = useState(true);
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

    //handle when you get back your peers id when joining, call each one of them
    socket.current.on("roomPeers", (roomPeersId) => {
      let roomPeers = [];

      roomPeersId.forEach((sendingToId) => {
        //connect to an already in room peer

        //only create peer if they are not in the list
        if (!peersRef.current.find((p) => p.id === id)) {
          const peer = createAlreadyInRoomPeer(
            sendingToId,
            myStreamRef.current.srcObject,
            socket.current
          );
          const peerObj = { id: sendingToId, peer };

          peersRef.current.push(peerObj);
          roomPeers.push(peerObj);
        }
      });

      setPeers(roomPeers);
      setInRoom(true);
    });

    //handle when someone joins the room
    socket.current.on("someoneJoined", ({ joinSignal, joinId }) => {
      console.log(`${joinId} joined the room`);

      //only create peer if they are not in the list
      if (!peersRef.current.find((p) => p.id === id)) {
        const joinPeer = createJoiningPeer(
          joinSignal,
          joinId,
          myStreamRef.current.srcObject,
          socket.current
        );

        //Update state and ref
        peersRef.current.push({ id: joinId, peer: joinPeer });
        setPeers((peers) => [...peers, { id: joinId, peer: joinPeer }]);
      }
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
      console.log("USER LEFT THE ROOM");
      const destroyingPeer = peersRef.current.find((p) => {
        return p.id === leftRoomId;
      });

      destroyingPeer.peer.destroy();

      peersRef.current = removePeer(peersRef.current, leftRoomId);

      setPeers((peers) => removePeer(peers, leftRoomId));
    });

    //handle getting back stroke
    socket.current.on("pathData", (path) => {
      console.log(path);
    });

    //clean up function when leaving
    return () => {
      handleLeaveRoom(peersRef.current, socket.current);
    };
  }, []);

  useEffect(() => {
    return () => {
      stopStream(stream);
    };
  }, [stream]);

  useEffect(() => {
    if (roomFull) {
      stopStream(stream);
    }
  }, [roomFull]);

  const shareScreen = async () => {
    try {
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

      myScreen.onended = () => {
        console.log("ended stream");
      };

      myStreamRef.current.srcObject = myScreen;
      console.log("sharing");

      setIsSharingScreen(true);
    } catch (err) {
      console.log(err);
      setIsSharingScreen(false);
      myStreamRef.current.srcObject = stream;
    }
  };

  const stopShareScreen = async () => {
    try {
      peersRef.current.forEach((p) => {
        p.peer.replaceTrack(
          p.peer.streams[0].getVideoTracks()[0],
          stream.getVideoTracks()[0],
          p.peer.streams[0]
        );
      });
      console.log("stopped sharing");

      myStreamRef.current.srcObject = stream;
      screen.getTracks().forEach((track) => {
        return track.stop();
      });
      setIsSharingScreen(false);
    } catch (err) {
      console.log(err);
      myStreamRef.current.srcObject = stream;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",

        width: "100%",
        height: "fit-content",
        minHeight: "100%",
        alignItems: "center",
        background: "#333333",
        paddingBottom: "1em",
        paddingTop: "2em",
      }}
    >
      {roomFull && (
        <Typography sx={{ color: "white" }}>Sorry this room is full or does not exist.</Typography>
      )}
      {inRoom && myStreamRef && !roomFull && (
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", width: "80%" }}>
          <Link to="/student/studyRooms">
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
          <ToggleSharingButton
            sharingScreen={isSharingScreen}
            onToggle={() => {
              if (!isSharingScreen) {
                shareScreen();
              } else {
                stopShareScreen();
              }
            }}
          />
          <ToggleVideoButton
            showingVideo={isShowingVideo}
            onToggle={() => {
              if (isShowingVideo) {
                hideStream(stream);
                setIsShowingVideo(false);
              } else {
                showStream(stream);
                setIsShowingVideo(true);
              }
            }}
          />
          <ToggleMuteButton onToggle={() => toggleMuteStream(stream)} />
          <Button
            onClick={() => {
              socket.current.emit("strokePath", { roomId: id, path: "path" });
            }}
          >
            Send Path
          </Button>
        </Toolbar>
      )}
      {!roomFull && (
        <Grid container spacing={1} className="streamContainer">
          <Stream ref={myStreamRef} muted={true} name={"You"} />
          {peers
            .filter((peerObj, index) => {
              return peers.findIndex((p) => p.id === peerObj.id) === index;
            })
            .map((peerObj) => {
              return <PeerStream key={peerObj.id} peer={peerObj.peer} />;
            })}
        </Grid>
      )}
      <Whiteboard />
    </Box>
  );
};

export default StudyRoom;
