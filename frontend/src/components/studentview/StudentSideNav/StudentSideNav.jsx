import { Drawer, List, ListItem, Tooltip } from "@mui/material";

import React from "react";
import ClassIcon from "@mui/icons-material/Class";
import HomeIcon from "@mui/icons-material/Home";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Link } from "react-router-dom";

const styles = {
  home: { color: "white" },
  signout: { color: "#ff5e5e" },
  myclasses: { color: "#5e94ff" },
  studygroups: { color: "#5effa1" },
};

const StudentSideNav = () => {
  return (
    <Drawer
      sx={{ width: "3em" }}
      PaperProps={{ sx: { backgroundColor: "rgb(51, 51, 51)", flexShrink: 0, position: "fixed" } }}
      variant="permanent"
      anchor="left"
    >
      <List sx={{ height: "100%" }}>
        <ListItem button key={"Home"}>
          <Tooltip title="Home" placement="right">
            <HomeIcon sx={styles.home} />
          </Tooltip>
        </ListItem>
        <ListItem button key={"My Classes"}>
          <Link to="classrooms">
            <Tooltip title="My Classes" placement="right">
              <ClassIcon sx={styles.myclasses} />
            </Tooltip>
          </Link>
        </ListItem>
        <ListItem button key={"Browse Study Groups"}>
          <Link to="studyRooms">
            <Tooltip title="Browse Study Groups" placement="right">
              <WorkspacesIcon sx={styles.studygroups} />
            </Tooltip>
          </Link>
        </ListItem>
      </List>
      <List>
        <ListItem button key={"Sign out"}>
          <Tooltip title="Sign out" placement="right">
            <ExitToAppIcon sx={styles.signout} />
          </Tooltip>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default StudentSideNav;
