import { Avatar, Box, FormControlLabel, Grid, Paper, TextField, Typography, Checkbox, Button, Link } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useFormik } from "formik";
import axios from 'axios';
import * as Yup from "yup";

const SignUp = () => {
  const navigate = useNavigate();
  const [checkedB, setChecked] = useState(false);
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const paperStyle = { padding: 20, height: '70vh', width: 400, margin: "20px auto" };
  const avtarStyle = { backgroundColor: 'green' };

  // Schema Validation of Form using Yup:-
  const schema = Yup.object({
    name: Yup.string().required("Name is required").trim(),
    email: Yup.string().email("Please enter a valid email").required("Email is required"),
    password: Yup.string().min(7, "Password length should be greater than 7").required("Password is required")
  });

  // Formik Settings:-
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async (values, helpers) => {
      try {
        // Make a request to the backend for signup
        const response = await axios.post('http://localhost:5000/signup', values);

        // Check if the response has the expected data (e.g., a success message or token)
        if (response.status === 200 && response.data && response.data.token) {
          // Store the token if necessary (e.g., in localStorage)
          localStorage.setItem('authToken', response.data.token);

          // Redirect to the login page or dashboard
          navigate('/login');
        } else {
          // If the response doesn't have the expected data, set an error
          helpers.setErrors({ submit: 'Unexpected response from server' });
        }
        
      } catch (error) {
        // If there's an error (e.g., user already exists), display it
        if (error.response && error.response.status === 400) {
          // Backend validation failed (e.g., user already exists)
          helpers.setErrors({ submit: 'An error occurred during signup. Please try again.' });
        } else {
          // Some other error occurred (e.g., network error)
          helpers.setErrors({ submit: 'An unexpected error occurred. Please try again.' });
        }
        console.log(error.message);
      }
    },
    validationSchema: schema,
  });

  return (
    <Grid>
      <Paper elevation={10} style={paperStyle} sx={{ borderColor: "blue" }}>
        <Grid align="center">
          <Avatar style={avtarStyle}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            variant="h2"
            fontSize={20}
            fontWeight="bold"
            fontFamily="sans-serif"
            sx={{ mt: 2 }}
          >
            Sign up
          </Typography>
        </Grid>
        {/* Name */}
        <form onSubmit={formik.handleSubmit}>
          <TextField
            label="Name"
            placeholder="Enter your Name"
            aria-label="Name Box"
            fullWidth
            type="text"
            name="name"
            sx={{ mt: 2 }}
            required
            error={Boolean(formik.errors.name)}
            helperText={formik.errors.name}
            onChange={formik.handleChange}
            value={formik.values.name}
          />
          {/* Email */}
          <TextField
            label="E-Mail"
            placeholder="Enter your Email Id"
            aria-label="Email Box"
            fullWidth
            type="email"
            name="email"
            sx={{ mt: 2 }}
            required
            error={Boolean(formik.errors.email)}
            helperText={formik.errors.email}
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          {/* Password */}
          <TextField
            label="Password"
            placeholder="Enter your Password"
            aria-label="Password Box"
            fullWidth
            type="password"
            name="password"
            sx={{ mt: 2 }}
            required
            error={Boolean(formik.errors.password)}
            helperText={formik.errors.password}
            onChange={formik.handleChange}
            value={formik.values.password}
          />

          <Box>
            <FormControlLabel 
              label="I agree to Voosh's Terms & Conditions"
              control={<Checkbox checked={checkedB} onChange={handleChange} />}
            />
          </Box>
          <Box>
            <Button type="submit" color="primary" variant="contained" fullWidth>
              Sign up
            </Button>
          </Box>
        </form>
        
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography>
            Already have an account? {" "}
            <Link href="#" onClick={() => navigate('/login')} >Login</Link>
          </Typography>
        </Box>
      </Paper>
    </Grid>
  )
}

export default SignUp;
