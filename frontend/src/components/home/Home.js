/** 
 * This component is responsible for the home page
 * */ 
import { Grid,Paper} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
 
const useStyles = makeStyles(theme => ({
    homeContainer: {
       padding: 20,
       height: '90%',
       width: '90%',
       margin:"100px auto"
    },
}));


export function Home(){
 
    const classes = useStyles();
    return (
        <Grid>
        <Paper elevation={10} className={classes.homeContainer}>
            <h2>Home Page</h2>
            School Connect Description
        </Paper>
        </Grid>
    );
}
 
 
 