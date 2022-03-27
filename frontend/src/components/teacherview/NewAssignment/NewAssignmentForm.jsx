import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import FormControl from "@mui/material/FormControl";
import { CREATE_ASSIGNMENT_MUTATION } from "../../../graphql/Mutations";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import { Button, TextField, Box } from "@mui/material";
import { useAlert } from "react-alert";

const NewAssignmentForm = ({ id }) => {
  const [createAssignment, { error }] = useMutation(CREATE_ASSIGNMENT_MUTATION);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const navigate = useNavigate();
  const alert = useAlert();

  const schema = yup.object().shape({
    title: yup.string().label("Title").required(),
    content: yup.string().label("Content").required(),
  });

  const submit = async (values) => {
    console.log(values);
    console.log(id);
    const { title, content, duedate } = values;
    try {
      const announcement = await createAssignment({
        variables: { name: title, description: content, classId: id, dueDate: duedate },
      });

      alert.success("Added assignment successfully!");
      navigate(`/teacher/classrooms/${id}`);
    } catch (err) {
      console.log(err);
      alert.error("Could not create assignment");
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
          title: "",
          content: "",
        }}
      >
        {({ handleSubmit, handleChange, values, errors, touched }) => (
          <form style={{ width: "40em" }} onSubmit={handleSubmit}>
            <FormControl fullWidth sx={{ margin: "1em" }}>
              <TextField
                id="title"
                name="title"
                label="Title"
                value={values.title}
                onChange={handleChange}
                error={touched.title && Boolean(errors.title)}
                helperText={errors.title}
                fullWidth
              />
            </FormControl>

            <FormControl fullWidth sx={{ margin: "1em" }}>
              <TextField
                id="content"
                name="content"
                label="Content"
                value={values.content}
                onChange={handleChange}
                error={touched.content && Boolean(errors.content)}
                helperText={errors.content}
                rows={6}
                fullWidth
                multiline
              />
            </FormControl>

            <FormControl fullWidth sx={{ margin: "1em" }}>
              <TextField
                id="duedate"
                name="duedate"
                label="Pick due date"
                type="datetime-local"
                value={values.duedate}
                onChange={handleChange}
                error={touched.duedate && Boolean(errors.duedate)}
                helperText={errors.duedate}
                sx={{ width: 250 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>

            <Button
              disabled={isButtonDisabled}
              sx={{ margin: "1em" }}
              type="submit"
              variant="contained"
              fullWidth
            >
              Create Assignment
            </Button>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default NewAssignmentForm;
