import { useState } from 'react';
import { Avatar, Box, FormControlLabel, Grid, Paper, TextField, Typography, Checkbox, Button, Link } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import { useFormik } from "formik";
import axios from 'axios';
import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../slices/authSlice';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [checkedB, setChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const paperStyle = { padding: 20, height: '70vh', width: 400, margin: "20px auto" };
  const avtarStyle = { backgroundColor: 'green' };

  const schema = Yup.object({
    email: Yup.string().email("Please enter a valid email").required("Email is required"),
    password: Yup.string().min(7, "Password length should be greater than 7").required("Password is required")
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', values);

        if (response.status === 200 && response.data && response.data.token) {
          dispatch(loginSuccess({ token: response.data.token, user: response.data.user }));
          localStorage.setItem('authToken', response.data.token);
          navigate('/dashboard');
        } else {
          setErrorMessage('Unexpected response from server');
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          setErrorMessage(error.response.data.error);
        } else {
          setErrorMessage('An unexpected error occurred. Please try again.');
        }
        console.error('Login error:', error.response ? error.response.data : error.message);
      }
    },
    validationSchema: schema,
  });

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/google-login', { token: credentialResponse.credential });

      if (response.status === 200 && response.data && response.data.token) {
        dispatch(loginSuccess({ token: response.data.token, user: response.data.user }));
        localStorage.setItem('authToken', response.data.token);
        navigate('/dashboard');
      } else {
        console.error('Unexpected response from server');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
      console.error('Google login failed:', error);
    }
  };

  return (
    <Grid>
      <Paper elevation={10} style={paperStyle}>
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
        {errorMessage && (
          <Box sx={{ mt: 2, color: 'red', textAlign: 'center' }}>
            <Typography>{errorMessage}</Typography>
          </Box>
        )}
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
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <GoogleLogin 
            onSuccess={handleGoogleLoginSuccess}
            onError={(error) => {
              console.error('Google login failed', error);
              setErrorMessage('An unexpected error occurred. Please try again.');
            }}
          />
        </Box>
      </Paper>
    </Grid>
  );
};

export default Login;
