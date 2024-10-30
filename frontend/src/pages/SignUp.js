// src/pages/SignUp.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signUp } from "../services/authService";
import {
  Button,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Container,
  CircularProgress,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
    address: "",
    occupation: "",
    profileImage: "../images/defaultProfile.png"
  });
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (formData.password !== formData.confirmPassword) {
      setPasswordError(true);
      setSnackbarMessage("Passwords do not match");
      setSnackbarOpen(true);
      return;
    }
    setPasswordError(false);

    try {
      await signUp(formData.email, formData.password, formData);
      navigate("/"); // Redirect to the dashboard or home page
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <Container maxWidth="xs">
      <Paper
        style={{ padding: "30px", marginTop: "40px", textAlign: "center" }}
        elevation={3}
      >
        <Typography variant="h4" gutterBottom>
          Sign Up
        </Typography>
        <form onSubmit={handleSignUp} style={{ width: "100%" }}>
          <TextField
            label="Full Name"
            name="fullName"
            fullWidth
            margin="normal"
            value={formData.fullName}
            onChange={handleChange}
          />
          <TextField
            label="Email"
            type="email"
            name="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
          />
          <TextField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            fullWidth
            margin="normal"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={passwordError}
            helperText={passwordError ? "Passwords do not match" : ""}
          />
          <TextField
            label="Phone Number"
            name="phoneNumber"
            fullWidth
            margin="normal"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          <TextField
            label="Address"
            name="address"
            fullWidth
            margin="normal"
            value={formData.address}
            onChange={handleChange}
          />
          <TextField
            label="Occupation"
            name="occupation"
            fullWidth
            margin="normal"
            value={formData.occupation}
            onChange={handleChange}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ margin: "20px 0" }}
            onClick={handleSignUp}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Sign Up"}
          </Button>
          <Typography variant="body2">
            Already have an account? <Link to="/signin">Sign In</Link>
          </Typography>
        </form>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SignUp;
