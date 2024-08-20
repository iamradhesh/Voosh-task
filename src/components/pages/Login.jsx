
import { Avatar, Box, FormControlLabel, Grid, Paper, TextField, Typography, Checkbox, Button, Link } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import { useFormik } from "formik";
import axios from 'axios';
import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../slices/authSlice';
import { GoogleLogin } from '@react-oauth/google';
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate(); // Hook for navigation
  const dispatch = useDispatch(); // Hook for Redux actions
  const [checkedB, setChecked] = useState(false); // State for 'Remember Me' checkbox

  // Handler for checkbox state change
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  // Style objects for the Paper component and Avatar
  const paperStyle = { padding: 20, height: '70vh', width: 400, margin: "20px auto" };
  const avtarStyle = { backgroundColor: 'green' };

  // Schema Validation of Form using Yup
  const schema = Yup.object({
    email: Yup.string().email("Please Enter a valid email").required("Email is required"),
    password: Yup.string().min(7, "Password length should be greater than 7").required("Password is Required")
  });

  // Formik settings for handling form submission and validation
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values, helpers) => {
      try {
        // Make a request to the backend for login
        const response = await axios.post('http://localhost:5000/login', values);

        // Check if the response contains the expected data
        if (response.status === 200 && response.data && response.data.token) {
          // Dispatch loginSuccess action to update the Redux store
          dispatch(loginSuccess({ token: response.data.token, user: response.data.user }));
          // Store the token in localStorage
          localStorage.setItem('authToken', response.data.token);
          // Redirect to the dashboard
          navigate('/dashboard');
        } else {
          helpers.setErrors({ submit: 'Unexpected response from server' });
        }
        
      } catch (error) {
        // Handle errors from the backend
        if (error.response && error.response.status === 400) {
          helpers.setErrors({ submit: 'Invalid email or password' });
        } else {
          helpers.setErrors({ submit: 'An unexpected error occurred. Please try again.' });
        }
        console.log(error.message);
      }
    },
    validationSchema: schema,
  });

  // Handle Google login success
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post('http://localhost:5000/google-login', { token: credentialResponse.credential });

      if (response.status === 200 && response.data && response.data.token) {
        dispatch(loginSuccess({ token: response.data.token, user: response.data.user }));
        localStorage.setItem('authToken', response.data.token);
        navigate('/dashboard');
      } else {
        console.log('Unexpected response from server');
      }

    } catch (error) {
      console.log('Google login failed', error);
    }
  };

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
            Please Login
          </Typography>
        </Grid>
        {/* Form for email and password */}
        <form onSubmit={formik.handleSubmit}>
          <TextField
            label="E-mail"
            placeholder="Enter your Email"
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
              label="Remember Me"
              control={<Checkbox checked={checkedB} onChange={handleChange} />}
            />
          </Box>
          <Box>
            <Button type="submit" color="primary" variant="contained" name="submit" fullWidth>
              Log in
            </Button>
          </Box>
        </form>
        <Box alignItems={"center"} justifyContent={"center"} sx={{ mt: 2, textAlign: "center" }}>
          <Typography>
            <Link href="#" onClick={(e) => e.preventDefault()} >Forgot Password? </Link>
          </Typography>
        </Box>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography>
            Do you have an Account? {" "}
            <Link href="#" onClick={() => navigate('/signup')} >Sign up</Link>
          </Typography>
        </Box>

        {/* Google Login Button */}
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <GoogleLogin 
            onSuccess={handleGoogleLoginSuccess}
            onError={(error) => console.log('Google login failed', error)}
          />
        </Box>
      </Paper>
    </Grid>
  );
};

export default Login;
