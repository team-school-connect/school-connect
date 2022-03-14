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
    description: {
        fontSize: '1.25rem',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '20px'
    },
    homePageTitle: {
        textAlign: 'center',
        marginTop: '4rem',
        marginBttom: '2rem',
    },
}));


export function Home(){
 
    const classes = useStyles();
    return (
        <Grid>
        <Paper elevation={10} className={classes.homeContainer}>
            <h2 className={classes.homePageTitle}>Home Page</h2>
            <p className={classes.description}>
            SchoolConnect is an online platform where high schools can connect with their students online.
            Teachers and Students will be part of class rooms where they will be able to share class material and chat with each other. 
            Students also will be able to organize their schedules via a built in calender and view volunteering postions as well as join clubs!
            </p>
        </Paper>
        </Grid>
    );
}
 
 
 