import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import FormControl from "@mui/material/FormControl";
import { CREATE_STUDY_ROOM_MUTATION } from "../../../../graphql/Mutations";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import {
  Button,
  MenuItem,
  Select,
  TextField,
  Box,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { useAlert } from "react-alert";

//Subjects from https://www.oasdi.ca/k-12-education-in-ontario/curriculum/
const subjects = [
  "The Arts",
  "Business",
  "Canadian History",
  "World History",
  "Classical Studies",
  "International Languages",
  "Computer Science and Tech",
  "English",
  "French",
  "Guidance and Career Education",
  "Health and Physical",
  "Interdisciplinary Studies",
  "Math",
  "Native Stuides",
  "Science",
  "Socal Sciences and Humanities",
];

const NewStudyRoomForm = () => {
  const [createStudyRoom, { error }] = useMutation(CREATE_STUDY_ROOM_MUTATION);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const navigate = useNavigate();
  const alert = useAlert();

  const schema = yup.object().shape({
    roomName: yup.string().label("Room Name").required(),
    subject: yup
      .string()
      .label("Subject")
      .required()
      .oneOf(subjects)
      .typeError("Please select a valid subject"),
  });

  const submit = async (values) => {
    // console.log(values);
    try {
      const studyRoom = await createStudyRoom({
        variables: { roomName: values.roomName, subject: values.subject },
      });

      alert.success("Created study room successfully!");
      navigate("/student/studyRooms");
    } catch (err) {
      // console.log(err);
      alert.error("Could not create study room");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
      <Formik
        onSubmit={submit}
        validationSchema={schema}
        validateOnBlur={false}
        validateOnChange={false}
        initialValues={{
          roomName: "",
          subject: "",
        }}
      >
        {({ handleSubmit, handleChange, values, errors, touched }) => (
          <form style={{ width: "40em" }} onSubmit={handleSubmit}>
            <FormControl fullWidth sx={{ margin: "1em" }}>
              <TextField
                id="roomName"
                name="roomName"
                label="Room Name"
                value={values.roomName}
                onChange={handleChange}
                error={touched.roomName && Boolean(errors.roomName)}
                helperText={errors.roomName}
                fullWidth
              />
            </FormControl>
            <FormControl fullWidth sx={{ margin: "1em" }}>
              <InputLabel id="subject-label">Subject</InputLabel>
              <Select
                labelId="subject-label"
                id="subject"
                name="subject"
                label="Subject"
                value={values.subject}
                onChange={handleChange}
                error={touched.subject && Boolean(errors.subject)}
                fullWidth
              >
                {subjects.map((subject) => {
                  return (
                    <MenuItem key={subject} value={subject}>
                      {subject}
                    </MenuItem>
                  );
                })}
              </Select>
              <FormHelperText error={true}>{errors.subject}</FormHelperText>
            </FormControl>

            <Button
              disabled={isButtonDisabled}
              sx={{ margin: "1em" }}
              type="submit"
              variant="contained"
              fullWidth
            >
              Create Study Room
            </Button>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default NewStudyRoomForm;
