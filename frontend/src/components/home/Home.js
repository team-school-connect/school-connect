/**
 * This component is responsible for the home page
 * */

import React from "react";
import { Box, Button, Card, Grid, CardHeader, CardMedia, CardContent } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import CustomAppBar from "../appbar/CustomAppBar";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";

export function Home() {
  return (
    <Box
      sx={{
        display: "flex",
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
        <Card>
          <CardMedia
            sx={{ width: 300, height: 300 }}
            title="Study Group"
            image="https://cdn-icons.flaticon.com/png/512/3192/premium/3192980.png?token=exp=1647733812~hmac=ed703ebc42258c6c7b6af513bc203bb6"
          />
          <CardContent>
            <Typography variant="h6">Video Study Groups</Typography>
            <Typography>Talk with others in your class</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardMedia
            sx={{ width: 300, height: 300 }}
            title="Study Group"
            image="https://cdn-icons.flaticon.com/png/512/3185/premium/3185730.png?token=exp=1647733566~hmac=b65911b472fd152ddf1e3c32aa01cd23"
          />
          <CardContent>
            <Typography variant="h6">Online Classroom</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardMedia
            sx={{ width: 300, height: 300 }}
            title="Study Group"
            image="https://cdn-icons-png.flaticon.com/512/1772/1772040.png"
          />
          <CardContent>
            <Typography variant="h6">Volunteer Board</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardMedia
            sx={{ width: 300, height: 300 }}
            title="School Clubs"
            image="https://cdn-icons-png.flaticon.com/512/4144/4144551.png"
          />
          <CardContent>
            <Typography variant="h6">School Clubs</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Box>
  );
}
