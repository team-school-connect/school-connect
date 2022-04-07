import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import FormControl from "@mui/material/FormControl";
import { JOIN_CLASSROOM_MUTATION } from "../../../../graphql/Mutations";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import { Button, TextField, Box } from "@mui/material";
import { useAlert } from "react-alert";

const JoinClassroomForm = () => {
  const [joinClassRoom, { error }] = useMutation(JOIN_CLASSROOM_MUTATION);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const navigate = useNavigate();
  const alert = useAlert();

  const schema = yup.object().shape({
    code: yup.string().label("Classroom Code").required(),
  });

  const submit = async (values) => {
    setIsButtonDisabled(true);
    try {
      await joinClassRoom({
        variables: { classCode: values.code },
      });

      alert.success("Joined classroom successfully!");

      navigate("/student/classrooms");
    } catch (err) {
      alert.error(err.toString());
      setIsButtonDisabled(false);
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
