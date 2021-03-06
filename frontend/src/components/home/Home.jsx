/**
 * This component is responsible for the home page
 * */

import React from "react";
import { Box, Button, Card, Grid, CardHeader, CardMedia, CardContent } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import CustomAppBar from "../appbar/CustomAppBar";
import { Link, NavLink } from "react-router-dom";
import { Typography } from "@material-ui/core";

import studygroupImg from "./homeImages/studygroup.png";
import classroomImg from "./homeImages/classroom.png";
import volunterImg from "./homeImages/volunteer.png";

export function Home() {
  return (
    <Box
      sx={{
        display: "flex",
        textAlign:"center",
        flexDirection: "column",
        height: "100%",
        width: "100%",
      }}
    >
      <CustomAppBar title="School Connect" icon={<HomeIcon />}>
        <Link to="/signup">
          <Button sx={{ width: "15em", marginRight: "1em" }} variant="contained">
            Sign up
          </Button>
        </Link>
        <Link to="/login">
          <Button sx={{ width: "15em", marginLeft: "1em" }} variant="contained">
            Sign in
          </Button>
        </Link>
      </CustomAppBar>
      <Grid container sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <Card sx={{ margin: "1em", width: 300 }}>
          <CardMedia sx={{ width: 300, height: 300 }} title="Study Group" image={studygroupImg} />
          <CardContent>
            <Typography variant="h6">Video Study Groups</Typography>
            <Typography>
              Students can join video study groups and stay connected with students across different schools with screenshare and a collaborative whiteboard.
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ margin: "1em", width: 300 }}>
          <CardMedia
            sx={{ width: 300, height: 300 }}
            title="Online Classroom"
            image={classroomImg}
          />
          <CardContent>
            <Typography variant="h6">Online Classroom</Typography>
            <Typography>Stay connected with your students with our online classroom. You can give out assignments and make annoucments to your students.</Typography>
          </CardContent>
        </Card>
        <Card sx={{ margin: "1em", width: 300 }}>
          <CardMedia sx={{ width: 300, height: 300 }} title="Volunteer Board" image={volunterImg} />
          <CardContent>
            <Typography variant="h6">Volunteer Board</Typography>
            <Typography>Post volunteer positions so students from your school can complete their volunteer hours</Typography>
          </CardContent>
        </Card>
      </Grid>
      <NavLink to="/credits">Credits</NavLink>
    </Box>
  );
}
