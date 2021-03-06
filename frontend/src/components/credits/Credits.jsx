import { Box, Typography } from "@mui/material";
import React from "react";
import CustomAppBar from "../appbar/CustomAppBar";
const boxStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  marginBottom: 5
};

const Credits = () => {
  return (
    <Box sx={boxStyles}>
      <CustomAppBar title="Credits" />
      <Box sx={boxStyles}>
        <Typography variant="h5">UI Components</Typography>
        <a href="https://mui.com/">Material-UI</a>
        <a href="https://www.npmjs.com/package/react-sketch-canvas">react-sketch-canvas</a>
        <a
          href="https://github.com/leighhalliday/google-maps-react-2020/blob/master/src/App.js"
          title="google-maps-react"
        >
          Sourced Google Maps related code from leighhalliday on Github
        </a>

        <a
          href="https://github.com/vikas62081/YT/blob/loginPage/src/components/login.js"
          title="login form"
        >
          Sourced Login form related code from Vikas62081 on Github
        </a>
      </Box>
      <Box sx={boxStyles}>
        <Typography variant="h5">Images</Typography>
        <a href="https://www.flaticon.com/free-icons/video-call" title="video call icons">
          Video call icons created by amonrat rungreangfangsai - Flaticon
        </a>
        <a href="https://www.flaticon.com/free-icons/classroom" title="classroom icons">
          Classroom icons created by amonrat rungreangfangsai - Flaticon
        </a>
        <a href="https://www.flaticon.com/free-icons/volunteer" title="volunteer icons">
          Volunteer icons created by Freepik - Flaticon
        </a>
      </Box>
      <Box sx={boxStyles}>
        <Typography variant="h5">Other</Typography>

        <a href="https://www.youtube.com/watch?v=R1sfHPwEH7A&t=2s" title="webrtc-chaim">
          Learned WebRTC and Simplepeer from Coding with Chaim
        </a>
        <a href="https://www.youtube.com/watch?v=oxFr7we3LC8" title="webrtc-jsmastery">
          Learned WebRTC and Simplepeer from Javascript Mastery
        </a>
        <a
          href="https://blog.sentry.io/2020/07/22/handling-graphql-errors-using-sentry"
          title="sentry"
        >
          Learned how to handle errors in Sentry from here
        </a>
        <a href="https://stackoverflow.com/" title="stackoverflow">
          And of course Stack Overflow
        </a>
      </Box>
    </Box>
  );
};

export default Credits;
