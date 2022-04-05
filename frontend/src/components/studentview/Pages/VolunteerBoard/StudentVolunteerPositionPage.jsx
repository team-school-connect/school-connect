import { useQuery } from "@apollo/client";
import { GET_SINGLE_VOLUNTEER_POSITION } from "../../../../graphql/Querys";
import { useParams } from "react-router-dom";
import CustomAppBar from "../../../appbar/CustomAppBar";
import Map from "../../../map/Map";


import { Box, Grid, Paper, List, ListItem, Divider, ListItemText } from "@mui/material";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import { useAlert } from "react-alert";

const StudentVolunteerPositionPage = (props) => {
  const { id } = useParams();
  const { data, loading, error, fetchMore } = useQuery(GET_SINGLE_VOLUNTEER_POSITION, {
    variables: {
      _id: id,
    },
  });


  const alert = useAlert();

  // const styles = theme => ({
  //   root: {
  //     width: '100%',
  //     maxWidth: 360,
  //     backgroundColor: theme.palette.background.paper,
  //   },
  // });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        width: "100%",
      }}
    >
      <CustomAppBar
        title={"Volunteer Position"}
        icon={<VolunteerActivismIcon sx={{ color: "red" }} />}
      ></CustomAppBar>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "flex-start",
        }}
      >
 
        <Grid container sx={{ padding: "7em" }}>
          {/* Show the volunteer position data */}
          {!loading && data && data.getSingleVolunteerPosition && (
            <Grid sx={ {padding: "1em"}} xs={12}>
              <Box sx={{ padding: "1em" }}>
                {/* Display the data in an organized manner on a paper*/}
                <Paper>
                  <Box sx={{ padding: "1em" }}>
                  <List>
                    <ListItem>
                      {/* <Avatar>
                        <ImageIcon />
                      </Avatar> */}
                      <ListItemText primary="Organization:" />
                      <ListItemText primary={data.getSingleVolunteerPosition.organizationName} />
                    </ListItem>
                    <li>
                      <Divider variant="inset" />
                    </li>
                    <ListItem>
                      {/* <Avatar>
                        <WorkIcon />
                      </Avatar> */}
                      <ListItemText primary="Position:" />
                      <ListItemText primary={data.getSingleVolunteerPosition.positionName} />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    <ListItem>
                      {/* <Avatar>
                        <WorkIcon />
                      </Avatar> */}
                      <ListItemText primary="Description:" />
                      <ListItemText primary={data.getSingleVolunteerPosition.positionDescription} />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    <ListItem>
                      {/* <Avatar>
                        <BeachAccessIcon />
                      </Avatar> */}
                      <ListItemText primary="Location:" />
                      <ListItemText primary={data.getSingleVolunteerPosition.location} />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    <ListItem>
                      {/* <Avatar>
                        <BeachAccessIcon />
                      </Avatar> */}
                      <ListItemText primary="Start Date:" />
                      <ListItemText primary={data.getSingleVolunteerPosition.startDate} />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                    <ListItem>
                      {/* <Avatar>
                        <BeachAccessIcon />
                      </Avatar> */}
                      <ListItemText primary="End Date:" />
                      <ListItemText primary={data.getSingleVolunteerPosition.endDate} />
                    </ListItem>
                  </List>
                  {/* Show map */}
                  
                  </Box>
                  {/* put the map in the center of the box */}

                  <Box sx={{ padding: "1em"}}>
                    <Map location={data.getSingleVolunteerPosition.location}></Map>  
                  </Box>
                </Paper>

                {/* <h2>{data.getSingleVolunteerPosition.organizationName}</h2>
                <h2>{data.getSingleVolunteerPosition.positionName}</h2>
                <p>{data.getSingleVolunteerPosition.positionDescription}</p>
                <p>{data.getSingleVolunteerPosition.location}</p>
                <p>{data.getSingleVolunteerPosition.startDate}</p>
                <p>{data.getSingleVolunteerPosition.endDate}</p> */}
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default StudentVolunteerPositionPage;
