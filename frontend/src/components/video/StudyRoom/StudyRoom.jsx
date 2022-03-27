import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAlert } from "react-alert";
import Stream from "../Stream/Stream";
import PeerStream from "../PeerStream/PeerStream";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import { io } from "socket.io-client";
import {
  createAlreadyInRoomPeer,
  createJoiningPeer,
  hideStream,
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
import SocketWhiteboard from "../SocketWhiteboard/SocketWhiteboard";

/**Learned simple-peer from https://www.youtube.com/watch?v=R1sfHPwEH7A and https://www.youtube.com/watch?v=oxFr7we3LC8 */

const StudyRoom = () => {
  const { id } = useParams();
  const socket = useRef();
  const alert = useAlert();

  //My video streams
  const [camera, setCamera] = useState(null);
  const [screen, setScreen] = useState(null);
  const myStreamRef = useRef();

  //Whiteboard controls
  const whiteboardRef = useRef();
  const [whiteBoardLoaded, setWhiteBoardLoaded] = useState(false);

  //Peers
  const [peers, setPeers] = useState([]);
  const peersRef = useRef([]);

  //checks
  const [roomFull, setRoomFull] = useState(false);
  const [inRoom, setInRoom] = useState(false);
  const [isAuth, setIsAuth] = useState(true);

  //controls
  const [isShowingVideo, setIsShowingVideo] = useState(true);
  const [isSharingScreen, setIsSharingScreen] = useState(false);

  useEffect(() => {
    const setup = async () => {
      try {
        socket.current = io("http://localhost:5000", { withCredentials: true });
        const myCamera = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
          video: { width: 640, height: 360 },
        });
        myStreamRef.current.srcObject = myCamera;

        setCamera(myCamera);

        socket.current.emit("joinStudyRoom", id);
      } catch (err) {
        console.log(err);
        alert.error(err.toString());
      }
    };

    setup();

    //when you are not allowed to connect
    socket.current.on("connect_error", (err) => {
      alert.error(err.toString());
      setIsAuth(false);
    });

    //when you get back your peers id when joining, call each one of them
    socket.current.on("roomPeers", (roomPeersId) => {
      roomPeersId.forEach((sendingToId) => {
        const peer = createAlreadyInRoomPeer(
          sendingToId,
          myStreamRef.current.srcObject,
          socket.current
        );

        peersRef.current.push({ id: sendingToId, peer });
      });

      setPeers([...peersRef.current]);
      setInRoom(true);
    });

    //handle when someone joins the room
    socket.current.on("someoneJoined", ({ joinSignal, joinId }) => {
      const joinPeer = createJoiningPeer(
        joinSignal,
        joinId,
        myStreamRef.current.srcObject,
        socket.current
      );

      //Update ref and state
      peersRef.current.push({ id: joinId, peer: joinPeer });
      setPeers([...peersRef.current]);

      //send them the content on your whiteboard
      whiteboardRef.current
        .exportPaths()
        .then((paths) => {
          socket.current.emit("sendWhiteboard", { to: id, paths });
        })
        .catch((err) => {
          console.log(err);
        });
    });

    //handle room full
    socket.current.on("roomFull", () => {
      setRoomFull(true);
    });

    //handle when someone sends you back their signal when you join
    socket.current.on("userInRoomSignaledBack", ({ fromId, signal }) => {
      peersRef.current
        .find((p) => {
          return p.id === fromId;
        })
        .peer.signal(signal);
    });

    socket.current.on("userLeftRoom", (leftRoomId) => {
      peersRef.current = peersRef.current.filter((p) => p.id !== leftRoomId);

      setPeers([...peersRef.current]);
    });

    //draw remote path on whiteboard
    socket.current.on("pathData", (path) => {
      whiteboardRef.current.loadPaths([path]);
    });

    //clear whiteboard
    socket.current.on("clearWhiteboard", () => {
      whiteboardRef.current.clearCanvas();
    });

    //load the current whiteboard
    socket.current.on("sentBackWhiteboard", (paths) => {
      if (!whiteBoardLoaded) {
        whiteboardRef.current.resetCanvas();
        whiteboardRef.current.loadPaths(paths);
      }
    });

    //clean up function when leaving
    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    return () => {
      stopStream(camera);
    };
  }, [camera]);

  useEffect(() => {
    return () => {
      stopStream(screen);
    };
  }, [screen]);

  useEffect(() => {
    if (roomFull) {
      stopStream(camera);
    }
  }, [roomFull]);

  const shareScreen = async () => {
    try {
      let myScreen = await navigator.mediaDevices.getDisplayMedia();
      setScreen(myScreen);

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

      setIsSharingScreen(true);
    } catch (err) {
      console.log(err);
      setIsSharingScreen(false);
      myStreamRef.current.srcObject = camera;
    }
  };

  const stopShareScreen = async () => {
    try {
      peersRef.current.forEach((p) => {
        p.peer.replaceTrack(
          p.peer.streams[0].getVideoTracks()[0],
          camera.getVideoTracks()[0],
          p.peer.streams[0]
        );
      });

      myStreamRef.current.srcObject = camera;
      screen.getTracks().forEach((track) => {
        return track.stop();
      });
      setIsSharingScreen(false);
    } catch (err) {
      console.log(err);
      myStreamRef.current.srcObject = camera;
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
      {!isAuth && (
        <Typography sx={{ color: "white" }}>
          Sorry you are not authorized. Please sign in.
        </Typography>
      )}
      {roomFull && (
        <Typography sx={{ color: "white" }}>Sorry this room is full or does not exist.</Typography>
      )}
      {isAuth && inRoom && myStreamRef && !roomFull && (
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", width: "80%" }}>
          <Link to="/student/studyRooms">
            <Button variant="contained" color="error" endIcon={<ExitToAppIcon />}>
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
                hideStream(camera);
                setIsShowingVideo(false);
              } else {
                showStream(camera);
                setIsShowingVideo(true);
              }
            }}
          />
          <ToggleMuteButton onToggle={() => toggleMuteStream(camera)} />
        </Toolbar>
      )}
      {!roomFull && (
        <Grid container spacing={1} className="streamContainer">
          <Stream ref={myStreamRef} muted={true} name={"You"} />
          {peers
            .filter(({ id }, index) => {
              return peers.findIndex((p) => p.id === id) === index;
            })
            .map(({ id, peer }) => {
              return <PeerStream key={id} peer={peer} />;
            })}
        </Grid>
      )}
      {isAuth && !roomFull && (
        <SocketWhiteboard
          ref={whiteboardRef}
          onStroke={(path) => {
            socket.current.emit("strokePath", { roomId: id, path });
          }}
          onClear={() => {
            socket.current.emit("clearWhiteboard", id);
          }}
        />
      )}
    </Box>
  );
};

export default StudyRoom;
