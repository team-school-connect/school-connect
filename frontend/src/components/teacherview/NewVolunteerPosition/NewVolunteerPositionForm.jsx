import React, {  useState } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import FormControl from "@mui/material/FormControl";
import { CREATE_VOLUNTEER_POSITION_MUTATION } from "../../../graphql/Mutations";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import { Button, TextField, Box, TextBox, Autocomplete } from "@mui/material";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import { useAlert } from "react-alert";
import {
  useLoadScript,
} from "@react-google-maps/api";
import usePlacesAutocomplete from "use-places-autocomplete";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

const libraries = ["places"];
const NewVolunteerPositionForm = () => {
  const [createVolunteerPosition, { error }] = useMutation(CREATE_VOLUNTEER_POSITION_MUTATION);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [value, setValue] = useState(null);


  const navigate = useNavigate();
  const alert = useAlert();

  // const { init } = usePlacesAutocomplete({
  //   initOnMount: false, // Disable initializing when the component mounts, default is true
  // });

  



  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? process.env.REACT_APP_GOOGLE_MAPS_API_KEY : "",
    libraries,
  });
  // const [loading] = useGoogleMapsApi({
  //   library: "places",
  //   onLoad: () => init(), // Lazily initializing the hook when the script is ready
  // });
  // if(!ready) return "Loading...";
  // // if (loadError) return "Error loading maps";
  // // if (!isLoaded) return "Loading Maps";
  // // init();

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";
  // init();

  const schema = yup.object().shape({
    organization: yup.string().label("Organization Position").required(),
    position: yup.string().label("Volunteer Position").required(),
  });


  const submit = async (values) => {
    setIsButtonDisabled(true);
    try {
      await createVolunteerPosition({
        variables: { 
            organizationName: values.organization,
            positionName: values.position,
            positionDescription: values.description,
            location: values.location,
            startDate: values.startDate,
            endDate: values.endDate,
         },
      });

      alert.success("Created volunteer position successfully!");

      navigate("/teacher/volunteerBoard");
    } catch (err) {
      console.log(err);
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
            organization: "",
            position: "",
            description: "",
            location: "",
            startDate: "",
            endDate: "",
        }}
      >
        {({ handleSubmit, handleChange, setFieldValue, values, errors, touched }) => (
          <form style={{ width: "40em" }} onSubmit={handleSubmit}>
            <FormControl fullWidth sx={{ margin: "1em" }}>
              <TextField
                id="organization"
                name="organization"
                label="Volunteer Organization"
                value={values.organization}
                onChange={handleChange}
                error={touched.organization && Boolean(errors.organization)}
                helperText={errors.organization}
                margin="normal"
                fullWidth
              />
              <TextField
                id="position"
                name="position"
                label="Volunteer Position"
                value={values.position}
                onChange={handleChange}
                error={touched.position && Boolean(errors.position)}
                helperText={errors.position}
                margin="normal"
                fullWidth
              />
              <TextField
                id="description"
                name="description"
                label="Volunteer Description"
                value={values.description}
                onChange={handleChange}
                error={touched.description && Boolean(errors.description)}
                helperText={errors.description}
                margin="normal"
                fullWidth
                multiline
              />
              <GooglePlacesAutocomplete
                selectProps={
                  {
                  onChange: (value)=>(setFieldValue("location", value.label)),
                  placeholder: "Volunteer Location",
                }}
              />
                
              {/* </TextField> */}
              <TextField
                id="startDate"
                name="startDate"
                label="Start Date"
                type="date"
                margin="normal"
                value={values.startDate}
                onChange={handleChange}
                error={touched.startDate && Boolean(errors.startDate)}
                helperText={errors.startDate}
                sx={{ width: 220 }}
                InputLabelProps={{
                shrink: true,
                }}
              />
              <TextField
                id="endDate"
                name="endDate"
                label="End Date"
                type="date"
                margin="normal"
                value={values.endDate}
                onChange={handleChange}
                error={touched.endDate && Boolean(errors.endDate)}
                helperText={errors.endDate}
                sx={{ width: 220 }}
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
              Create Volunteer Position
            </Button>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default NewVolunteerPositionForm;
