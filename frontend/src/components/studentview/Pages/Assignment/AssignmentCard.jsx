import React from "react";
import { CardContent, Card, Typography, CardHeader, CardActions, Button } from "@mui/material";
import { useMutation } from "@apollo/client";
import { SUBMIT_ASSIGNMENT } from "../../../../graphql/Mutations";
import { useAlert } from "react-alert";

const AssignmentCard = ({assignId, title, description, date}) => {
  const alert = useAlert();
  const dateString = new Date(parseInt(date));
  const [mutate] = useMutation(SUBMIT_ASSIGNMENT);

  const onChange = async ({
    target: {
      validity,
      files: [file]
    }
  }) => {
    console.log(file, assignId);
    try {
      if (validity.valid) {
        await mutate({ variables: { assignmentId: assignId, file}});
        alert.success('Sucessfully Submitted Assignment');
      }
    } catch (err) {
      alert.error('Error submitting assignment');
    }
  };

  return (console.log(date),
    <Card sx={{ margin: "1em", padding: "1em", width: "100%" }}>
      <CardHeader title={title} />
      <CardContent>
        <Typography variant="body1" color="textSecondary">
          {description}
        </Typography>
        <Typography sx={{ textAlign: "center" }} variant="caption">
          Due Date: {`${dateString.toDateString()} ${dateString.toLocaleTimeString()}`}
        </Typography>
      </CardContent>
      <CardActions>
        {
          date > Date.now() &&
          <Button variant="contained" component="label">
            Upload
            <input type="file" required hidden accept=".pdf" onChange={onChange}/>
          </Button>
        }
        
      </CardActions>
    </Card>
  )
};

export default AssignmentCard;