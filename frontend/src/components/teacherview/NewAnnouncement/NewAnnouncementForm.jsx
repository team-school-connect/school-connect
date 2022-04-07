import React, { useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import FormControl from "@mui/material/FormControl";
import { CREATE_ANNOUNCEMENT_MUTATION } from "../../../graphql/Mutations";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import { Button, TextField, Box } from "@mui/material";
import { useAlert } from "react-alert";

const NewAnnouncementForm = ({ id }) => {
  const [createAnnoucement, { error }] = useMutation(CREATE_ANNOUNCEMENT_MUTATION);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const navigate = useNavigate();
  const alert = useAlert();

  const schema = yup.object().shape({
    title: yup.string().label("Title").required(),
    content: yup.string().label("Content").required(),
  });

  const submit = async (values) => {
    const { title, content } = values;
    try {
      const announcement = await createAnnoucement({
        variables: { title, content, classId: id },
      });

      alert.success("Added announcement successfully!");
      navigate(`/teacher/classrooms/${id}`);
    } catch (err) {
      alert.error("Could not create announcement");
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

            <Button
              disabled={isButtonDisabled}
              sx={{ margin: "1em" }}
              type="submit"
              variant="contained"
              fullWidth
            >
              Create Annoucement
            </Button>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default NewAnnouncementForm;
