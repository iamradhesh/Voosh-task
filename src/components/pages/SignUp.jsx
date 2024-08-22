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
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const paperStyle = { padding: 20, height: '70vh', width: 400, margin: "20px auto" };
  const avtarStyle = { backgroundColor: 'green' };

  const schema = Yup.object({
    name: Yup.string().required("Name is required").trim(),
    email: Yup.string().email("Please enter a valid email").required("Email is required"),
    password: Yup.string().min(7, "Password length should be greater than 7").required("Password is required"),
    terms: Yup.boolean().oneOf([true], "You must accept the terms and conditions").required()
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      terms: false
    },
    onSubmit: async (values) => {
      console.log('Form submitted with values:', values); // Debugging line
      try {
        const response = await axios.post(`${apiUrl}/auth/signup`, values);
        console.log('API Response:', response); // Log the entire response
  
        if (response.status === 201 && response.data && response.data.token) {
          localStorage.setItem('authToken', response.data.token);
          console.log('Navigating to login'); // Debugging line
          navigate('/login');
        } else {
          setErrorMessage('Unexpected response from server');
        }
        
      } catch (error) {
        console.error('Signup error:', error.response ? error.response.data : error.message);
        setErrorMessage(error.response?.data?.message || 'An unexpected error occurred. Please try again.');
      }
    },
    validationSchema: schema,
  });
  

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
            Sign up
          </Typography>
        </Grid>
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
            autoComplete="off"
          />
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
            autoComplete="off"
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
            autoComplete="off"
          />
          <FormControlLabel 
            control={<Checkbox checked={formik.values.terms} onChange={formik.handleChange} name="terms" />}
            label="I agree to Voosh's Terms & Conditions"
            sx={{ mt: 2 }}
          />
          {formik.errors.terms && (
            <Typography color="red" variant="body2">{formik.errors.terms}</Typography>
          )}
          <Box>
            <Button type="submit" color="primary" variant="contained" fullWidth>
              Sign up
            </Button>
          </Box>
        </form>
        {errorMessage && (
          <Box sx={{ mt: 2, color: 'red', textAlign: 'center' }}>
            <Typography>{errorMessage}</Typography>
          </Box>
        )}
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography>
            Already have an account? {" "}
            <Link href="#" onClick={() => navigate('/login')} >Login</Link>
          </Typography>
        </Box>
      </Paper>
    </Grid>
  );
}

export default SignUp;
