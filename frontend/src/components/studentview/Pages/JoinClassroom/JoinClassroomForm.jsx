import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import FormControl from "@mui/material/FormControl";
import { CREATE_STUDY_ROOM_MUTATION } from "../../../../graphql/Mutations";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import { Button, TextField, Box } from "@mui/material";

const JoinClassroomForm = () => {
  const [joinClassRoom, { error }] = useMutation(CREATE_STUDY_ROOM_MUTATION);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const navigate = useNavigate();

  const schema = yup.object().shape({
    code: yup.string().label("Classroom Code").required(),
  });

  const submit = async (values) => {
    console.log(values);
    setIsButtonDisabled(true);
    // try {
    //   const studyRoom = await createStudyRoom({
    //     variables: { roomName: values.roomName, subject: values.subject },
    //   });

    //   navigate("/student/studyRooms");
    // } catch (err) {
    //   //change to react alert
    //   console.log(err);
    // }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
      <Formik
        onSubmit={submit}
        validationSchema={schema}
        validateOnBlur={false}
        validateOnChange={false}
        initialValues={{
          code: "",
        }}
      >
        {({ handleSubmit, handleChange, values, errors, touched }) => (
          <form style={{ width: "40em" }} onSubmit={handleSubmit}>
            <FormControl fullWidth sx={{ margin: "1em" }}>
              <TextField
                id="code"
                name="code"
                label="Classroom Code"
                value={values.code}
                onChange={handleChange}
                error={touched.code && Boolean(errors.code)}
                helperText={errors.code}
                fullWidth
              />
            </FormControl>

            <Button
              disabled={isButtonDisabled}
              sx={{ margin: "1em" }}
              type="submit"
              variant="contained"
              fullWidth
            >
              Join Classroom
            </Button>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default JoinClassroomForm;
