import React, {  useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import FormControl from "@mui/material/FormControl";
import { CREATE_CLASSROOM_MUTATION } from "../../../graphql/Mutations";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import { Button, TextField, Box } from "@mui/material";
import { useAlert } from "react-alert";

const NewClassroomForm = () => {
  const [createClassRoom, { error }] = useMutation(CREATE_CLASSROOM_MUTATION);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const navigate = useNavigate();
  const alert = useAlert();

  const schema = yup.object().shape({
    name: yup.string().label("Classroom Name").required(),
  });

  const submit = async (values) => {
    // console.log(values);
    setIsButtonDisabled(true);
    try {
      await createClassRoom({
        variables: { name: values.name },
      });

      alert.success("Created classroom successfully!");

      navigate("/teacher/classrooms");
    } catch (err) {
      // console.log(err);
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
          name: "",
        }}
      >
        {({ handleSubmit, handleChange, values, errors, touched }) => (
          <form style={{ width: "40em" }} onSubmit={handleSubmit}>
            <FormControl fullWidth sx={{ margin: "1em" }}>
              <TextField
                id="name"
                name="name"
                label="Classroom Name"
                value={values.name}
                onChange={handleChange}
                error={touched.name && Boolean(errors.name)}
                helperText={errors.name}
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
              Create Classroom
            </Button>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default NewClassroomForm;
