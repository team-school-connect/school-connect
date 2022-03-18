import { Drawer, List, ListItem, Tooltip } from "@mui/material";

import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Link } from "react-router-dom";

const styles = {
  home: { color: "white" },
  signout: { color: "#ff5e5e" },
};

const AdministrationNav = () => {
  return (
    <Drawer
      sx={{ width: "3em"}}
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
        <ListItem button key={"Add New Teacher"}>
            <Link to="signup/teacher">
                <Tooltip title="Add New Teacher" placement="right">
                <PersonAddIcon sx={styles.myclasses} />
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

export default AdministrationNav;
